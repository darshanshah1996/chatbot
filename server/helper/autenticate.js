import { toMAC, getTable } from "@network-utils/arp-lookup";
import { loadAppConfig } from "./load_config.js";
import os from "os";

const appConfig = loadAppConfig();

function getDeviceIP() {
  const networkDetails = os.networkInterfaces();
  const ethernetDetails = networkDetails["Ethernet"];
  const ipv4ddress = ethernetDetails.find(
    (ethernetDetail) => ethernetDetail.family === "IPv4"
  ).address;

  return ipv4ddress;
}

export async function authenticateDevice(ipAddress) {
  const formattedIPAddress = ipAddress.replace("::ffff:", ""); // remove IPv6 prefix
  const serverIPAddress = getDeviceIP();

  if (
    formattedIPAddress === "::1" ||
    formattedIPAddress === "127.0.0.1" ||
    formattedIPAddress === serverIPAddress
  )
    return true; // Allow loop back address and device running the server

  const allowedMACAddress = appConfig.allowedMACAddress;
  const deviceMACAddress = await toMAC(formattedIPAddress);

  return allowedMACAddress.includes(deviceMACAddress);
}
