# Project Manager

**use npm update packages need save your config, after update use `pm config` to set it. otherwise it will be covered**

Project Manager use for manager your project

1. Quickly open file project
2. Quickly execute commands under the project folder

### Get Started

1. add project

   `pm add react-app -d create-react-app created project -p ./`

2. view items that have been created

   `pm list`

3. open project folder use vscode

   `pm open react-app`

4. add command under project folder

   `pm add-command react-app test -n start -e 'npm run start' -d 'run project'`

5. list your command

   `pm list-command react-app`

6. run

   `pm run react-app -n start`

### Command

```
  list                   list projects
  add <name>             add project item
    -p [absolute path]   default path will according to your current address
    -d [description]
  update <name>          update project item
    -p [absolute path]
    -d [description]
  rename <oldName> <newName> update project name
  remove <name>          delete project
  open <name>            open project use vscode
  list-command <name>       list project command
  add-command <name>        add project exec order
    -n [command name]
    -e [command]
    -d [description]
  default-command <name>    set default command, if set just need run `pm run [command name]`
    -d [default]
  remove-command <name>     delete command
    -n [commandName]
  run                    execute command
    -n [commandName]
  config                 open config file
  help [command]         display help for command
```

### Write configuration file

if you don't want use cli to set project you can use `pm config` to write your config

**config key must equal name(project name, command name)**

```json
    "project name": {
        "name": "project name",
        "path": "path",
        "description": "description",
        "default": "default command",
        "commands": {
            "command name": {
                "name": "command name",
                "exec": "command",
                "description": "description"
            }
        }
    }
```

### Notice

If the profile does not have permissions, the specified write permission needs to be set
