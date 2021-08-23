// project
export interface ExecUnit {
  description: string;
  name: string;
  order: string;
}

export interface ProjectItem {
  name: string;
  path: string;
  excuUnit: {
    [name: string]: ExecUnit;
  };
}

export interface ProjectFile {
  [name: string]: ProjectItem;
}

// arguments
export interface ProjectAddArgs {
  path: string;
}
