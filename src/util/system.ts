import { exec } from 'child_process';

export const openVsCode = (path: string) => {
  return new Promise((resolve, reject) => {
    console.log(`code ${path}`);
    exec(`code ${path}`, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};
