import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { forkJoin } from "rxjs";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { ISubtaskRaw, ITaskRaw } from "../../interfaces/chartInterfaces";
import { GanttChartService } from "../../services/gantt-chart.service";

@Component({
  selector: "app-delete-subtask",
  templateUrl: "./delete-subtask.component.html",
  styleUrls: ["./delete-subtask.component.scss"],
})
export class DeleteSubtaskComponent {
  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    private ganttChartService: GanttChartService,
    public dialogRef: MatDialogRef<DeleteSubtaskComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      projId: string;
      parent: ITaskRaw;
      subtaskId: number;
      dependents?: Array<[number, number]>;
    }
  ) {}

  closePopup() {
    this.dialogRef.close();
  }

  deleteSubtask() {
    const dataRaw = this.ganttChartService.rawData;
    const dependentPromises = this.data.dependents.map((dependent) => {
      const newDependencies = dataRaw[dependent[0]].subtasks[
        dependent[1]
      ].dependencies.filter(
        (dep) => dep.subtask !== this.data.parent.id + "-" + this.data.subtaskId
      );
      const newSubtask: ISubtaskRaw = {
        ...dataRaw[dependent[0]].subtasks[dependent[1]],
        dependencies: newDependencies,
      };

      return this.ganttFirebaseService.updateSubtask(
        this.data.projId,
        dataRaw[dependent[0]],
        dependent[1],
        newSubtask
      );
    });

    const deleteSubtask = this.ganttFirebaseService.deleteSubtask(
      this.data.projId,
      this.data.parent,
      this.data.subtaskId
    );

    forkJoin([...dependentPromises, deleteSubtask]).subscribe(() =>
      this.dialogRef.close()
    );
  }
}
