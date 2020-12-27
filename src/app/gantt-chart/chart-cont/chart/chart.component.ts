import { Component, OnInit } from "@angular/core";
import {
  ITask,
  ISubtask,
  ISubtaskChart,
  ITaskChart,
} from "../../interfaces/chartInterfaces";
import * as moment from "moment";
import { GanttChartService } from "../../services/gantt-chart.service";

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

  constructor(private ganttChartService: GanttChartService) {}

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
      left: task.startDate && task.startDate.diff(this.dates[0], "days"),
      subtasks: task.subtasks
        ? task.subtasks.map((subtask) => this.prepareSubtask(subtask))
        : undefined,
    }));
  }

  updateGanttChart() {
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
  }

  ngOnInit() {
    // set data initially if available
    this.data = this.ganttChartService.parseData;
    if (this.data.length) {
      this.updateGanttChart();
    }

    this.ganttChartService.getParseData().subscribe((data) => {
      this.data = data;
      this.updateGanttChart();
    });
  }
}
