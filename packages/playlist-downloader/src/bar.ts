/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/no-explicit-any */

import readline from 'readline';

function timeOut(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function print(parameters: any, ...args: any) {
  process.stdout.write(parameters, ...args);
}

(async () => {
  print('Hello, world!\n');
  print('Hello, world!');
  await timeOut(1_000);
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
  print('Bye, world!\n');
})();
