import chalk from 'chalk'
import { prompt } from 'inquirer'
import { Command as CommanderCommand } from 'commander'
import {
  saveProject,
  saveCommand,
  getProject,
  removeCommand,
} from '../util/project'
import { Command } from '../interface'
import { exec } from '../util/system'
import { error, info, tlog } from '../util/log'
import { empty } from '../util/object'
import { t } from '../constant'

export const registerCommand = (program: CommanderCommand) => {
  program
    .command('list-command <name>')
    .description('list project commands')
    .action(async (name: string) => {
      const project = await getProject(name)

      if (!project) {
        return error(t('PROJECT_NOT_EXISTS'))
      }

      if (empty(project.commands)) {
        return info(t('COMMAND_IS_EMPTY'))
      }

      tlog<keyof Command>(project.commands, ['exec', 'description'])
    })

  program
    .command('add-command <name>')
    .description('add command')
    .requiredOption('-n, --name <name>', 'command name')
    .requiredOption('-e, --exec <exec>', 'command')
    .option('-d, --description <description>', 'description', '')
    .action(async (name: string, args: Command) => {
      const project = await getProject(name)
      if (!project) return error(t('PROJECT_NOT_EXISTS'))
      const repeat = Object.keys(project.commands).includes(args.name)
      if (repeat) {
        const { approval } = await prompt({
          type: 'confirm',
          message: t('COMMAND_ALREADY_EXISTS'),
          name: 'approval',
        })
        if (!approval) return
      }
      await saveCommand(name, args)
    })

  program
    .command('remove-command <name>')
    .description('remove command')
    .requiredOption('-n, --name <name>', 'command name')
    .action(async (name: string, args: Pick<Command, 'name'>) => {
      const { name: commandName } = args
      const project = await getProject(name)

      if (!project) {
        return error(t('PROJECT_NOT_EXISTS'))
      }

      if (!project.commands[commandName]) {
        return error(t('COMMAND_NOT_EXISTS'))
      }

      await removeCommand(name, commandName)
    })

  program
    .command('command-default <name>')
    .description(
      'set default command, if set just need run `pm run [command name]`'
    )
    .requiredOption('-d, --default <default>', 'set default command')
    .action(async (name: string, args: { default: string }) => {
      const project = await getProject(name)
      if (!project) return error(t('PROJECT_NOT_EXISTS'))

      if (!Object.keys(project.commands).includes(args.default)) {
        return error(t('COMMAND_NOT_EXISTS'))
      }

      project.default = args.default
      await saveProject(name, project)
    })

  program
    .command('run <name>')
    .option('-n, --execName <execName>', 'command name')
    .description('run command')
    .action(async (name: string, args: Pick<Command, 'name'>) => {
      const project = await getProject(name)
      if (!project) return error(t('PROJECT_NOT_EXISTS'))
      const { name: commandName = project.default } = args

      if (!commandName)
        return error(
          chalk.red('run error, please input `-n <name>` choose your order')
        )

      const command = project.commands[commandName]
      if (!command) {
        return error(t('COMMAND_NOT_EXISTS'))
      }

      await exec(command.exec, project.path)
    })
}
