import { exec } from 'child_process';

export const execOrder = async (order: string) => {
  return new Promise((resolve, reject) => {
    exec(order, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

export const openVsCode = async (path: string) => {
  return execOrder(`code ${path}`);
};
