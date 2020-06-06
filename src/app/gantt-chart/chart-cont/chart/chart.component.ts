import { Component, OnInit } from "@angular/core";
import {
  ITask,
  ISubtask,
  ISubtaskChart,
  ITaskChart,
} from "../../interfaces/chartInterfaces";
import * as moment from "moment";
import { ParseDataService } from "../parse-data.service";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["../table/table.component.scss", "./chart.component.scss"],
})
export class ChartComponent implements OnInit {
  dates: Array<moment.Moment> = [];
  data: Array<ITask> = [];
  chartData: Array<ITaskChart> = [];
  colWidth = 50;

  constructor(private dataService: ParseDataService) {}

  findDateBoundaries(data: Array<ITask>) {
    let minStartDate: moment.Moment;
    let maxEndDate: moment.Moment;

    data.forEach(
      (task) =>
        task.subtasks &&
        task.subtasks.forEach(({ startDate, endDate }) => {
          if (!minStartDate || startDate.isBefore(minStartDate)) {
            minStartDate = moment(startDate);
          }

          if (!minStartDate || endDate.isBefore(minStartDate)) {
            minStartDate = moment(endDate);
          }

          if (!maxEndDate || endDate.isAfter(maxEndDate)) {
            maxEndDate = moment(endDate);
          }

          if (!maxEndDate || startDate.isAfter(maxEndDate)) {
            maxEndDate = moment(startDate);
          }
        })
    );

    return {
      minStartDate,
      maxEndDate,
    };
  }

  prepareSubtask({ startDate, ...subtask }: ISubtask): ISubtaskChart {
    const left = startDate.diff(this.dates[0], "days");

    return {
      startDate,
      left,
      ...subtask,
    };
  }

  parseData(): Array<ITaskChart> {
    return this.data.map((task) => ({
      ...task,
      left: 0,
      subtasks: task.subtasks
        ? task.subtasks.map(subTask => this.prepareSubtask(subTask))
        : undefined,
    }));
  }

  updateGanttChart(action: "create" | "update") {
    console.log(action);
    // find min start date and max end date from all data points
    let { minStartDate, maxEndDate } = this.findDateBoundaries(this.data);
    if (minStartDate === undefined) {
      minStartDate = moment();
    }
    if (maxEndDate === undefined) {
      maxEndDate = moment();
    }

    // add some padding to axes
    minStartDate.subtract(1, "days");
    maxEndDate.add(1, "days");

    // create the array of dates
    this.dates = [];
    for (
      const m = moment(minStartDate);
      m.diff(maxEndDate, "days") <= 0;
      m.add(1, "days")
    ) {
      this.dates.push(moment(m));
    }

    this.chartData = this.parseData();
    console.log(this.chartData);

    // if (action === "create") {
    //   this.createChartSVG(data, {
    //     minStartDate,
    //     maxEndDate,
    //   });
    // } else {
    //   this.updateChartSVG(data, { minStartDate, maxEndDate });
    // }
  }

  ngOnInit() {
    let first = true;

    // set data initially if available
    this.data = this.dataService.parseData;
    if (this.data.length) {
      this.updateGanttChart("create");
      first = false;
    }

    this.dataService.getParseData().subscribe((data) => {
      this.data = data;
      if (first) {
        this.updateGanttChart("create");
        first = false;
      } else if (data.length) {
        this.updateGanttChart("update");
      }
    });
  }
}
