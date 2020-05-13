import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IGanttDataRaw, ISelectOption } from "../interfaces/chartInterfaces";
import { GanttScreenService } from "../gantt-screen/gantt-screen.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-gantt-form",
  templateUrl: "./gantt-form.component.html",
  styleUrls: ["./gantt-form.component.scss"],
})
export class GanttFormComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dependencyDropdown: Array<IGanttDataRaw>;
      row?: IGanttDataRaw;
    }
  ) {
    this.dependencyOptions = data.dependencyDropdown.map((rawData) => ({
      value: rawData.id,
      display: rawData.label,
    }));
  }

  ngOnInit() {
    if (this.data.row) {
      this.ganttForm.setValue({
        label: this.data.row.label,
        startDate: this.data.row.startDate,
        duration: this.data.row.duration[0],
        dependsOn: this.data.row.dependsOn,
      });
    }
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

    if (this.data.row) {
      this.ganttScreenService
        .updateGanttRow(submitData, this.data.row.id)
        .then(() => this.dialogRef.close());
    } else {
      this.ganttScreenService
        .postNewGanttRow(submitData)
        .then(() => this.dialogRef.close());
    }
  }
}
