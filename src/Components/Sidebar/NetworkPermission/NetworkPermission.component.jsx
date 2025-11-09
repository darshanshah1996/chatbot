import { useContext, useState, useEffect, useRef } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clipboard, Check } from 'lucide-react';
import ReactDOM from 'react-dom/client';

import styles from './NetworkPermission.module.css';
import { SettingsContext } from '../../../Context/SettingsContext';
import Tooltip from '../../Tooltip/Tooltip.component';
import { updateAppAccessFromOtherDevice } from '../../../Services/settings';
import { ToastContext } from '../../../Context/ToastContext';
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog.component';

async function copyToClipboard(text, ref) {
  try {
    await navigator.clipboard.writeText(text);

    const button = ReactDOM.createRoot(ref.target.parentNode);

    button.render(<Check color='#109E10' />);

    setTimeout(() => {
      button.render(<Clipboard />);
    }, 1500);
  } catch (err) {
    console.error('Could not copy text: ', err);
  }
}

export default function NetworkPermission() {
  const [appURL, setAppURL] = useState('');
  const { allowNetworkSharing, setAllowNetowrkSharing, setDialogMessage } =
    useContext(SettingsContext);
  const { setToast } = useContext(ToastContext);
  const allowNetworkSharingCheckbox = useRef(null);

  useEffect(() => {
    if (allowNetworkSharing) {
      window.electronAPI.getSystemIPAddress().then((serverIPAddress) => {
        setAppURL(`http://${serverIPAddress}:3000/chatbot`);
      });
    }
  }, []);

  async function toggleNetworkSharingCheckbox() {
    const isNetworkSharingCheckboxChecked =
      allowNetworkSharingCheckbox.current.checked;

    if (isNetworkSharingCheckboxChecked) {
      setDialogMessage(
        'Do you want to allow other devices in the same network to access the app?',
      );
    } else {
      setDialogMessage(
        'Do you want to disallow other devices in the same network to access the app?',
      );
    }
  }

  async function updateNetworkSharing(consent) {
    if (consent === false) {
      allowNetworkSharingCheckbox.current.checked =
        !allowNetworkSharingCheckbox.current.checked;

      return;
    }

    try {
      const areOtherDevicesAllowed =
        allowNetworkSharingCheckbox.current.checked;

      updateAppAccessFromOtherDevice(areOtherDevicesAllowed);

      if (areOtherDevicesAllowed && appURL.length === 0) {
        const serverIPAddress = await window.electronAPI.getSystemIPAddress();

        setAppURL(`http://${serverIPAddress}:3000/chatbot`);
      }

      setAllowNetowrkSharing(areOtherDevicesAllowed);
      setToast({
        message: 'Permission updated for Other Devices',
        type: 'Success',
      });
    } catch (error) {
      console.log(error);

      setToast({
        message: 'Error updating permission for other devices',
        type: 'Error',
      });

      allowNetworkSharingCheckbox.current.checked =
        !allowNetworkSharingCheckbox.current.checked;
    }
  }

  return (
    <div className={`${styles.container} network-permission`}>
      <label>
        <input
          type='checkbox'
          defaultChecked={allowNetworkSharing}
          onChange={() => toggleNetworkSharingCheckbox()}
          ref={allowNetworkSharingCheckbox}
          className={`${styles.networkSharingCheckbox}`}
        />
        <span>
          Allow other devices in the same network
          <Tooltip text='To access App from other device the device MAC Address should be update in the Application Config file' />
        </span>
      </label>
      <div className={styles.networkDetailsSection}>
        {allowNetworkSharing && (
          <div className={styles.networkDetails}>
            <p className={styles.networkDetailsSectionInfo}>
              Visit following link on your device to access the app
            </p>
            <SyntaxHighlighter language='markdown' style={materialDark}>
              {appURL}
            </SyntaxHighlighter>
            <div className={`${styles.copyToClipboard}`}>
              <button
                title='Copy to Clipboard'
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
      <ConfirmDialog callBackFunction={updateNetworkSharing} />
    </div>
  );
}
