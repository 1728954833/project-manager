// project
export interface ExecUnit {
  description: string;
  name: string;
  order: string;
}

export interface ProjectItem {
  name: string;
  path: string;
  description?: string;
  excuUnit: {
    [name: string]: ExecUnit;
  };
}

export interface ProjectFile {
  [name: string]: ProjectItem;
}

