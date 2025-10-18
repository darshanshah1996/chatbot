import { toMAC } from "@network-utils/arp-lookup";
import { loadAppConfig } from "./config_helper.js";
import os from "os";

const appConfig = loadAppConfig();

function getDeviceIP() {
  const networkDetails = os.networkInterfaces();
  const ipv4ddress = networkDetails["Ethernet"].find(
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
    return true; // Allow loop back address and device running server

  console.log("MAC Details");
  const allowedMACAddress = Object.values(appConfig.allowedMACAddress);
  const deviceMACAddress = await toMAC(formattedIPAddress);

  return allowedMACAddress.includes(deviceMACAddress);
}
