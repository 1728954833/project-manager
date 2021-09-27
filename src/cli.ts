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
import { configPath } from './util/project';

const program = new Command();

program
  .version(`project-manager ${require('../package.json').version}`)
  .usage('<command>');

program
  .command('list')
  .description('list projects')
  .action(async () => {
    const projects = await getProjects();
    if (Object.keys(projects).length === 0) {
      return console.log(`dont have project, please add`);
    }
    console.table(projects, ['path', 'description', 'default']);
  });

program
  .command('add <name>')
  .option('-p, --path <absolutePath>', 'absolute path', process.cwd())
  .option('-d, --description <description>', 'description')
  .description('add project')
  .action(
    async (name: string, args: Pick<ProjectItem, 'description' | 'path'>) => {
      const { path, description = '' } = args;
      const project: ProjectItem = {
        name,
        path,
        description,
        default: '',
        execUnit: {},
      };

      const exists = await getProject(name);
      if (exists) {
        const { approval } = await prompt({
          type: 'confirm',
          message: 'Already have this project, Do you need to overwrite',
          name: 'approval',
        });
        if (!approval) return;
      }
      await saveProject(name, project);
    }
  );

program
  .command('update <name>')
  .option('-p, --path <absolutePath>', 'absolute path', process.cwd())
  .option('-d, --description <description>', 'description')
  .description('update project')
  .action(async (name: string, args: Pick<ProjectItem, 'description' | 'path'>) => {
    const { path, description = '' } = args;
    const project: ProjectItem = {
      name,
      path,
      description,
      default: '',
      execUnit: {},
    };

    const exists = await getProject(name);
    if (!exists) return console.log(chalk.red('dont have this project'));
    await saveProject(name, project);
  });

program
  .command('rename <oldName> <newName>')
  .description('update project')
  .action(async (oldName: string, newName: string) => {
    const existsOld = await getProject(oldName);
    const existsNew = await getProject(newName);
    if (!existsOld) return console.log(chalk.red('dont have this project'));
    if (existsNew) {
      const { approval } = await prompt({
        type: 'confirm',
        message: 'Already have this project, Do you need to overwrite',
        name: 'approval',
      });
      if (!approval) return;
    }
    await saveProject(newName, {
      ...existsOld,
      name: newName
    });
    await deleteProject(oldName);
  });

program
  .command('remove <name>')
  .description('delete project')
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
  .description('open project use vscode')
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
  .description('list project command')
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
  .description('add command')
  .requiredOption('-n, --name <name>', 'command name')
  .requiredOption('-e, --exec <exec>', 'command')
  .option('-d, --description <description>', 'description')
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
        name: 'approval',
      });
      if (!approval) return;
    }
    await saveProjectExecUnit(name, args);
  });

program
  .command('exec-default <name>')
  .description(
    'set default command, if set just need run `pm run [command name]`'
  )
  .requiredOption('-d, --default <default>', 'set default command')
  .action(async (name: string, args: { default: string }) => {
    const project = await getProject(name);
    if (!project) {
      return console.log(
        chalk.red(`set default error, dont have this project`)
      );
    }

    if (!Object.keys(project.execUnit).includes(args.default)) {
      return console.log(chalk.red(`set default error, dont have this order`));
    }

    project.default = args.default;
    await saveProject(name, project);
  });

program
  .command('exec-remove <name>')
  .description('delete command')
  .requiredOption('-n, --name <name>', 'command name')
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
  .command('run <name>')
  .option('-n, --execName <execName>', 'command name')
  .description('execute command')
  .action(async (name: string, args: Pick<ExecUnit, 'name'>) => {
    let { name: execName } = args;
    const project = await getProject(name);

    if (!project) {
      return console.log(chalk.red(`run error, dont have this project`));
    }

    if (!execName) {
      if (project.default) {
        execName = project.default;
      } else {
        return console.log(
          chalk.red('run error, please input `-n <name>` choose your order')
        );
      }
    }

    if (!project.execUnit[execName]) {
      return console.log(chalk.red(`run error, dont have this order`));
    }

    const execUnit = project.execUnit[execName];
    await execOrder(execUnit.exec, project.path);
  });

program
  .description('open config file')
  .command('config')
  .action(async () => {
    openVsCode(configPath);
  });
program.parse();
