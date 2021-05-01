import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import {
  ITask,
  ISubtask,
  ISubtaskChart,
  ITaskChart,
  IBoundary,
  IDependencyPoint,
} from "../../interfaces/chartInterfaces";
import * as moment from "moment";
import { GanttChartService } from "../../services/gantt-chart.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["../table/table.component.scss", "./chart.component.scss"],
})
export class ChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren("tasks") tasksSubtasksRef: QueryList<ElementRef>;
  @ViewChild("chart", { static: false }) chartRef: ElementRef;
  dates: Array<moment.Moment> = [];
  data: Array<ITask> = [];
  chartData: Array<ITaskChart> = [];
  colWidth = 50;
  dataSubscription: Subscription;
  dependencyPoints: Array<IDependencyPoint> = [];

  constructor(private ganttChartService: GanttChartService) {}

  findDateBoundaries(data: Array<ITask>) {
    let minStartDate: moment.Moment;
    let maxEndDate: moment.Moment;

    function calcBoundary(startDate: moment.Moment, endDate: moment.Moment) {
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
    }

    data.forEach(({ startDate, endDate, subtasks }) => {
      if (startDate) calcBoundary(startDate, endDate);
      subtasks &&
        subtasks.forEach(({ startDate, endDate }) => {
          calcBoundary(startDate, endDate);
        });
    });

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
      left: task.startDate ? task.startDate.diff(this.dates[0], "days") : 0,
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
    // console.log("Update chart data", this.chartData);
  }

  calcBound() {
    const chartDataFlat = [];
    const chartDataBound: { [x: string]: IBoundary } = {};
    const initialBound = {
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
      left: 0,
      right: 0,
    };
    const chartBound = this.chartRef.nativeElement.getBoundingClientRect();

    this.chartData.forEach((task) => {
      chartDataBound[task.id] = {
        index: chartDataFlat.length,
        ...initialBound,
      };
      chartDataFlat.push(task.id);

      task.subtasks &&
        task.subtasks.forEach((_, subtaskId) => {
          chartDataBound[task.id + "-" + subtaskId] = {
            index: chartDataFlat.length,
            ...initialBound,
          };
          chartDataFlat.push(task.id + "-" + subtaskId);
        });
    });

    this.tasksSubtasksRef.forEach((taskSubtask, index) => {
      const bound = taskSubtask.nativeElement.getBoundingClientRect();
      chartDataBound[chartDataFlat[index]] = {
        index,
        bottom: Math.round(bound.bottom - chartBound.top),
        height: Math.round(bound.height),
        left: Math.round(bound.left - chartBound.left),
        right: Math.round(bound.right - chartBound.left),
        top: Math.round(bound.top - chartBound.top),
        width: Math.round(bound.width),
      };
    });

    return chartDataBound;
  }

  makeDependencyLines() {
    const bound = this.calcBound();

    this.chartData.forEach((task) => {
      // right now task doesn't have any dependency. So we can skip this for now

      task.subtasks &&
        task.subtasks.forEach((subtask, i) => {
          subtask.dependencies &&
            subtask.dependencies.forEach((dependency) => {
              const thisSubtask = bound[task.id + "-" + i]; // where line ends
              const otherSubtask = bound[dependency.subtask]; // where line starts

              const top = Math.min(
                thisSubtask.top + thisSubtask.height / 2,
                otherSubtask.top + otherSubtask.height / 2
              );
              const bottom = Math.max(
                thisSubtask.top + thisSubtask.height / 2,
                otherSubtask.top + otherSubtask.height / 2
              );
              const left = Math.min(thisSubtask.left, otherSubtask.right);
              const right = Math.max(thisSubtask.left, otherSubtask.right);
              const startX = otherSubtask.right - left + 10;
              const startY =
                otherSubtask.top - top + 10 + otherSubtask.height / 2;
              const endX = thisSubtask.left - left + 10;
              const endY = thisSubtask.top - top + 10 + thisSubtask.height / 2;

              let points;
              if (endX - startX > 20) {
                points = `${startX},${startY} ${startX + 10},${startY} ${
                  startX + 10
                },${endY} ${endX},${endY}`;
              } else {
                points = `${startX},${startY} ${startX + 10},${startY} ${
                  startX + 10
                },${startY + otherSubtask.height / 2 + 2} ${endX - 10},${
                  startY + otherSubtask.height / 2 + 2
                } ${endX - 10},${endY} ${endX},${endY}`;
              }

              const triangle = `${endX - 5},${endY - 2} ${endX},${endY} ${
                endX - 5
              },${endY + 2}`;

              this.dependencyPoints.push({
                top: top - 10,
                bottom: bottom + 10,
                left: left - 10,
                right: right + 10,
                points,
                triangle,
              });
            });
        });
    });
  }

  ngOnInit() {
    // set data initially if available
    this.data = this.ganttChartService.parseData;
    if (this.data.length) {
      this.updateGanttChart();
    }

    this.dataSubscription = this.ganttChartService
      .getParseData()
      .subscribe((data) => {
        this.data = data;
        this.dependencyPoints = [];
        this.updateGanttChart();

        // let chart update first
        setTimeout(() => {
          this.makeDependencyLines();
        });
      });
  }

  ngAfterViewInit() {
    this.makeDependencyLines();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
