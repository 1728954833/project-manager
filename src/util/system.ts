import { execSync } from 'child_process';

export const execOrder = async (
  order: string,
  path: string = process.cwd()
) => {
  return new Promise((resolve, reject) => {
    console.log(path, order);
    try {
      const res = execSync(order, {
        cwd: path,
        maxBuffer: 2000000,
        stdio: 'inherit',
      });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

export const openVsCode = async (path: string) => {
  return execOrder(`code ${path}`);
};
