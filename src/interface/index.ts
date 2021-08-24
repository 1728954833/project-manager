// project
export interface ExecUnit {
  description: string;
  name: string;
  exec: string;
}

export interface ProjectItem {
  name: string;
  path: string;
  description?: string;
  default?: string;
  execUnit: {
    [name: string]: ExecUnit;
  };
}

export interface ProjectFile {
  [name: string]: ProjectItem;
}
