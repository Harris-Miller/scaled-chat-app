import type { Context } from 'elysia';

import type { Log } from './log';

// This creates a type that is like "json" | "common" | "short"
type LogFormatString = {
  [K in keyof typeof Log.prototype as K extends `format${infer Rest}`
    ? Lowercase<Rest>
    : never]: (typeof Log.prototype)[K];
};

// This is the type of a function that takes a LogObject and returns a string or a LogObject
type LogFormatMethod = (log: LogObject) => LogObject | string;

// This creates a LogFormat const that is like "JSON"="json", "COMMON"="common", "SHORT"="short"
type LogFormatRecord = Record<Uppercase<keyof LogFormatString>, string>;

//
export const LogFormat = {
  COMMON: 'common',
  JSON: 'json',
  SHORT: 'short',
  // Add other methods here
} as const;

export type LogFormatType = LogFormatMethod | LogFormatRecord | LogFormatter | keyof LogFormatString;

/**
 * Represents the basic authentication credentials.
 */
export type BasicAuth = {
  password: string;
  type: string;
  username: string;
};

/**
 * Represents the list of IP headers that can be used to retrieve the client's IP address.
 */
export type IPHeaders =
  | 'appengine-user-ip'
  | 'cf-connecting-ip'
  | 'cf-pseudo-ipv4'
  | 'fastly-client-ip'
  | 'forwarded-for'
  | 'forwarded'
  | 'true-client-ip'
  | 'x-client-ip'
  | 'x-cluster-client-ip'
  | 'x-forwarded-for'
  | 'x-forwarded'
  | 'x-real-ip';

/**
 * Represents a log object that contains information about a request and its response.
 */
export type LogObject = {
  /**
   * An optional error message associated with the request.
   */
  error?: Error | object | string;
  request: {
    /**
     * The headers included in the request.
     */
    headers?: Record<string, string>;
    /**
     * The IP address of the client that made the request.
     */
    ip?: string;
    /**
     * The HTTP method used in the request.
     */
    method: string;
    /**
     * The unique ID of the request.
     */
    requestID?: string;
    /**
     * The URL of the request.
     */
    url: {
      /**
       * The params string of the URL.
       */
      params: Record<string, string>;
      /**
       * The path of the URL.
       */
      path: string; // | Record<string, never>;
    };
  };
  response: {
    /**
     * The status code of the response.
     */
    status_code: number | string | undefined;
    /**
     * The time it took to process the request and generate the response, in milliseconds.
     */
    time: number;
  };
};

/**
 * Options for the request logger middleware.
 */
export interface RequestLoggerOptions {
  format?: LogFormatType;
  // string | ((log: LogObject) => string | LogObject);
  includeHeaders?: string[];
  ipHeaders?: IPHeaders[];
  level?: string;
  skip?: (ctx: Context) => boolean;
}

/**
 * Common Logger interface.
 */
export interface Logger {
  debug: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
}

/**
 * Interface for a log formatter.
 *
 * A log formatter is a class with a format() method that takes a log
 * object and returns a string or a log object.
 */
export interface LogFormatter {
  /**
   * Formats a log object.
   *
   * @param log Log object to format
   *
   * @returns Formatted log object or string
   */
  format(log: LogObject): LogObject | string;
}
