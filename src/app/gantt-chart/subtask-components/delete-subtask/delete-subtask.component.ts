import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { GanttFirebaseService } from "../../services/gantt-firebase.service";
import { ITaskRaw } from "../../interfaces/chartInterfaces";

@Component({
  selector: "app-delete-subtask",
  templateUrl: "./delete-subtask.component.html",
  styleUrls: ["./delete-subtask.component.scss"],
})
export class DeleteSubtaskComponent {
  projId = "GiJfbLcXDAfSXpv9ndac";

  constructor(
    private ganttScreenService: GanttFirebaseService,
    public dialogRef: MatDialogRef<DeleteSubtaskComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { parent: ITaskRaw, subtaskId: number }
  ) {}

  closePopup() {
    this.dialogRef.close();
  }

  deleteSubtask() {
    this.ganttScreenService
      .deleteSubtask(this.projId, this.data.parent, this.data.subtaskId)
      .then(() => this.dialogRef.close());
  }
}
