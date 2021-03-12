import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ITaskRaw } from "../../interfaces/chartInterfaces";
import * as moment from "moment";

@Component({
  selector: "app-subtask-form",
  templateUrl: "./subtask-form.component.html",
  styleUrls: ["./subtask-form.component.scss"],
})
export class SubtaskFormComponent implements OnInit {
  subtaskForm = new FormGroup({
    name: new FormControl("", Validators.required),
    owner: new FormControl("", Validators.required),
    startDate: new FormControl("", Validators.required),
    duration: new FormControl(null, Validators.required),
    percentComplete: new FormControl(0, Validators.required),
  });
  isSubmitButtonDisable = false;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    public dialogRef: MatDialogRef<SubtaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { projId: string; parent: ITaskRaw; subtaskId?: number }
  ) {}

  ngOnInit() {
    const { parent, subtaskId } = this.data;
    const formData = parent.subtasks[subtaskId];

    if (subtaskId !== undefined) {
      this.subtaskForm.patchValue({
        name: formData.name,
        owner: formData.owner,
        startDate: moment(formData.startDate),
        duration: formData.duration ? formData.duration[0] : 0,
        percentComplete: formData.percentComplete || 0,
      });
    }
  }

  onSubmit() {
    const { projId, parent, subtaskId } = this.data;
    this.isSubmitButtonDisable = true;
    const submitData = { ...this.subtaskForm.value };

    submitData.startDate = this.subtaskForm.value.startDate.format(
      "YYYY-MM-DD"
    );

    submitData.duration = [submitData.duration, "days"];

    if (subtaskId !== undefined) {
      this.ganttFirebaseService
        .updateSubtask(projId, parent, subtaskId, submitData)
        .then(() => this.dialogRef.close());
    } else {
      this.ganttFirebaseService
        .postNewSubtask(projId, parent.id, submitData)
        .then(() => this.dialogRef.close());
    }
  }
}
