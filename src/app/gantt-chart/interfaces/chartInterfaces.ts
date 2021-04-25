import * as moment from "moment";

interface IChartExtra {
  left: number;
}

export type TDuration = [moment.DurationInputArg1, moment.DurationInputArg2];

interface ITaskBase {
  name: string;
  id?: string;
  order: number;
  isSubtaskPresent: boolean;
  owner?: string;
  duration?: TDuration;
  percentComplete?: number;
}

export interface ITaskRaw extends ITaskBase {
  startDate?: string;
  subtasks?: Array<ISubtaskRaw>;
}

export interface ITask extends ITaskBase {
  startDate: moment.Moment;
  endDate: moment.Moment;
  duration: TDuration;
  subtasks?: Array<ISubtask>;
}

export interface ITaskChart extends ITask, IChartExtra {
  subtasks?: Array<ISubtaskChart>;
}

export interface IDependency {
  subtask: string;
  depType: string;
  value: number | null;
}

interface ISubtaskBase {
  name: string;
  id?: string;
  owner: string;
  duration: TDuration;
  percentComplete: number;
  dependencies: Array<IDependency>;
}

export interface ISubtaskRaw extends ISubtaskBase {
  startDate: string;
}

export interface ISubtask extends ISubtaskBase {
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export interface ISubtaskChart extends ISubtask, IChartExtra {}
