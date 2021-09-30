require('dotenv').config({ path: '.env' })
import type { ProjectItem, Command } from '../../interface'
import {
  saveProject,
  getProjects,
  getProject,
  deleteProject,
  saveProjectExecUnit,
} from '../project'
import { readJSON } from 'fs-extra'
import { v4 as uuidV4 } from 'uuid'
import { configPath } from '../project'

describe('project with file', () => {
  let project: ProjectItem
  let overwriteProject: ProjectItem
  let execUint: Command

  beforeAll(() => {
    const uuid = uuidV4()
    project = {
      name: uuid,
      path: '/Users/liu/我的项目/project-cli',
      commands: {},
    }

    execUint = {
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

  it('can write execUnit', async () => {
    await saveProjectExecUnit(project.name, execUint)
    const json = await getProject(project.name)
    expect(json.commands).toEqual({
      [execUint.name]: execUint,
    })
  })

  it('can delete project', async () => {
    const res = await deleteProject(project.name)
    const json = await getProjects()
    expect(res).toEqual(true)
    expect(json).toEqual({})
  })
})
