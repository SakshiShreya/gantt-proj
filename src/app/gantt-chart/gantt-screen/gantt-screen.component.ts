import { Component, OnDestroy, OnInit } from "@angular/core";
import { GanttFirebaseService } from "src/app/shared/services/gantt-firebase.service";
import { ITaskRaw } from "../interfaces/chartInterfaces";
import { IProj } from "src/app/shared/interfaces/ganttInterface";
import { MatDialog } from "@angular/material";
import { TaskFormComponent } from "../task-components/task-form/task-form.component";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { BreakpointObserver } from "@angular/cdk/layout";
import { GanttChartService } from "../services/gantt-chart.service";

@Component({
  selector: "app-gantt-screen",
  templateUrl: "./gantt-screen.component.html",
  styleUrls: ["./gantt-screen.component.scss"],
})
export class GanttScreenComponent implements OnInit, OnDestroy {
  projData: IProj = { name: "" };
  ganttDataRaw: Array<ITaskRaw> = [];
  loading = true;
  projId: string;
  isPortrait = false;
  projDataSubscription: Subscription;
  taskDataSubscription: Subscription;
  routeSubscription: Subscription;
  breakpointSubscription: Subscription;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    private ganttChartService: GanttChartService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    breakpointObserver: BreakpointObserver
  ) {
    this.breakpointSubscription = breakpointObserver
      .observe(["(orientation:portrait)"])
      .subscribe((res) => {
        this.isPortrait = res.matches;
      });
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(({ id }: Params) => {
      this.projId = id;
      this.getData();
    });
  }

  getData() {
    // First unsubscribe if already subscribed for some other project id
    if (this.projDataSubscription) {
      this.projDataSubscription.unsubscribe();
    }
    if (this.taskDataSubscription) {
      this.taskDataSubscription.unsubscribe();
    }

    this.projDataSubscription = this.ganttFirebaseService
      .getProj(this.projId)
      .subscribe((res) => {
        this.loading = false;
        this.projData = res.payload.data();
      });

    this.taskDataSubscription = this.ganttFirebaseService
      .getTasks(this.projId)
      .subscribe((res) => {
        this.ganttDataRaw = res
          .map((item) => ({
            id: item.payload.doc.id,
            ...item.payload.doc.data(),
          }))
          .sort((a, b) => a.order - b.order);

        this.ganttChartService.rawData = this.ganttDataRaw;
      });
  }

  ngOnDestroy() {
    this.projDataSubscription.unsubscribe();
    this.taskDataSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.breakpointSubscription.unsubscribe();
  }

  openForm() {
    this.dialog.open(TaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: {
        projId: this.projId,
        nextId: this.ganttDataRaw[this.ganttDataRaw.length - 1].order + 1,
      },
    });
  }
}
