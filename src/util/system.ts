import { exec } from 'child_process';

export const execOrder = async (
  order: string,
  path: string = process.cwd()
) => {
  return new Promise((resolve, reject) => {
    exec(
      order,
      {
        cwd: path,
      },
      (err, stdout, stderr) => {
        if (err || stderr) {
          console.log(err || stderr);
          reject(err || stderr);
        }
        resolve(stdout);
      }
    );
  });
};

export const openVsCode = async (path: string) => {
  return execOrder(`code ${path}`);
};
