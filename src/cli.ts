require('dotenv').config({ path: '.env' });
import { Command } from 'commander';
import {
  saveProject,
  getProjects,
  deleteProject,
  saveProjectExecUnit,
  getProject,
} from './util/project';
import { ExecUnit, ProjectItem } from './interface';
import chalk from 'chalk';
import { execOrder, openVsCode } from './util/system';
import { prompt } from 'inquirer';

const program = new Command();

program
  .version(`project-manager ${require('../package.json').version}`)
  .usage('<command>');

program
  .command('list')
  .description('list all your project')
  .action(async () => {
    const projects = await getProjects();
    if (Object.keys(projects).length === 0) {
      return console.log(`dont have project, please add`);
    }
    console.table(projects, ['path', 'description']);
  });

program
  .command('add <name>')
  .option(
    '-p, --path <absolutePath>',
    'input your project absolute path, the default is your current folder',
    process.cwd()
  )
  .requiredOption(
    '-d, --description <description>',
    'input your project description'
  )
  .description('add project item')
  .action(
    async (name: string, args: Pick<ProjectItem, 'description' | 'path'>) => {
      const { path, description } = args;
      const project: ProjectItem = {
        name,
        path,
        description,
        execUnit: {},
      };

      const exists = await getProject(name);
      if (exists) {
        const { approval } = await prompt({
          type: 'confirm',
          message: 'Already have this project, Do you need to overwrite',
          name: 'approvel',
        });
        if (!approval) return;
      }
      await saveProject(name, project);
    }
  );

program
  .command('remove <name>')
  .description('delete project item')
  .action(async (name: string) => {
    const exists = await getProject(name);
    if (!exists) {
      return console.log(
        chalk.red(`delete ${name} error, dont have this project`)
      );
    }
    await deleteProject(name);
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

program
  .command('exec-list <name>')
  .description('list project exec list')
  .action(async (name: string) => {
    const project = await getProject(name);

    if (!project) {
      return console.log(chalk.red(`run error, dont have this project`));
    }

    if (!project.execUnit || Object.keys(project.execUnit).length === 0) {
      return console.log(`dont have this order, please add`);
    }

    console.table(project.execUnit, ['exec', 'description']);
  });

program
  .command('exec-set <name>')
  .description('add project exec order')
  .requiredOption('-n, --name <name>', 'input your exec name')
  .requiredOption('-e, --exec <exec>', 'input your exec order')
  .requiredOption(
    '-d, --description <description>',
    'input your exec description'
  )
  .action(async (name: string, args: ExecUnit) => {
    const project = await getProject(name);
    if (!project) {
      console.log(chalk.red(`set error, dont have this project`));
    }
    const repeat = Object.keys(project.execUnit).includes(args.name);
    if (repeat) {
      const { approval } = await prompt({
        type: 'confirm',
        message: 'have repeat order, Do you need to overwrite',
        name: 'approvel',
      });
      if (!approval) return;
    }
    await saveProjectExecUnit(name, args);
  });

program
  .command('exec-remove <name>')
  .requiredOption('-n, --name <name>', 'input your exec name')
  .action(async (name: string, args: Pick<ExecUnit, 'name'>) => {
    const { name: execName } = args;
    const project = await getProject(name);

    if (!project) {
      return console.log(chalk.red(`delete error, dont have this project`));
    }

    if (!project.execUnit[execName]) {
      return console.log(chalk.red(`delete error, dont have this order`));
    }

    delete project.execUnit[execName];
    await saveProjectExecUnit(name, project.execUnit[execName]);
  });

program
  .command('run <name> <execName>')
  .description('exec order')
  .action(async (name: string, execName: string) => {
    const project = await getProject(name);

    if (!project) {
      return console.log(chalk.red(`run error, dont have this project`));
    }

    if (!project.execUnit[execName]) {
      return console.log(chalk.red(`run error, dont have this order`));
    }

    const execUnit = project.execUnit[execName];
    const res = await execOrder(execUnit.exec, project.path);
    console.log(res);
  });

program.parse();
