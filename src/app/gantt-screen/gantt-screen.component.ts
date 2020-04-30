import { Component, OnInit } from "@angular/core";
import { GanttScreenService } from "./gantt-screen.service";
import { IGanttDataRaw } from "../interfaces/chartInterfaces";

@Component({
  selector: "app-gantt-screen",
  templateUrl: "./gantt-screen.component.html",
  styleUrls: ["./gantt-screen.component.scss"],
})
export class GanttScreenComponent implements OnInit {
  ganttData: Array<IGanttDataRaw> = [];

  constructor(private ganttScreenService: GanttScreenService) {}

  ngOnInit() {
    this.ganttScreenService.getGanttData().subscribe((res) => {
      this.ganttData = res.map((item) => ({
        id: item.payload.doc.id,
        ...item.payload.doc.data(),
      }));
    });
  }
}
