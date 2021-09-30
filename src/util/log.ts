import chalk from 'chalk'

export const log = (log: string) => {
  console.log(log)
}

export const error = (error: string) => {
  console.error(chalk.red(error))
}

export const info = (info: string) => {
  console.info(chalk.yellow(info))
}

export const tlog = <T>(obj: any, keys: T[]) => {
  console.table(obj, keys as any[])
}

export const logVsCodeError = (path: string) => {
  log(chalk.red(`open ${path} error`))
  log(chalk.red('1. make sure you install vscode'))
  log(chalk.red('2. if you install vscode please set vscode to global env'))
  log(
    chalk.red(
      `3. use command+shift+p and input ${chalk.yellow(
        '`> install code`'
      )} to set`
    )
  )
  log(chalk.red('4. retry'))
}
