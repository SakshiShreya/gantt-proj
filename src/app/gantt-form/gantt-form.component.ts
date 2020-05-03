import { Component, Input, OnChanges, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IGanttDataRaw, ISelectOption } from "../interfaces/chartInterfaces";
import { GanttScreenService } from "../gantt-screen/gantt-screen.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-gantt-form",
  templateUrl: "./gantt-form.component.html",
  styleUrls: ["./gantt-form.component.scss"],
})
export class GanttFormComponent {
  ganttForm = new FormGroup({
    label: new FormControl("", Validators.required),
    startDate: new FormControl("", Validators.required),
    duration: new FormControl(null, Validators.required),
    dependsOn: new FormControl([]),
  });
  dependencyOptions: Array<ISelectOption>;
  isSubmitButtonDisable = false;

  constructor(
    private ganttScreenService: GanttScreenService,
    public dialogRef: MatDialogRef<GanttFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<IGanttDataRaw>
  ) {
    this.dependencyOptions = data.map((rawData) => ({
      value: rawData.id,
      display: rawData.label,
    }));
  }

  onSubmit() {
    this.isSubmitButtonDisable = true;
    const submitData = { ...this.ganttForm.value };

    if (submitData.startDate) {
      submitData.startDate = this.ganttForm.value.startDate.format(
        "YYYY-MM-DD"
      );
    } else {
      delete submitData.startDate;
    }

    if (submitData.duration) {
      submitData.duration = [submitData.duration, "days"];
    } else {
      delete submitData.duration;
    }

    this.ganttScreenService
      .postNewGanttRow(submitData)
      .then(() => this.dialogRef.close());
  }
}
