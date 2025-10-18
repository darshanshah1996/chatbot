const baseUrl = (() => {
  if (window?.electronAPI?.getSystemIPAddress !== undefined) {
    return "http://localhost:3000";
  } else {
    const currentUR = new URL(window.location.href);
    return `http://${currentUR.hostname}:3000`;
  }
})();

export default { baseUrl: baseUrl };
