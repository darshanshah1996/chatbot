import { useState, useEffect, useContext } from "react";
import styles from "./Welcome.module.css";
import * as userServices from "../../Services//user";
import Sidebar from "../Sidebar/Sidebar.component";
import { SettingsContext } from "../../Context/SettingsContext";

export default function Welcome() {
  const [userName, updateUserName] = useState("");

  const { showSiedbar } = useContext(SettingsContext);

  useEffect(() => {
    (async () => {
      const username = await userServices.getUserName();

      updateUserName(username);
    })();
  }, []);

  if (userName.length === 0) return;

  return (
    <div className={`${styles.container} welcome`}>
      {showSiedbar && <Sidebar />}
      <div>
        <h3 className={`${styles.heading}`}>Welcome {userName}!</h3>
        <p className={`${styles.subTitle}`}>Ask question to begin chat!</p>
      </div>
    </div>
  );
}
