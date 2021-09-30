import { exec } from '../../util/system'
import { getProject } from '../../util/project'

describe('cli', () => {
  let description = 'this is a test'
  let name = 'test'
  let path = '/'

  beforeAll(async () => {
    await exec('npm run build')
  })

  it('pmx add', async () => {
    await exec(`pmx add ${name} -p ${path} -d '${description}'`)
    const project = await getProject(name)

    await exec(`pmx add default${name} -d '${description}'`)
    const defaultPathProject = await getProject(name)

    expect(defaultPathProject.path).toBeDefined()
    expect(project).toBeDefined()
  })

  it('pmx rename', async () => {
    await exec(`pmx rename ${name} rename${name}`)
    name = `rename${name}`
    const project = await getProject(name)

    expect(project.name).toEqual(name)
  })

  it('pmx update', async () => {
    path = `update${path}`
    description = `update${description}`

    await exec(`pmx update ${name} -p ${path} -d '${description}'`)
    const project = await getProject(name)

    expect(project.path).toEqual(path)
    expect(project.description).toEqual(description)
  })

  it('pmx list', async () => {
    await exec('pmx list')
  })

  it('pmx remove', async () => {
    await exec(`pmx remove ${name}`)

    const project = await getProject(name)
    expect(project).not.toBeDefined()
  })

  afterAll(() => {
    exec('npm run prebuild')
  })
})
