import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GanttFirebaseService } from "../../services/gantt-firebase.service";
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
  projId = "GiJfbLcXDAfSXpv9ndac";

  constructor(
    private ganttScreenService: GanttFirebaseService,
    public dialogRef: MatDialogRef<SubtaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parent: ITaskRaw; subtaskId?: number }
  ) {}

  ngOnInit() {
    if (this.data.subtaskId !== undefined) {
      this.subtaskForm.patchValue({
        name: this.data.parent.subtasks[this.data.subtaskId].name,
        owner: this.data.parent.subtasks[this.data.subtaskId].owner,
        startDate: moment(this.data.parent.subtasks[this.data.subtaskId].startDate),
        duration: this.data.parent.subtasks[this.data.subtaskId].duration
          ? this.data.parent.subtasks[this.data.subtaskId].duration[0]
          : 0,
        percentComplete:
          this.data.parent.subtasks[this.data.subtaskId].percentComplete || 0,
      });
    }
  }

  onSubmit() {
    this.isSubmitButtonDisable = true;
    const submitData = { ...this.subtaskForm.value };

    submitData.startDate = this.subtaskForm.value.startDate.format(
      "YYYY-MM-DD"
    );

    submitData.duration = [submitData.duration, "days"];

    if (this.data.subtaskId !== undefined) {
      this.ganttScreenService
        .updateSubtask(
          this.projId,
          this.data.parent,
          this.data.subtaskId,
          submitData
        )
        .then(() => this.dialogRef.close());
    } else {
      this.ganttScreenService
        .postNewSubtask(this.projId, this.data.parent.id, submitData)
        .then(() => this.dialogRef.close());
    }
  }
}
