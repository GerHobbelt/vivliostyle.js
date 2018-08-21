// Copyright 2009 The Closure Library Authors. All Rights Reserved.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//      http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Provides a base class for custom Error objects such that the
 * stack is correctly maintained.
 *
 * You should never need to throw goog.debug.Error(msg) directly, Error(msg) is
 * sufficient.
 *
 */

/**
 * Base class for custom error objects.
 * @param opt_msg The message associated with the error.
 */
export class Error extends Error {
  stack: any;
  message: any;

  /**
   * Whether to report this error to the server. Setting this to false will
   * cause the error reporter to not report the error back to the server,
   * which can be useful if the client knows that the error has already been
   * logged on the server.
   */
  reportErrorToServer: boolean = true;

  constructor(opt_msg?: any) {
    // Attempt to ensure there is a stack trace.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Error);
    } else {
      let stack = (new Error()).stack;
      if (stack) {
        this.stack = stack;
      }
    }
    if (opt_msg) {
      this.message = String(opt_msg);
    }
  }
}

/** @override */
Error.prototype.name = 'CustomError';