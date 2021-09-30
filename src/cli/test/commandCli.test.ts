import { exec } from '../../util/system'
import { getProject } from '../../util/project'
import { empty } from '../../util/object'

describe('command-cli', () => {
  let name = 'testCommand'

  beforeAll(async () => {
    await exec('npm run build')
    await exec(`pmx add ${name} -p / -d "this is a test"`)
  })

  it('pmx list-command is empty', async () => {
    await exec(`pmx list-command ${name}`)
  })

  it('pmx add-command', async () => {
    await exec(`pmx add-command ${name} -d "list all file" -n ls -e "ls"`)
    const project = await getProject(name)
    expect(project.commands).toBeDefined()
    expect(empty(project.commands)).toBeFalsy()
  })

  it('pmx list-command', async () => {
    await exec('pmx list-command test')
  })

  it('pmx command-default', async () => {
    await exec(`pmx command-default ${name} -d ls`)
    const project = await getProject(name)
    expect(project.default).toEqual('ls')
  })

  it('pmx remove-command', async () => {
    await exec(`pmx remove-command ${name} -n ls`)
    const project = await getProject(name)
    const exists = Object.keys(project.commands).includes('ls')
    expect(exists).toBeFalsy()
  })

  afterAll(() => {
    exec('npm run prebuild')
  })
})
