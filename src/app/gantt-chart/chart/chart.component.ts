import { Component, Input, OnChanges } from "@angular/core";
import {
  ITaskRaw,
  ITask,
  ISubtaskRaw,
  ISubtask,
} from "../interfaces/chartInterfaces";
import { MatDialog } from "@angular/material";
import { TaskFormComponent } from "../task-components/task-form/task-form.component";
import { SubtaskFormComponent } from "../subtask-components/subtask-form/subtask-form.component";
import { DeleteTaskComponent } from "../task-components/delete-task/delete-task.component";
import * as moment from "moment";
import { DeleteSubtaskComponent } from "../subtask-components/delete-subtask/delete-subtask.component";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnChanges {
  @Input() chartDataRaw: Array<ITaskRaw>;
  chartData: Array<ITask> = [];

  constructor(public dialog: MatDialog) {}

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

  parseData(): Array<ITask> {
    return this.chartDataRaw.map((task) => ({
      ...task,
      subtasks: task.subtasks ? task.subtasks.map(this.prepareSubtask) : undefined,
    }));
  }

  ngOnChanges() {
    this.chartData = this.parseData();
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
    console.log(subtaskId)
    this.dialog.open(DeleteSubtaskComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { parent: this.chartDataRaw[taskId], subtaskId },
    });
  }
}
