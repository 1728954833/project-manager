import { ProjectFile, ProjectItem } from '../interface';
export declare const saveProject: (name: string, projectItem: ProjectItem) => Promise<any>;
export declare const getProjects: () => Promise<ProjectFile>;
