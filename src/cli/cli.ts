import type { Project } from '../interface'
import { prompt } from 'inquirer'
import { Command as CommanderCommand } from 'commander'
import { openVsCode } from '../util/system'
import { empty } from '../util/object'
import { t } from '../constant'
import { log, logVsCodeError, tlog, error, info } from '../util/log'
import {
  saveProject,
  getProjects,
  removeProject,
  getProject,
} from '../util/project'
import { configPath } from '../constant/file'

export const registerNormal = (program: CommanderCommand) => {
  program
    .command('list')
    .description('list projects')
    .action(async () => {
      const projects = await getProjects()
      if (empty(projects)) return info(t('PROJECT_IS_EMPTY'))
      tlog<keyof Project>(projects, ['path', 'description', 'default'])
    })

  program
    .command('add <name>')
    .option('-p, --path <absolutePath>', 'absolute path', process.cwd())
    .option('-d, --description <description>', 'description')
    .description('add project')
    .action(
      async (name: string, args: Pick<Project, 'description' | 'path'>) => {
        const { path, description = '' } = args

        const project: Project = {
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
            message: t('PROJECT_ALREADY_EXISTS'),
            name: 'approval',
          })
          if (!approval) return
        }

        await saveProject(name, project)
      }
    )

  program
    .command('update <name>')
    .option('-p, --path <absolutePath>', 'absolute path')
    .option('-d, --description <description>', 'description')
    .description('update project')
    .action(
      async (name: string, args: Pick<Project, 'description' | 'path'>) => {
        const exists = await getProject(name)
        if (!exists) return error(t('PROJECT_NOT_EXISTS'))

        const { path, description = '' } = args
        const project: Project = {
          name,
          path: path || exists.path,
          description: description || exists.description,
          commands: exists.commands,
          default: exists.default,
        }

        await saveProject(name, project)
      }
    )

  program
    .command('rename <oldName> <newName>')
    .description('update project')
    .action(async (oldName: string, newName: string) => {
      const existsOld = await getProject(oldName)
      const existsNew = await getProject(newName)
      if (!existsOld) return error(t('PROJECT_NOT_EXISTS'))
      if (existsNew) {
        const { approval } = await prompt({
          type: 'confirm',
          message: t('PROJECT_ALREADY_EXISTS'),
          name: 'approval',
        })
        if (!approval) return
      }
      await saveProject(newName, {
        ...existsOld,
        name: newName,
      })
      await removeProject(oldName)
    })

  program
    .command('remove <name>')
    .description('delete project')
    .action(async (name: string) => {
      const exists = await getProject(name)
      if (!exists) return error(t('PROJECT_NOT_EXISTS'))
      await removeProject(name)
    })

  program
    .command('open <name>')
    .description('open project use vscode')
    .action(async (name: string) => {
      const project = await getProject(name)
      if (!project) return log(t('PROJECT_NOT_EXISTS'))
      openVsCode(project.path).catch(() => logVsCodeError(project.path))
    })

  program
    .command('config')
    .description('open config file')
    .action(() => {
      openVsCode(configPath).catch(() => logVsCodeError(configPath))
    })

  // program
  //   .command('setting')
  //   .description('open setting file')
  //   .action(() => {
  //     openVsCode(userSettingPath).catch(() => logVsCodeError(configPath))
  //   })
}
