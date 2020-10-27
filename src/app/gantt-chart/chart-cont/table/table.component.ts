import { Component, Input, OnChanges } from "@angular/core";
import {
  ITaskRaw,
  ITask,
  ISubtaskRaw,
  ISubtask,
} from "../../interfaces/chartInterfaces";
import * as moment from "moment";
import { MatDialog } from "@angular/material";
import { TaskFormComponent } from "../../task-components/task-form/task-form.component";
import { SubtaskFormComponent } from "../../subtask-components/subtask-form/subtask-form.component";
import { DeleteTaskComponent } from "../../task-components/delete-task/delete-task.component";
import { DeleteSubtaskComponent } from "../../subtask-components/delete-subtask/delete-subtask.component";
import { ParseDataService } from "../parse-data.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnChanges {
  @Input() chartDataRaw: Array<ITaskRaw>;
  chartData: Array<ITask> = [];

  constructor(
    public dialog: MatDialog,
    private dataService: ParseDataService
  ) {}

  prepareSubtask({
    startDate: startDateRaw,
    duration,
    ...subtask
  }: ISubtaskRaw): ISubtask {
    let startDate: moment.Moment;
    if (startDateRaw) {
      startDate = moment(startDateRaw);
    }

    const endDate = moment(startDate);
    endDate.add(...(duration || [0, "days"]));

    return {
      startDate,
      endDate,
      duration,
      ...subtask,
    };
  }

  // data is subtask here
  findDateBoundaries(data?: Array<ISubtask>) {
    if (data) {
      let startDate: moment.Moment;
      let endDate: moment.Moment;

      data.forEach(({ startDate: sD, endDate: eD }) => {
        if (!startDate || sD.isBefore(startDate)) {
          startDate = moment(sD);
        }

        if (!startDate || sD.isBefore(startDate)) {
          startDate = moment(eD);
        }

        if (!endDate || eD.isAfter(endDate)) {
          endDate = moment(eD);
        }

        if (!endDate || sD.isAfter(endDate)) {
          endDate = moment(sD);
        }
      });

      return {
        startDate,
        endDate,
        duration: [endDate.diff(startDate, "days"), "days"] as [
          moment.DurationInputArg1,
          moment.DurationInputArg2
        ],
      };
    } else {
      return {
        startDate: undefined,
        endDate: undefined,
        duration: [0, "days"] as [
          moment.DurationInputArg1,
          moment.DurationInputArg2
        ],
      };
    }
  }

  parseData(): Array<ITask> {
    return this.chartDataRaw.map((task) => {
      const subtasks = task.subtasks
        ? task.subtasks.map(this.prepareSubtask)
        : undefined;

      return {
        ...task,
        ...this.findDateBoundaries(subtasks),
        subtasks,
      };
    });
  }

  ngOnChanges() {
    this.chartData = this.parseData();
    this.dataService.setParseData(this.chartData);
  }

  editTask(row: ITaskRaw) {
    this.dialog.open(TaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { row },
    });
  }

  deleteTask(row: ITaskRaw) {
    this.dialog.open(DeleteTaskComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { row },
    });
  }

  addSubtask(row: ITaskRaw) {
    this.dialog.open(SubtaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { parent: row },
    });
  }

  editSubtask(taskId: string, subtaskId: number) {
    this.dialog.open(SubtaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { parent: this.chartDataRaw[taskId], subtaskId },
    });
  }

  deleteSubtask(taskId: string, subtaskId: number) {
    this.dialog.open(DeleteSubtaskComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { parent: this.chartDataRaw[taskId], subtaskId },
    });
  }
}
