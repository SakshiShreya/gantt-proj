import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { IProjWId } from "src/app/shared/interfaces/ganttInterface";
import { isMobile } from "src/app/shared/services/deviceType";
import { GanttFirebaseService } from "src/app/shared/services/gantt-firebase.service";

@Component({
  selector: "app-gantt-list-screen",
  templateUrl: "./gantt-list-screen.component.html",
  styleUrls: ["./gantt-list-screen.component.scss"],
})
export class GanttListScreenComponent implements OnInit, OnDestroy {
  list: Array<IProjWId> = [];
  displayedColumns: string[] = ["name", "startDate", "projManager", "status"];
  columnNames = {
    name: "Project Name",
    startDate: "Start Date",
    projManager: "Project Owner",
    status: "Status",
  };
  isMobile = isMobile();
  projectListSubscription: Subscription;
  breakpointSubscription: Subscription;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    private router: Router,
    breakpointObserver: BreakpointObserver
  ) {
    this.breakpointSubscription = breakpointObserver
      .observe(["(max-width: 600px)"])
      .subscribe((res) => (this.isMobile = res.matches));
  }

  ngOnInit() {
    this.projectListSubscription = this.ganttFirebaseService
      .getProjList()
      .subscribe((res) => {
        this.list = res.map((item) => ({
          id: item.payload.doc.id,
          status: "Delayed",
          ...item.payload.doc.data(),
        }));
      });
  }

  ngOnDestroy() {
    this.projectListSubscription.unsubscribe();
    this.breakpointSubscription.unsubscribe();
  }

  createProject() {
    alert("This doesn't do anything for now.");
  }

  rowClick(row: IProjWId) {
    this.router.navigate(["chart", row.id]);
  }
}
