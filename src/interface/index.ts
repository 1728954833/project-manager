// project
export interface Command {
  description: string;
  name: string;
  exec: string;
}

export interface ProjectItem {
  name: string;
  path: string;
  description?: string;
  default?: string;
  commands: {
    [name: string]: Command;
  };
}

export interface ProjectFile {
  [name: string]: ProjectItem;
}
