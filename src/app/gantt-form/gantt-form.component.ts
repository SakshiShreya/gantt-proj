import { Component, Input, OnChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IGanttDataRaw, ISelectOption } from "../interfaces/chartInterfaces";
import { GanttScreenService } from "../gantt-screen/gantt-screen.service";

@Component({
  selector: "app-gantt-form",
  templateUrl: "./gantt-form.component.html",
  styleUrls: ["./gantt-form.component.scss"],
})
export class GanttFormComponent implements OnChanges {
  @Input() chartDataRaw: Array<IGanttDataRaw>;
  ganttForm = new FormGroup({
    label: new FormControl("", Validators.required),
    startDate: new FormControl(""),
    duration: new FormControl(""),
    endDate: new FormControl(),
    dependsOn: new FormControl(),
  });
  dependencyOptions: Array<ISelectOption>;

  constructor(private ganttScreenService: GanttScreenService) {}

  ngOnChanges() {
    if (this.chartDataRaw) {
      this.dependencyOptions = this.chartDataRaw.map((rawData) => ({
        value: rawData.id,
        display: rawData.label,
      }));
      console.log("changes", this.chartDataRaw);
    }
  }

  onSubmit() {
    const submitData = { ...this.ganttForm.value };

    if (submitData.startDate) {
      submitData.startDate = this.ganttForm.value.startDate.format(
        "YYYY-MM-DD"
      );
    } else {
      delete submitData.startDate;
    }

    if (submitData.endDate) {
      submitData.endDate = this.ganttForm.value.endDate.format("YYYY-MM-DD");
    } else {
      delete submitData.endDate;
    }

    if (submitData.duration) {
      submitData.duration = [submitData.duration, "days"];
    } else {
      delete submitData.duration;
    }

    console.log(submitData);
    this.ganttScreenService.postNewGanttRow(submitData);
  }
}
