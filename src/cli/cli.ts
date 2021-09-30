import chalk from 'chalk'
import { prompt } from 'inquirer'
import { Command as CommanderCommand } from 'commander'
import {
  saveProject,
  getProjects,
  deleteProject,
  getProject,
  configPath,
} from '../util/project'
import { ProjectItem } from '../interface'
import { openVsCode } from '../util/system'
import { empty } from '../util/object'

export const registerNormal = (program: CommanderCommand) => {
  program
    .command('list')
    .description('list projects')
    .action(async () => {
      const projects = await getProjects()
      if (empty(projects)) {
        return console.log(`dont have project, please add`)
      }
      console.table(projects, ['path', 'description', 'default'])
    })

  program
    .command('add <name>')
    .option('-p, --path <absolutePath>', 'absolute path', process.cwd())
    .option('-d, --description <description>', 'description')
    .description('add project')
    .action(
      async (name: string, args: Pick<ProjectItem, 'description' | 'path'>) => {
        const { path, description = '' } = args
        const project: ProjectItem = {
          name,
          path,
          description,
          default: '',
          commands: {},
        }

        const exists = await getProject(name)
        if (exists) {
          const { approval } = await prompt({
            type: 'confirm',
            message: 'Already have this project, Do you need to overwrite',
            name: 'approval',
          })
          if (!approval) return
        }
        await saveProject(name, project)
      }
    )

  program
    .command('update <name>')
    .option('-p, --path <absolutePath>', 'absolute path', process.cwd())
    .option('-d, --description <description>', 'description')
    .description('update project')
    .action(
      async (name: string, args: Pick<ProjectItem, 'description' | 'path'>) => {
        const { path, description = '' } = args
        const project: ProjectItem = {
          name,
          path,
          description,
          default: '',
          commands: {},
        }

        const exists = await getProject(name)
        if (!exists) return console.log(chalk.red('dont have this project'))
        await saveProject(name, project)
      }
    )

  program
    .command('rename <oldName> <newName>')
    .description('update project')
    .action(async (oldName: string, newName: string) => {
      const existsOld = await getProject(oldName)
      const existsNew = await getProject(newName)
      if (!existsOld) return console.log(chalk.red('dont have this project'))
      if (existsNew) {
        const { approval } = await prompt({
          type: 'confirm',
          message: 'Already have this project, Do you need to overwrite',
          name: 'approval',
        })
        if (!approval) return
      }
      await saveProject(newName, {
        ...existsOld,
        name: newName,
      })
      await deleteProject(oldName)
    })

  program
    .command('remove <name>')
    .description('delete project')
    .action(async (name: string) => {
      const exists = await getProject(name)
      if (!exists) {
        return console.log(
          chalk.red(`delete ${name} error, dont have this project`)
        )
      }
      await deleteProject(name)
    })

  program
    .command('open <name>')
    .description('open project use vscode')
    .action(async (name: string) => {
      const projects = await getProjects()
      const project = projects[name]
      if (project) {
        await openVsCode(project.path).catch(() => {
          console.log(chalk.red(`open ${project.path} error`))
          console.log(chalk.red('1. make sure you install vscode'))
          console.log(
            chalk.red(
              '2. if you install vscode please set vscode to global env'
            )
          )
          console.log(
            chalk.red(
              `3. use command+shift+p and input ${chalk.yellow(
                '`> install code`'
              )} to set`
            )
          )
          console.log(chalk.red('4. retry'))
        })
      } else {
        console.log(chalk.red(`open ${name} error, dont have this project`))
      }
    })

  program
    .description('open config file')
    .command('config')
    .action(async () => {
      openVsCode(configPath)
    })
}
