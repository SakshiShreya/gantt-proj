import { Component, OnDestroy, OnInit } from "@angular/core";
import { GanttFirebaseService } from "src/app/shared/services/gantt-firebase.service";
import { ITaskRaw } from "../interfaces/chartInterfaces";
import { IProj } from "src/app/shared/interfaces/ganttInterface";
import { MatDialog } from "@angular/material";
import { TaskFormComponent } from "../task-components/task-form/task-form.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-gantt-screen",
  templateUrl: "./gantt-screen.component.html",
  styleUrls: ["./gantt-screen.component.scss"],
})
export class GanttScreenComponent implements OnInit, OnDestroy {
  projData: IProj = { name: "" };
  ganttDataRaw: Array<ITaskRaw> = [];
  loading = true;
  projDataSubscription: Subscription;
  taskDataSubscription: Subscription;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.projDataSubscription = this.ganttFirebaseService
      .getProj(this.ganttFirebaseService.projId)
      .subscribe((res) => {
        this.loading = false;
        this.projData = res.payload.data();
      });

    this.taskDataSubscription = this.ganttFirebaseService
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

  ngOnDestroy() {
    this.projDataSubscription.unsubscribe();
    this.taskDataSubscription.unsubscribe();
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
