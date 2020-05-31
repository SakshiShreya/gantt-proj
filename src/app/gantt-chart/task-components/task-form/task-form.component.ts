import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GanttScreenService } from "../../gantt-screen/gantt-screen.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ITask } from "../../interfaces/chartInterfaces";

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
  projId = "GiJfbLcXDAfSXpv9ndac";

  constructor(
    private ganttScreenService: GanttScreenService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row?: ITask }
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
      this.ganttScreenService
        .updateTask(this.projId, this.data.row.id, submitData)
        .then(() => this.dialogRef.close());
    } else {
      this.ganttScreenService
        .postNewTask(this.projId, submitData)
        .then(() => this.dialogRef.close());
    }
  }
}
