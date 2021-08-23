import { Command } from 'commander';
import { saveProject, getProjects, existsProject } from './util/project';
import { ProjectAddArgs, ProjectItem } from './interface';
import chalk from 'chalk';
import { openVsCode } from './util/system';
import { prompt } from 'inquirer';

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
  .action(async (name: string, args: ProjectAddArgs) => {
    const { path } = args;
    const project: ProjectItem = {
      name,
      path,
      excuUnit: {},
    };

    const [isExists] = await existsProject(name);
    if (isExists) {
      const { approvel } = await prompt({
        type: 'confirm',
        message: 'Already have this project, Do you need to overwrite',
        name: 'approvel',
      });
      if (!approvel) return;
    }
    await saveProject(name, project);
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
    if (project) {
      await openVsCode(project.path).catch(() => {
        console.log(chalk.red(`open ${project.path} error`));
        console.log(chalk.red('1. make sure you install vscode'));
        console.log(
          chalk.red('2. if you install vscode please set vscode to global env')
        );
        console.log(
          chalk.red(
            `3. use command+shift+p and input ${chalk.yellow(
              '`> install code`'
            )} to set`
          )
        );
        console.log(chalk.red('4. retry'));
      });
    } else {
      console.log(chalk.red(`open ${name} error, dont have this project`));
    }
  });

program.parse();
