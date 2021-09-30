import chalk from 'chalk'
import { prompt } from 'inquirer'
import { Command as CommanderCommand } from 'commander'
import { saveProject, saveProjectExecUnit, getProject } from '../util/project'
import { Command } from '../interface'
import { execOrder } from '../util/system'

export const registerCommand = (program: CommanderCommand) => {
  program
    .command('exec-list <name>')
    .description('list project command')
    .action(async (name: string) => {
      const project = await getProject(name)

      if (!project) {
        return console.log(chalk.red(`run error, dont have this project`))
      }

      if (!project.commands || Object.keys(project.commands).length === 0) {
        return console.log(`dont have this order, please add`)
      }

      console.table(project.commands, ['exec', 'description'])
    })

  program
    .command('exec-set <name>')
    .description('add command')
    .requiredOption('-n, --name <name>', 'command name')
    .requiredOption('-e, --exec <exec>', 'command')
    .option('-d, --description <description>', 'description')
    .action(async (name: string, args: Command) => {
      const project = await getProject(name)
      if (!project) {
        console.log(chalk.red(`set error, dont have this project`))
      }
      const repeat = Object.keys(project.commands).includes(args.name)
      if (repeat) {
        const { approval } = await prompt({
          type: 'confirm',
          message: 'have repeat order, Do you need to overwrite',
          name: 'approval',
        })
        if (!approval) return
      }
      await saveProjectExecUnit(name, args)
    })

  program
    .command('exec-default <name>')
    .description(
      'set default command, if set just need run `pm run [command name]`'
    )
    .requiredOption('-d, --default <default>', 'set default command')
    .action(async (name: string, args: { default: string }) => {
      const project = await getProject(name)
      if (!project) {
        return console.log(
          chalk.red(`set default error, dont have this project`)
        )
      }

      if (!Object.keys(project.commands).includes(args.default)) {
        return console.log(chalk.red(`set default error, dont have this order`))
      }

      project.default = args.default
      await saveProject(name, project)
    })

  program
    .command('exec-remove <name>')
    .description('delete command')
    .requiredOption('-n, --name <name>', 'command name')
    .action(async (name: string, args: Pick<Command, 'name'>) => {
      const { name: commandName } = args
      const project = await getProject(name)

      if (!project) {
        return console.log(chalk.red(`delete error, dont have this project`))
      }

      if (!project.commands[commandName]) {
        return console.log(chalk.red(`delete error, dont have this order`))
      }

      delete project.commands[commandName]
      await saveProjectExecUnit(name, project.commands[commandName])
    })

  program
    .command('run <name>')
    .option('-n, --execName <execName>', 'command name')
    .description('execute command')
    .action(async (name: string, args: Pick<Command, 'name'>) => {
      let { name: commandName } = args
      const project = await getProject(name)

      if (!project) {
        return console.log(chalk.red(`run error, dont have this project`))
      }

      if (!commandName) {
        if (project.default) {
          commandName = project.default
        } else {
          return console.log(
            chalk.red('run error, please input `-n <name>` choose your order')
          )
        }
      }

      if (!project.commands[commandName]) {
        return console.log(chalk.red(`run error, dont have this order`))
      }

      const command = project.commands[commandName]
      await execOrder(command.exec, project.path)
    })
}
