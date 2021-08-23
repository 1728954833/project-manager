import { Command } from 'commander';

const program = new Command();

export const registerVersion = () => {
  program
    .version(`togo ${require('../package.json').version}`)
    .usage('<command>');
};

export const registerAddProject = () => {
  program
    .command('add <title>')
    .option('-p, --path', 'input your project absolute path')
    .description('add TODO item')
    .action((title: string, cmd: Command) => {
      console.log(title, cmd);
    });
};
