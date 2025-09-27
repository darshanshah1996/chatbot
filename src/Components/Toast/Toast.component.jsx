import { useEffect, useContext } from "react";

import styles from "./Toast.module.css";
import { ToastContext } from "../../Context/ToastContext";

const Toast = () => {
  const { toast, setToast } = useContext(ToastContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  });

  if (toast === null) return null;

  return (
    <div
      className={`${styles.container} toast-container`}
      key={new Date().getTime()}
    >
      <div
        className={`${styles.toast}  ${styles[`toast${toast.type}`]}`}
        role="alert"
      >
        <span>{toast.message}</span>
        <button
          className={`${styles.toastClose}`}
          onClick={() => {
            setToast(null);
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
