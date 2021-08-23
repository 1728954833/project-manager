import { readJSON, writeJson } from 'fs-extra';
import { ProjectFile, ProjectItem } from '../interface';

export const saveProject = async (name: string, projectItem: ProjectItem) => {
  const oldJson = await readJSON('./config.json');
  const newJson = Object.assign(oldJson, { [name]: projectItem });
  await writeJson('./config.json', newJson);
  return newJson;
};

export const getProjects = async (): Promise<ProjectFile> => {
  return await readJSON('./config.json');
};
