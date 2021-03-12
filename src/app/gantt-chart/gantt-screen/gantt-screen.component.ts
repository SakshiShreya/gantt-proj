import { Component, OnInit } from "@angular/core";
import { GanttFirebaseService } from "../../shared/services/gantt-firebase.service";
import { IProj, ITaskRaw } from "../interfaces/chartInterfaces";
import { MatDialog } from "@angular/material";
import { TaskFormComponent } from "../task-components/task-form/task-form.component";

@Component({
  selector: "app-gantt-screen",
  templateUrl: "./gantt-screen.component.html",
  styleUrls: ["./gantt-screen.component.scss"],
})
export class GanttScreenComponent implements OnInit {
  projData: IProj = { name: "" };
  ganttDataRaw: Array<ITaskRaw> = [];
  loading = true;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.ganttFirebaseService
      .getProj(this.ganttFirebaseService.projId)
      .subscribe((res) => {
        this.loading = false;
        this.projData = res.payload.data();
      });

    this.ganttFirebaseService
      .getTasks(this.ganttFirebaseService.projId)
      .subscribe((res) => {
        this.ganttDataRaw = res
          .map((item) => ({
            id: item.payload.doc.id,
            ...item.payload.doc.data(),
          }))
          .sort((a, b) => a.order - b.order);
      });
  }

  openForm() {
    this.dialog.open(TaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: {
        nextId: this.ganttDataRaw[this.ganttDataRaw.length - 1].order + 1,
      },
    });
  }
}
