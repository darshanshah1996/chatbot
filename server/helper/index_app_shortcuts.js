import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

const configFolder = 'D://Chatbot';
const fileName = 'shortcuts.json';
const powershellScript = `
$shell = New-Object -ComObject WScript.Shell

$directories = @(
    "$env:APPDATA\\Microsoft\\Windows\\Start Menu",
    "$env:ProgramData\\Microsoft\\Windows\\Start Menu",
    "$env:USERPROFILE\\Desktop",
    "$env:PUBLIC\\Desktop"
)

$results = foreach ($directory in $directories) {
    if (Test-Path -LiteralPath $directory) {

        Get-ChildItem -LiteralPath $directory -Filter "*.lnk" -File -Recurse -ErrorAction SilentlyContinue |
            ForEach-Object {

                try {
                    $shortcut = $shell.CreateShortcut($_.FullName)

                    $targetPath = $shortcut.TargetPath

                    # Check both shortcut path and target path.
                    # PowerShell -match is case-insensitive.
                    if (
                        $_.FullName -match "(^|\\\\)(uni|ins)[^\\\\]*$" -or
                        $targetPath -match "(^|\\\\)(uni|ins)[^\\\\]*$"
                    ) {
                        return
                    }

                    [PSCustomObject]@{
                        name         = $_.BaseName
                        shortcutPath = $_.FullName
                        targetPath   = $targetPath
                        arguments    = $shortcut.Arguments
                        workingDir   = $shortcut.WorkingDirectory
                        iconPath     = $shortcut.IconLocation
                    }
                }
                catch {
                    # Ignore shortcuts that cannot be read
                }
            }
    }
}

$results | ConvertTo-Json -Depth 3 -Compress
`;

function storeAppShortcutPaths(shortcutList) {
  const appPaths = {};

  shortcutList.forEach((shortcut) => {
    appPaths[shortcut.name.toLowerCase()] = shortcut.shortcutPath;
  });

  try {
    const jsonString = JSON.stringify(appPaths, null, 2);

    if (!fs.existsSync(configFolder)) {
      fs.mkdirSync(configFolder);
    }

    if (!fs.existsSync(path.join(configFolder, fileName))) {
      fs.writeFileSync(path.join(configFolder, fileName), jsonString);
    }
  } catch (error) {
    console.error('Error storing app shortcut paths:', error);
  }
}

export function indexAppShortcuts() {
  execFile(
    'powershell.exe',
    [
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      powershellScript,
    ],
    {
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error('PowerShell error:', error);
        console.error('stderr:', stderr);
        return;
      }

      try {
        const output = stdout.trim();

        const shortcuts = output ? JSON.parse(output) : [];

        const shortcutList = Array.isArray(shortcuts) ? shortcuts : [shortcuts];

        storeAppShortcutPaths(shortcutList);
      } catch (parseError) {
        console.error('Failed to parse PowerShell output');
        console.error(stdout);
        console.error(parseError);
      }
    },
  );
}
