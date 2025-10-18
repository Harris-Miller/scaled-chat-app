import type { Headers } from 'undici-types';

import type { BasicAuth, IPHeaders } from './types';

const NANOSECOND = 1;
const MICROSECOND = 1e3 * NANOSECOND;
const MILLISECOND = 1e3 * MICROSECOND;
const SECOND = 1e3 * MILLISECOND;

/**
 * List of IP headers to check in order of priority.
 *
 * @remarks
 * The order of the headers in this list determines the priority of the headers to use when determining the client IP address.
 * If the first header is not present, the second header is checked, and so on.
 */
export const headersToCheck: IPHeaders[] = [
  'x-forwarded-for', // X-Forwarded-For is the de-facto standard header
  'x-real-ip', // Nginx proxy/FastCGI
  'x-client-ip', // Apache [mod_remoteip](https://httpd.apache.org/docs/2.4/mod/mod_remoteip.html#page-header)
  'cf-connecting-ip', // Cloudflare
  'fastly-client-ip', // Fastly
  'x-cluster-client-ip', // GCP
  'x-forwarded', // RFC 7239
  'forwarded-for', // RFC 7239
  'forwarded', // RFC 7239
  'appengine-user-ip', // GCP
  'true-client-ip', // Akamai and Cloudflare
  'cf-pseudo-ipv4', // Cloudflare
];

/**
 * Checks if a given string is a valid base64 encoded string.
 *
 * @param str - The string to be checked.
 *
 * @returns A boolean indicating whether the string is a valid base64 encoded string.
 */
const isValidBase64 = (str: string): boolean => {
  return Buffer.from(str, 'base64').toString('base64') === str;
};

/**
 * Parses a Basic Authentication header string and returns an object containing the username and password.
 *
 * @param header - The Basic Authentication header string to parse.
 *
 * @returns An object containing the username and password, or undefined if the header is invalid.
 */
export const parseBasicAuthHeader = (header: string): BasicAuth | undefined => {
  const [type, authString]: string[] = header.split(' ');

  // Check if authType is Basic and authString is valid base64
  if (type !== 'Basic') return undefined;
  if (!isValidBase64(authString!)) return undefined;

  const authStringDecoded = Buffer.from(authString!, 'base64').toString();
  const [username, password] = authStringDecoded.includes(':')
    ? authStringDecoded.split(':', 2)
    : [undefined, undefined];

  return {
    password: password ?? '',
    type,
    username: username ?? '',
  };
};

/**
 * Formats a duration in nanoseconds to a human-readable string.
 *
 * @param durationInNanoseconds - The duration in nanoseconds to format.
 *
 * @returns A string representing the formatted duration.
 */
export const formatDuration = (durationInNanoseconds: number): string => {
  if (durationInNanoseconds >= SECOND) {
    return `${(durationInNanoseconds / SECOND).toPrecision(2)}s`;
  }
  if (durationInNanoseconds >= MILLISECOND) {
    return `${(durationInNanoseconds / MILLISECOND).toPrecision(4)}ms`;
  }
  if (durationInNanoseconds >= MICROSECOND) {
    return `${(durationInNanoseconds / MICROSECOND).toPrecision(4)}µs`;
  }
  return `${durationInNanoseconds.toPrecision(4)}ns`;
};

/**
 * Returns the IP address of the client making the request.
 *
 * @param headers - The headers object from the request.
 * @param ipHeaders - An array of header names to check for the IP address. Defaults to common IP headers.
 *
 * @returns The IP address of the client, or undefined if not found.
 */
export const getIP = (headers: Headers, ipHeaders: IPHeaders[] = headersToCheck): string | undefined => {
  const clientIP = ipHeaders.find(header => {
    const maybeIP = headers.get(header);
    return maybeIP !== null && typeof maybeIP === 'string';
  });

  return clientIP?.split(',')[0];
};

/**
 * Returns the name of the formatting method for a given format string.
 *
 * @param format - The format string to get the formatting method name for.
 *
 * @returns The name of the formatting method.
 */
export const getFormattingMethodName = (format: string): string => {
  return `format${format.charAt(0).toUpperCase() + format.slice(1)}`;
};
