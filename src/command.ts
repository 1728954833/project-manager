import { Command } from 'commander';
import { saveProject, getProjects } from './util/file';
import { ProjectAddArgs, ProjectItem } from './interface';
import chalk from 'chalk';
import { openVsCode } from './util/system';

const program = new Command();

program
  .version(`project-manager ${require('../package.json').version}`)
  .usage('<command>');

program
  .command('add <name>')
  .option(
    '-p, --path <absolutePath>',
    'input your project absolute path, the default is your current folder',
    process.cwd()
  )
  .description('add project item')
  .action((name: string, args: ProjectAddArgs) => {
    const { path } = args;
    const project: ProjectItem = {
      name,
      path,
      excuUnit: {},
    };
    saveProject(name, project);
    console.log(
      chalk.blue(
        `success save project ${chalk.yellow(`[name:${name}]:[path:${path}]`)}`
      )
    );
  });

program
  .command('list')
  .description('list all your project')
  .action(async () => {
    const projects = await getProjects();
    console.table(projects, ['path']);
  });

program
  .command('open <name>')
  .description('open project with vscode if you already install vscode')
  .action(async (name: string) => {
    const projects = await getProjects();
    const project = projects[name];
    console.log(project);
    if (project) {
      await openVsCode(project.path);
    }
  });

program.parse();
