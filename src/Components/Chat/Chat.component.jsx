import {} from "react";
import styles from "./chat.module.css";

export default function Chat({ messages }) {
  return <div className={`${styles.container} chat`}>{responses}</div>;
}
