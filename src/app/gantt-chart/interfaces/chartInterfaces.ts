import * as moment from "moment";

export interface IProj {
  name: string;
  logo?: { name: string; url: string };
  projManager?: string;
  startDate?: string;
  description?: string;
}

interface IChartExtra {
  left: number;
}

interface ITaskBase {
  name: string;
  id?: string;
  order: number;
}

export interface ITaskRaw extends ITaskBase {
  subtasks?: Array<ISubtaskRaw>;
}

export interface ITask extends ITaskBase {
  subtasks?: Array<ISubtask>;
}

export interface ITaskChart extends ITaskBase, IChartExtra {
  subtasks?: Array<ISubtaskChart>;
}

interface ISubtaskBase {
  name: string;
  id?: string;
  owner: string;
  duration: [moment.DurationInputArg1, moment.DurationInputArg2];
  percentComplete: number;
}

export interface ISubtaskRaw extends ISubtaskBase {
  startDate: string;
}

export interface ISubtask extends ISubtaskBase {
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export interface ISubtaskChart extends ISubtask, IChartExtra {}
