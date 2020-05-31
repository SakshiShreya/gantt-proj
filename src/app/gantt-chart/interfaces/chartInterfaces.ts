import * as moment from "moment";

export interface IProj {
  name: string;
}

export interface ITaskRaw {
  name: string;
  id?: string;
  subtasks?: Array<ISubtaskRaw>;
}

export interface ITask {
  name: string;
  id?: string;
  subtasks?: Array<ISubtask>;
}

export interface ISubtaskRaw {
  name: string;
  id?: string;
  owner: string;
  startDate: string;
  duration: [moment.DurationInputArg1, moment.DurationInputArg2];
  percentComplete: number;
}

export interface ISubtask {
  name: string;
  id?: string;
  owner: string;
  startDate: moment.Moment;
  duration: [moment.DurationInputArg1, moment.DurationInputArg2];
  endDate: moment.Moment;
  percentComplete: number;
}
