import Homepage from "./Components/Homepage/Hopmepage.component";
import styles from "./App.module.css";
import { ChatContextProvider } from "./Context/ChatContext";
import { SettingsContextProvider } from "./Context/SettingsContext";
import { ToastContextProvider } from "./Context/ToastContext";

function App() {
  return (
    <div className={`${styles.container}`}>
      <ChatContextProvider>
        <SettingsContextProvider>
          <ToastContextProvider>
            <Homepage />
          </ToastContextProvider>
        </SettingsContextProvider>
      </ChatContextProvider>
    </div>
  );
}

export default App;
