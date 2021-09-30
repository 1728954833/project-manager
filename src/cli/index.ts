import { Command } from 'commander'
import { registerNormal } from './cli'
import { registerCommand } from './commandCli'

export const program = new Command()

program
  .version(`project-manager ${require('../../package.json').version}`)
  .usage('<command>')

registerNormal(program)
registerCommand(program)

program.parse()
