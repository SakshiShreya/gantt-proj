import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { ITaskRaw } from "../../interfaces/chartInterfaces";

@Component({
  selector: "app-delete-subtask",
  templateUrl: "./delete-subtask.component.html",
  styleUrls: ["./delete-subtask.component.scss"],
})
export class DeleteSubtaskComponent {
  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    public dialogRef: MatDialogRef<DeleteSubtaskComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { projId: string; parent: ITaskRaw; subtaskId: number }
  ) {}

  closePopup() {
    this.dialogRef.close();
  }

  deleteSubtask() {
    this.ganttFirebaseService
      .deleteSubtask(this.data.projId, this.data.parent, this.data.subtaskId)
      .then(() => this.dialogRef.close());
  }
}
