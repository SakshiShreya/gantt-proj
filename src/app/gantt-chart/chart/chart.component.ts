import { Component, OnInit, Input } from "@angular/core";
import { ITask } from "../interfaces/chartInterfaces";
import { MatDialog } from "@angular/material";
import { TaskFormComponent } from "../task-components/task-form/task-form.component";
import { SubtaskFormComponent } from "../subtask-components/subtask-form/subtask-form.component";
import { DeleteTaskComponent } from "../task-components/delete-task/delete-task.component";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnInit {
  @Input() chartDataRaw: Array<ITask>;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  editTask(row: ITask) {
    this.dialog.open(TaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { row },
    });
  }

  addSubTask(row: ITask) {
    this.dialog.open(SubtaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { parent: row },
    });
  }

  deleteTask(row: ITask) {
    this.dialog.open(DeleteTaskComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { row },
    });
  }
}
