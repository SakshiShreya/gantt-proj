export interface IProj {
  name: string;
}

export interface ITask {
  name: string;
  id?: string;
  subTasks?: Array<ISubTask>;
}

export interface ISubTask {
  name: string;
  id?: string;
}
