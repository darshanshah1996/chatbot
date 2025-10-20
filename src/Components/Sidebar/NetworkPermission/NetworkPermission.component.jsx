import { useContext, useState, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, Check } from "lucide-react";
import ReactDOM from "react-dom/client";

import styles from "./NetworkPermission.module.css";
import { SettingsContext } from "../../../Context/SettingsContext";
import Tooltip from "../../Tooltip/Tooltip.component";
import { updateAppAccessFromOtherDevice } from "../../../Services/settings";
import { ToastContext } from "../../../Context/ToastContext";

async function copyToClipboard(text, ref) {
  try {
    await navigator.clipboard.writeText(text);

    const button = ReactDOM.createRoot(ref.target.parentNode);

    button.render(<Check color="#109E10" />);

    setTimeout(() => {
      button.render(<Clipboard />);
    }, 1500);
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
}

export default function NetworkPermission() {
  const [appURL, setAppURL] = useState("");
  const { allowNetworkSharing, setAllowNetowrkSharing } =
    useContext(SettingsContext);
  const { setToast } = useContext(ToastContext);

  useEffect(() => {
    if (allowNetworkSharing) {
      window.electronAPI.getSystemIPAddress().then((serverIPAddress) => {
        setAppURL(`http://${serverIPAddress}:3000/chatbot`);
      });
    }
  }, []);

  async function updateNetworkSharing(ref) {
    const areOtherDevicesAllowed = ref.target.checked;

    try {
      updateAppAccessFromOtherDevice(areOtherDevicesAllowed);

      if (areOtherDevicesAllowed && appURL.length === 0) {
        const serverIPAddress = await window.electronAPI.getSystemIPAddress();

        setAppURL(`http://${serverIPAddress}:3000/chatbot`);
      }

      setAllowNetowrkSharing(areOtherDevicesAllowed);
      setToast({
        message: "Permission Updated for Other Devices",
        type: "Success",
      });
    } catch (error) {
      console.log(error);

      setToast({
        message: "Error updating permission for other devices",
        type: "Error",
      });

      ref.target.checked = allowNetworkSharing;
    }
  }

  return (
    <div className={`${styles.container} network-permission`}>
      <label>
        <input
          type="checkbox"
          defaultChecked={allowNetworkSharing}
          onChange={async (ref) => await updateNetworkSharing(ref)}
          className={`${styles.networkSharingCheckbox}`}
        />
        <span>
          Allow other devices in the same network
          <Tooltip text="To access App from other device the device MAC Address should be update in the Application Config file" />
        </span>
      </label>
      <div className={styles.networkDetailsSection}>
        {allowNetworkSharing && (
          <div className={styles.networkDetails}>
            <p className={styles.networkDetailsSectionInfo}>
              Visit following link on your device to access the app
            </p>
            <SyntaxHighlighter language="markdown" style={materialDark}>
              {appURL}
            </SyntaxHighlighter>
            <div className={`${styles.copyToClipboard}`}>
              <button
                title="Copy to Clipboard"
                onClick={async (e) => {
                  await copyToClipboard(appURL, e);
                }}
              >
                <Clipboard />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
