const constants = {
  PROJECT_IS_EMPTY: 'projects is empty',
  PROJECT_NOT_EXISTS: 'project is not exists',
  PROJECT_ALREADY_EXISTS: 'already have this project, Do you need to overwrite',

  COMMAND_IS_EMPTY: 'commands is empty',
  COMMAND_NOT_EXISTS: 'command is not exists',
  COMMAND_ALREADY_EXISTS: 'already have this command, Do you need to overwrite',
}

export const t = (key: keyof typeof constants) => {
  return constants[key]
}
