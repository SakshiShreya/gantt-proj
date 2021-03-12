import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { ITask } from "../../interfaces/chartInterfaces";

@Component({
  selector: "app-delete-task",
  templateUrl: "./delete-task.component.html",
  styleUrls: ["./delete-task.component.scss"],
})
export class DeleteTaskComponent {
  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    public dialogRef: MatDialogRef<DeleteTaskComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { row: ITask }
  ) {}

  closePopup() {
    this.dialogRef.close();
  }

  deleteTask() {
    this.ganttFirebaseService
      .deleteTask(this.ganttFirebaseService.projId, this.data.row.id)
      .then(() => this.dialogRef.close());
  }
}
