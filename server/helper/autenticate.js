import { toMAC } from '@network-utils/arp-lookup';
import os from 'os';

import { loadAppConfig } from './config.js';

const appConfig = loadAppConfig();

function getDeviceIP() {
  const networkInterfaces = os.networkInterfaces();
  const localNetworks =
    networkInterfaces['Ethernet'] || networkInterfaces['Wi-Fi'];
  const ipv4ddress = localNetworks.find(
    (network) => network.family === 'IPv4',
  ).address;

  return ipv4ddress;
}

export async function authenticateDevice(deviceIP, areOtherDevicesAllowed) {
  const formattedIPAddress = deviceIP.replace('::ffff:', ''); // remove IPv6 prefix
  const serverIPAddress = getDeviceIP();

  if (
    formattedIPAddress === '::1' ||
    formattedIPAddress === '127.0.0.1' ||
    formattedIPAddress === serverIPAddress
  )
    return true; // Allow loop back address and device running server

  if (!areOtherDevicesAllowed) return false;

  const allowedMACAddress = Object.values(appConfig.allowedMACAddress);
  const deviceMACAddress = await toMAC(formattedIPAddress);

  return allowedMACAddress.includes(deviceMACAddress);
}

export async function validateDeviceForAllowingNetworkAccess(deviceIP) {
  const formattedIPAddress = deviceIP.replace('::ffff:', ''); // remove IPv6 prefix
  const allowedIPAddress = ['::1', '127.0.0.1'];

  return allowedIPAddress.includes(formattedIPAddress);
}
