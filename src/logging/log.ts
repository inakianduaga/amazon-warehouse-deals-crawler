import chalk from 'chalk'

const log = {
  banner: (s: string) => console.log(chalk.bgYellow(s)),
  success: (s: string) => console.log(chalk.green(s)),
  info: (s: string) => console.log(chalk.blue(s)),
  warn: (s: string) => console.log(chalk.keyword('orange')(s)),
  error: (s: string) => console.log(chalk.red(s)),
  debug: (s: string) => console.log(chalk.grey.dim(s))
}

export default log
