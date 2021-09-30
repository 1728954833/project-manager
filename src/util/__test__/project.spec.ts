require('dotenv').config({ path: '.env' })
import type { Project, Command } from '../../interface'
import {
  saveProject,
  getProjects,
  getProject,
  removeProject,
  saveCommand,
} from '../project'
import { readJSON } from 'fs-extra'
import { v4 as uuidV4 } from 'uuid'
import { configPath } from '../project'

describe('project with file', () => {
  let project: Project
  let overwriteProject: Project
  let command: Command

  beforeAll(() => {
    const uuid = uuidV4()
    project = {
      name: uuid,
      path: '/Users/liu/我的项目/project-cli',
      commands: {},
    }

    command = {
      exec: 'test exec',
      name: 'test name',
      description: 'test description',
    }

    overwriteProject = JSON.parse(JSON.stringify(project))
    overwriteProject.path = '/'
  })

  it('config.json default is {}', async () => {
    const json = await readJSON(configPath)
    expect(json).toEqual({})
  })

  it('saveItem can operate correctly', async () => {
    const res = await saveProject(project.name, project)
    expect(res).toEqual({
      [project.name]: project,
    })
  })

  it('can get projects', async () => {
    const json = await getProjects()
    expect(json).toEqual({
      [project.name]: project,
    })
  })

  it('can get project', async () => {
    const json = await getProject(project.name)
    expect(json).toEqual(project)
  })

  it('if no project return undefined', async () => {
    const json = await getProject('test')
    expect(json).toBe(undefined)
  })

  it('can override project', async () => {
    await saveProject(project.name, overwriteProject)
    const json = await getProject(project.name)
    expect(json.path).toBe(overwriteProject.path)
  })

  it('can write command', async () => {
    await saveCommand(project.name, command)
    const json = await getProject(project.name)
    expect(json.commands).toEqual({
      [command.name]: command,
    })
  })

  it('can delete project', async () => {
    const res = await removeProject(project.name)
    const json = await getProjects()
    expect(res).toEqual(true)
    expect(json).toEqual({})
  })
})
