import type { Command, ProjectFile, ProjectItem } from '../interface'
import { readJSON, writeJson } from 'fs-extra'
import { resolve } from 'path'

export const configPath = resolve(__dirname, '../../config.json')

export const saveProject = async (
  name: string,
  projectItem: ProjectItem
): Promise<ProjectFile> => {
  const oldJson = await readJSON(configPath)

  const newJson = Object.assign(oldJson, { [name]: projectItem })
  await writeJson(configPath, newJson)
  return newJson
}

export const deleteProject = async (name: string): Promise<boolean> => {
  const json = await readJSON(configPath)
  delete json[name]
  await writeJson(configPath, json)
  return true
}

export const getProjects = async (): Promise<ProjectFile> => {
  return readJSON(configPath)
}

export const getProject = async (name: string): Promise<ProjectItem> => {
  const json = await readJSON(configPath)
  return json[name]
}

export const saveProjectExecUnit = async (
  name: string,
  execUnit: Command
): Promise<ProjectFile> => {
  const projects = await readJSON(configPath)
  const project = projects[name]
  project.execUnit = Object.assign(project.execUnit, {
    [execUnit.name]: execUnit,
  })
  await writeJson(configPath, projects)
  return projects
}
