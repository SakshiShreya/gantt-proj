import { Component, OnInit, Inject } from "@angular/core";
import { GanttScreenService } from "src/app/gantt-screen/gantt-screen.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IGanttData } from "src/app/interfaces/chartInterfaces";

export enum eConfirmState {
  CONFIRM,
  CANT_DELETE,
}

@Component({
  selector: "app-confirm-delete",
  templateUrl: "./confirm-delete.component.html",
  styleUrls: ["./confirm-delete.component.scss"],
})
export class ConfirmDeleteComponent implements OnInit {
  states = eConfirmState;

  constructor(
    private ganttScreenService: GanttScreenService,
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { row: IGanttData; state: eConfirmState; dependents?: Array<IGanttData> }
  ) {}

  ngOnInit() {
    console.log(this.data);
  }

  closePopup() {
    this.dialogRef.close();
  }

  deleteRow() {
    this.ganttScreenService
      .deleteGanttRow(this.data.row.id)
      .then(() => this.dialogRef.close());
  }
}
