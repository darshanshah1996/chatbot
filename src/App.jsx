import Homepage from "./Components/Homepage/Hopmepage.component";
import styles from "./App.module.css";
import { ChatContextProvider } from "./Context/ChatContext";
import { SettingsContextProvider } from "./Context/SettingsContext";

function App() {
  return (
    <div className={`${styles.container}`}>
      <ChatContextProvider>
        <SettingsContextProvider>
          <Homepage />
        </SettingsContextProvider>
      </ChatContextProvider>
    </div>
  );
}

export default App;
