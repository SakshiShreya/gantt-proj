import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { GanttScreenService } from "../../gantt-screen/gantt-screen.service";
import { ITask } from "../../interfaces/chartInterfaces";

@Component({
  selector: "app-delete-task",
  templateUrl: "./delete-task.component.html",
  styleUrls: ["./delete-task.component.scss"],
})
export class DeleteTaskComponent {
  projId = "GiJfbLcXDAfSXpv9ndac";

  constructor(
    private ganttScreenService: GanttScreenService,
    public dialogRef: MatDialogRef<DeleteTaskComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { row: ITask }
  ) {}

  closePopup() {
    this.dialogRef.close();
  }

  deleteTask() {
    this.ganttScreenService
      .deleteTask(this.projId, this.data.row.id)
      .then(() => this.dialogRef.close());
  }
}
