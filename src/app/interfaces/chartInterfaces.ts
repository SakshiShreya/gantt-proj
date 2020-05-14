import * as moment from "moment";

export interface IGanttDataRaw {
  startDate?: string;
  duration?: [moment.DurationInputArg1, moment.DurationInputArg2];
  endDate?: string;
  label: string;
  owner: string;
  id: string;
  percentComplete: number;
  dependsOn: Array<string>;
}

export interface IGanttData {
  startDate?: moment.Moment;
  duration?: [moment.DurationInputArg1, moment.DurationInputArg2];
  endDate?: moment.Moment;
  label: string;
  owner: string;
  id: string;
  percentComplete: number;
  dependsOn: Array<string>;
}

export enum ESortMode {
  Date = "date",
  ChildrenCount = "childrenCount",
}

export interface IMargin {
  top: number;
  left: number;
}

export interface IDimensions {
  width: number;
  height: number;
}

export interface ISvgOptions {
  margin?: IMargin;
  width?: number;
  height?: number;
  fontSize?: number;
}

export interface ICreateChartSVGOptions {
  minStartDate: moment.Moment;
  maxEndDate: moment.Moment;
}

export interface ICreateElementData {
  x: number;
  y: number;
  xEnd: number;
  width: number;
  height: number;
  id: string;
  dependsOn: Array<string>;
  label: string;
  labelX: number;
  labelY: number;
  tooltip: string;
}

export interface ISelectOption {
  value: string;
  display: string;
}
