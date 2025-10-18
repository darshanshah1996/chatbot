import { toMAC } from "@network-utils/arp-lookup";
import { loadAppConfig } from "./config_helper.js";

const appConfig = loadAppConfig();

export async function authenticateDevice(ipAddress) {
  const formattedIPAddress = ipAddress.replace("::ffff:", ""); // remove IPv6 prefix

  if (formattedIPAddress === "::1" || formattedIPAddress === "127.0.0.1")
    return true; // Allow loop back address

  const allowedMACAddress = appConfig.allowedMACAddress;
  const deviceMACAddress = await toMAC(formattedIPAddress);

  return allowedMACAddress.includes(deviceMACAddress);
}
