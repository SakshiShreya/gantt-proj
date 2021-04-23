import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ITaskRaw } from "../../interfaces/chartInterfaces";
import * as moment from "moment";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"],
})
export class TaskFormComponent implements OnInit {
  taskForm = new FormGroup({
    name: new FormControl("", Validators.required),
    isSubtaskPresent: new FormControl("yes", Validators.required),
    owner: new FormControl({ disabled: true, value: "" }, Validators.required),
    startDate: new FormControl(
      { disabled: true, value: "" },
      Validators.required
    ),
    duration: new FormControl(
      { disabled: true, value: null },
      Validators.required
    ),
    percentComplete: new FormControl(
      { disabled: true, value: 0 },
      Validators.required
    ),
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
        isSubtaskPresent: this.data.row.isSubtaskPresent ? "yes" : "no",
        owner: this.data.row.owner || "",
        startDate: moment(this.data.row.startDate) || null,
        duration: this.data.row.duration ? this.data.row.duration[0] : 0,
        percentComplete: this.data.row.percentComplete || 0,
      });

      this.enableSubtaskFormFields(
        this.data.row.isSubtaskPresent ? "yes" : "no"
      );
    }

    this.taskForm.get("isSubtaskPresent").valueChanges.subscribe((value) => {
      this.enableSubtaskFormFields(value);
    });
  }

  enableSubtaskFormFields(isSubtaskPresent: "yes" | "no") {
    const fields = ["owner", "startDate", "duration", "percentComplete"];
    if (isSubtaskPresent === "yes") {
      fields.forEach((field) => this.taskForm.get(field).disable());
    } else {
      fields.forEach((field) => this.taskForm.get(field).enable());
    }
  }

  onSubmit() {
    this.isSubmitButtonDisable = true;
    const submitData = {
      ...this.taskForm.value,
      isSubtaskPresent: this.taskForm.value.isSubtaskPresent === "yes",
      order: this.data.row.order,
    };

    if (!submitData.isSubtaskPresent) {
      submitData.startDate = this.taskForm.value.startDate.format("YYYY-MM-DD");
      submitData.duration = [submitData.duration, "days"];
    }

    if (this.data.row) {
      // if row already exists, then update it
      this.ganttFirebaseService
        .updateTaskCompletely(this.data.projId, this.data.row.id, submitData)
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
