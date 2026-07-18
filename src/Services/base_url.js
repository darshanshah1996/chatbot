const baseUrl = (() => {
  if (window?.electronAPI?.getSystemIPAddress !== undefined) {
    return 'http://localhost:3000';
  } else {
    const currentURL = new URL(window.location.href);
    return `http://${currentURL.hostname}:3000`;
  }
})();

export default baseUrl;
