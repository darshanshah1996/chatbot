import styles from "./Tooltip.module.css";

import { CircleAlert } from "lucide-react";

const Tooltip = ({ text }) => {
  return (
    <div className={`${styles.tooltipWrapper} ${styles.tooltipTop}`}>
      <CircleAlert
        style={{ height: "1.3rem" }}
        className={`${styles.tooltip}`}
      />
      <span className={`${styles.tooltipBox}`}>{text}</span>
    </div>
  );
};

export default Tooltip;
