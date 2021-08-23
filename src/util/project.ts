import { readJSON, writeJson } from 'fs-extra';
import { ExecUnit, ProjectFile, ProjectItem } from '../interface';
import { resolve } from 'path';

export const configPath = resolve(__dirname, '../../config.json');

export const saveProject = async (
  name: string,
  projectItem: ProjectItem
): Promise<ProjectFile> => {
  const oldJson = await readJSON(configPath);

  const newJson = Object.assign(oldJson, { [name]: projectItem });
  await writeJson(configPath, newJson);
  return newJson;
};

export const deleteProject = async (name: string): Promise<boolean> => {
  const json = await readJSON(configPath);
  delete json[name];
  await writeJson(configPath, json);
  return true;
};

export const getProjects = async (): Promise<ProjectFile> => {
  return await readJSON(configPath);
};

export const existsProject = async (
  name: string
): Promise<[boolean, ProjectFile]> => {
  const json = await readJSON(configPath);
  return [json[name], json];
};

export const saveProjectExecUnit = async (
  name: string,
  execUnit: ExecUnit
): Promise<ProjectFile> => {
  const [isExists, json] = await existsProject(name);
  if (isExists) {
    json[name].excuUnit = Object.assign(json[name].excuUnit, execUnit);
    await writeJson(configPath, json);
  }
  return json;
};
