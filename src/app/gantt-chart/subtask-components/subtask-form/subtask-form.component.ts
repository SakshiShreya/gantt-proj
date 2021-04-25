import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IDependency, ITask, ITaskRaw } from "../../interfaces/chartInterfaces";
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
    dependencies: new FormArray([]),
    startDate: new FormControl("", Validators.required),
    duration: new FormControl(null, Validators.required),
    percentComplete: new FormControl(0, Validators.required),
  });
  isSubmitButtonDisable = false;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    public dialogRef: MatDialogRef<SubtaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { projId: string; chartdata: ITask[], parent: ITaskRaw; subtaskId?: number }
  ) {}

  ngOnInit() {
    console.log(this.data);
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

      formData.dependencies.forEach((dependency) => {
        this.addDependency(dependency);
      });
    }
  }

  addDependency(dependency?: IDependency) {
    const formGroup = new FormGroup({
      subtask: new FormControl(
        dependency ? dependency.subtask : null,
        Validators.required
      ),
      depType: new FormControl(
        dependency ? dependency.depType : null,
        Validators.required
      ),
      value: new FormControl(
        { disabled: true, value: dependency ? dependency.value : 0 },
        Validators.required
      ),
    });
    (this.subtaskForm.get("dependencies") as FormArray).push(formGroup);

    formGroup.get("depType").valueChanges.subscribe((value) => {
      if (value === "percentage" || value === "days") {
        formGroup.patchValue({ value: 0 });
        formGroup.get("value").enable();
      } else {
        formGroup.get("value").disable();
      }
    });
  }

  deleteDependency(index: number) {
    (this.subtaskForm.get("dependencies") as FormArray).removeAt(index);
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
