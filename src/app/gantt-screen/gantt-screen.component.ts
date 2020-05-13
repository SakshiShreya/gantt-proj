import { Component, OnInit } from "@angular/core";
import { GanttScreenService } from "./gantt-screen.service";
import { IGanttDataRaw } from "../interfaces/chartInterfaces";
import { GanttFormComponent } from "../gantt-form/gantt-form.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-gantt-screen",
  templateUrl: "./gantt-screen.component.html",
  styleUrls: ["./gantt-screen.component.scss"],
})
export class GanttScreenComponent implements OnInit {
  ganttData: Array<IGanttDataRaw> = [];

  constructor(
    private ganttScreenService: GanttScreenService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.ganttScreenService.getGanttData().subscribe((res) => {
      this.ganttData = res.map((item) => ({
        id: item.payload.doc.id,
        ...item.payload.doc.data(),
      }));
    });
  }

  openForm() {
    const dialogRef = this.dialog.open(GanttFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      data: { dependencyDropdown: this.ganttData },
    });
  }
}
