import styles from "./Loading.module.css";

export default function ThinkingDots() {
  return (
    <div className={`${styles.thinkingDots}`}>
      <span>thinking</span>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
}
