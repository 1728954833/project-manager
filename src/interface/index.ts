// project
export interface Command {
  description: string;
  name: string;
  exec: string;
}

export interface Project {
  name: string;
  path: string;
  description?: string;
  default?: string;
  commands: {
    [name: string]: Command;
  };
}

export interface Projects {
  [name: string]: Project;
}
