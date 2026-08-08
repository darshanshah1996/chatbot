import { uuidv4, z } from 'zod';
import crypto from 'crypto';

const threadPool = {};

function generateThreadId() {
  const schema = z.uuidv4();
  const id = crypto.randomUUID();

  return schema.parse(id);
}

export function getUserThreadId(deviceIP) {
  let formattedDeviceIP = deviceIP.replace('::ffff:', ''); // remove IPv6 prefix
  formattedDeviceIP =
    formattedDeviceIP === '::1' ? '127.0.0.1' : formattedDeviceIP;

  if (Object.hasOwn(threadPool, formattedDeviceIP))
    return threadPool[formattedDeviceIP];

  threadPool[formattedDeviceIP] = generateThreadId();

  return threadPool[formattedDeviceIP];
}
