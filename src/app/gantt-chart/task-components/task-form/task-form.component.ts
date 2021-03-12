import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ITaskRaw } from "../../interfaces/chartInterfaces";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"],
})
export class TaskFormComponent implements OnInit {
  taskForm = new FormGroup({
    name: new FormControl("", Validators.required),
  });
  isSubmitButtonDisable = false;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { projId: string; row?: ITaskRaw; nextId?: number }
  ) {}

  ngOnInit() {
    if (this.data.row) {
      this.taskForm.setValue({
        name: this.data.row.name,
      });
    }
  }

  onSubmit() {
    this.isSubmitButtonDisable = true;
    const submitData = { ...this.taskForm.value };

    if (this.data.row) {
      // if row already exists, then update it
      this.ganttFirebaseService
        .updateTask(this.data.projId, this.data.row.id, submitData)
        .then(() => this.dialogRef.close());
    } else {
      // otherwise create a new row
      this.ganttFirebaseService
        .postNewTask(this.data.projId, {
          ...submitData,
          order: this.data.nextId,
        })
        .then(() => this.dialogRef.close());
    }
  }
}
