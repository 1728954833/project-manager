import type { Command, Projects, Project } from '../interface'
import { readJSON, writeJson } from 'fs-extra'
import { configPath } from '../constant/file'

export const getProjects = async (): Promise<Projects> => {
  return readJSON(configPath)
}

export const saveProject = async (
  name: string,
  project: Project
): Promise<Projects> => {
  const oldProjects = await getProjects()
  const newProjects = Object.assign(oldProjects, { [name]: project })
  await writeJson(configPath, newProjects)
  return newProjects
}

export const removeProject = async (name: string): Promise<boolean> => {
  const projects = await getProjects()
  delete projects[name]
  await writeJson(configPath, projects)
  return true
}

export const getProject = async (name: string): Promise<Project> => {
  const projects = await getProjects()
  return projects[name]
}

export const saveCommand = async (
  name: string,
  command: Command
): Promise<Project> => {
  const project = await getProject(name)
  if (!project) return project
  project.commands = Object.assign(project.commands, {
    [command.name]: command,
  })
  await saveProject(name, project)
  return project
}

export const removeCommand = async (
  name: string,
  command: string
): Promise<boolean> => {
  const project = await getProject(name)
  if (!project) return project
  delete project.commands[command]
  await saveProject(name, project)
  return true
}
