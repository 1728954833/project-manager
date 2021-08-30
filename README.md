# Project Manager

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

   `pm exec-set react-app test -n start -e 'npm run start' -d 'run project'`

5. list your command

   `pm exec-list react-app`

6. run

   `pm run react-app -n start`

### Command

```
  list                   list projects
  add <name>             add project item
    -p [absolute path]
    -d [description]
  remove <name>          delete project
  open <name>            open project use vscode
  exec-list <name>       list project command
  exec-set <name>        add project exec order
    -n [command name]
    -e [command]
    -d [description]
  exec-default <name>    set default command, if set just need run `pm run [command name]`
    -d [default]
  exec-remove <name>     delete command
    -n [execName]
  run                    execute command
    -n [execName]
  config                 open config file
  help [command]         display help for command
```

### Write configuration file

if you don't want use cli to set project you can use `pm config` to write your config

```json
    // key must equal name
    "project name": {
        "name": "project name",
        "path": "path",
        "description": "description",
        "default": "default command",
        // command list
        "execUnit": {
            // command name must equal name
            "command name": {
                "name": "command name",
                "exec": "command",
                "description": "description"
            }
        }
    }
```
