import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GanttScreenService } from "../../gantt-screen/gantt-screen.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ITask, ISubTask } from "../../interfaces/chartInterfaces";

@Component({
  selector: "app-subtask-form",
  templateUrl: "./subtask-form.component.html",
  styleUrls: ["./subtask-form.component.scss"],
})
export class SubtaskFormComponent implements OnInit {
  subTaskForm = new FormGroup({
    name: new FormControl("", Validators.required),
  });
  isSubmitButtonDisable = false;
  projId = "GiJfbLcXDAfSXpv9ndac";

  constructor(
    private ganttScreenService: GanttScreenService,
    public dialogRef: MatDialogRef<SubtaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parent: ITask; subTaskId?: number }
  ) {}

  ngOnInit() {
    if (this.data.subTaskId) {
      this.subTaskForm.setValue({
        name: this.data.parent.subTasks[this.data.subTaskId].name,
      });
    }
  }

  onSubmit() {
    this.isSubmitButtonDisable = true;
    const submitData = { ...this.subTaskForm.value };

    if (this.data.subTaskId) {
      this.ganttScreenService
        .updateSubTask(
          this.projId,
          this.data.parent,
          this.data.subTaskId,
          submitData
        )
        .then(() => this.dialogRef.close());
    } else {
      this.ganttScreenService
        .postNewSubTask(this.projId, this.data.parent.id, submitData)
        .then(() => this.dialogRef.close());
    }
  }
}
