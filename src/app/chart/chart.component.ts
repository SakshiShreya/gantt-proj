import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as d3 from "d3";
import * as moment from "moment";
import {
  IMargin,
  IDimensions,
  IGanttDataRaw,
  ICreateChartSVGOptions,
  IGanttData,
  ESortMode,
  ICreateElementData,
} from "../interfaces/chartInterfaces";
import { MatDialog } from "@angular/material";
import { GanttFormComponent } from "../gantt-form/gantt-form.component";
import {
  ConfirmDeleteComponent,
  eConfirmState,
} from "./confirm-delete/confirm-delete.component";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnChanges {
  @Input() chartDataRaw: Array<IGanttDataRaw>;
  @ViewChild("chart", { static: true }) private chartContainer: ElementRef<
    HTMLDivElement
  >;
  parsedData: Array<IGanttData> = [];
  elementHeight = 24;
  // chartDimensionsHeight is set depending on data
  chartDimensions: IDimensions = { width: 1000, height: 0 };
  startDate = new Date("1 Jan 2020");
  endDate = new Date();
  fontSize = 12;
  sortMode = ESortMode.Date;
  showRelations = true;
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  g1: d3.Selection<SVGGElement, unknown, null, undefined>;
  linesContainer: d3.Selection<SVGGElement, unknown, null, undefined>;
  barsContainer: d3.Selection<SVGGElement, unknown, null, undefined>;
  gridContainer: d3.Selection<SVGGElement, unknown, null, undefined>;
  xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  xScale: d3.ScaleTime<number, number>;

  get margin(): IMargin {
    return {
      top: this.elementHeight * 2,
      left: this.elementHeight * 2,
    };
  }

  get scaleDimensions(): IDimensions {
    return {
      width: this.chartDimensions.width - this.margin.left * 2,
      height: this.chartDimensions.width - this.margin.top * 2,
    };
  }

  constructor(public dialog: MatDialog) {}

  changeChartDimensionsHeight() {
    // add space for top margin and top scale
    // Top scale is equal to margin top
    // 10 is the spacing between two bars
    this.chartDimensions.height =
      this.chartDataRaw.length * (this.elementHeight * 1.5) +
      this.margin.top * 2;
  }

  createChartSVG(
    data: Array<IGanttData>,
    extremeDates: ICreateChartSVGOptions
  ) {
    // create container element for the whole chart
    this.svg = d3.select(this.chartContainer.nativeElement).append("svg");

    // create container for the data
    this.g1 = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.margin.left},${this.margin.top / 2})`
      );

    this.gridContainer = this.g1
      .append("g")
      .attr(
        "transform",
        `translate(${-this.margin.left},${
          this.margin.top - this.elementHeight / 4
        })`
      );

    this.linesContainer = this.g1
      .append("g")
      .attr("transform", `translate(0,${this.margin.top})`);

    this.barsContainer = this.g1
      .append("g")
      .attr("transform", `translate(0,${this.margin.top})`);

    this.xScale = d3.scaleTime().range([0, this.scaleDimensions.width]);
    this.xAxisGroup = this.g1.append("g");

    this.updateChartSVG(data, extremeDates);
  }

  updateChartSVG(
    data: Array<IGanttData>,
    { minStartDate, maxEndDate }: ICreateChartSVGOptions
  ) {
    this.svg
      .attr("width", this.chartDimensions.width)
      .attr("height", this.chartDimensions.height);

    this.xScale.domain([minStartDate.toDate(), maxEndDate.toDate()]);
    const xAxis = d3.axisBottom(this.xScale);
    this.xAxisGroup.call((axis) => {
      axis.call(xAxis);
      axis
        .selectAll("text")
        .style("font-family", "Roboto, 'Helvetica Neue', sans-serif");
      return xAxis(axis);
    });

    // prepare data for every data element
    const rectangleData = this.createElementData(data, this.xScale);
    const gridLineData = this.createGridLineData(data);

    // add stuff to the SVG
    const gridLines = this.gridContainer.selectAll("line").data(gridLineData);

    // remove old gridlines
    gridLines.exit().remove();

    // add new gridlines (there is no update gridline)
    gridLines
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", this.chartDimensions.width - this.margin.left)
      .attr("y1", (d: number) => d)
      .attr("y2", (d: number) => d)
      .style("stroke", "rgba(0,0,0,0.12)")
      .style("stroke-width", "1px");

    if (this.showRelations) {
      // create data describing connections' lines
      const polylineData: any = this.createPolylineData(rectangleData);

      const lines = this.linesContainer
        .selectAll("polyline")
        .data(polylineData);

      // remove old lines;
      lines.exit().remove();

      // update lines
      lines.style("stroke", "#ff4081").attr("points", (d: string) => d);

      // add new lines
      lines
        .enter()
        .append("polyline")
        .style("fill", "none")
        .style("stroke", "#ff4081")
        .attr("points", (d: string) => d);
    }

    const bars = this.barsContainer.selectAll("g").data(rectangleData);

    // Remove unused bars
    bars.exit().remove();

    // Update bars
    bars
      .select("rect")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y)
      .attr("width", (d: any) => d.width)
      .attr("height", (d: any) => d.height);

    bars
      .select("text")
      .attr("x", (d: any) => d.labelX)
      .attr("y", (d: any) => d.labelY)
      .text((d: any) => d.label);

    // Add new bars
    const barGroup = bars.enter().append("g");

    barGroup
      .append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y)
      .attr("width", (d: any) => d.width)
      .attr("height", (d: any) => d.height)
      .style("fill", "#3f51b5")
      .style("stroke", "black");

    barGroup
      .append("text")
      .style("fill", "white")
      .style("font-family", "Roboto, 'Helvetica Neue', sans-serif")
      .attr("x", (d: any) => d.labelX)
      .attr("y", (d: any) => d.labelY)
      .text((d: any) => d.label);

    bars.append("title").text((d: any) => d.tooltip);
  }

  createGridLineData(data: Array<IGanttData>) {
    const gridLineData = data.map((d, i) => i * this.elementHeight * 1.5);
    gridLineData.push(
      gridLineData[gridLineData.length - 1] + this.elementHeight * 1.5
    );
    return gridLineData;
  }

  createElementData(
    data: Array<IGanttData>,
    xScale: d3.ScaleTime<number, number>
  ): Array<ICreateElementData> {
    return data.map((d, i) => {
      const x = xScale(d.startDate.toDate());
      const xEnd = xScale(d.endDate.toDate());
      const y = i * this.elementHeight * 1.5;
      const width = xEnd - x;
      const height = this.elementHeight;

      const charWidth = width / this.fontSize;
      const dependsOn = d.dependsOn;
      const id = d.id;

      const tooltip = d.label;

      const singleCharWidth = this.fontSize * 0.5;
      const singleCharHeight = this.fontSize * 0.45;

      let label = d.label;

      if (label.length > charWidth) {
        label =
          label
            .split("")
            .slice(0, charWidth - 3)
            .join("") + "...";
      }

      const labelX = x + (width / 2 - (label.length / 2) * singleCharWidth);
      const labelY = y + (height / 2 + singleCharHeight);

      return {
        x,
        y,
        xEnd,
        width,
        height,
        id,
        dependsOn,
        label,
        labelX,
        labelY,
        tooltip,
      };
    });
  }

  createPolylineData(rectangleData: Array<ICreateElementData>) {
    // prepare dependencies polyline data
    const cachedData = this.createDataCacheById(rectangleData);

    // used to calculate offsets between elements later
    const storedConnections = rectangleData.reduce(
      (acc, e) => Object.assign(acc, { [e.id]: 0 }),
      {}
    );

    // create data describing connections' lines
    return rectangleData.flatMap((d) =>
      d.dependsOn
        .map((parentId) => cachedData[parentId])
        .map((parent) => {
          // increase the amount rows occupied by both parent and current element (d)
          storedConnections[parent.id]++;
          storedConnections[d.id]++;

          const deltaParentConnections =
            storedConnections[parent.id] * (this.elementHeight / 4);
          const deltaChildConnections =
            storedConnections[d.id] * (this.elementHeight / 4);

          const points = [
            d.x,
            d.y + this.elementHeight / 2,
            d.x - deltaChildConnections,
            d.y + this.elementHeight / 2,
            d.x - deltaChildConnections,
            d.y - this.elementHeight * 0.25,
            parent.xEnd + deltaParentConnections,
            d.y - this.elementHeight * 0.25,
            parent.xEnd + deltaParentConnections,
            parent.y + this.elementHeight / 2,
            parent.xEnd,
            parent.y + this.elementHeight / 2,
          ];

          return points.join(",");
        })
    );
  }

  prepareDataElement({
    id,
    label,
    startDate: startDateRaw,
    endDate: endDateRaw,
    duration,
    dependsOn,
  }: IGanttDataRaw): IGanttData {
    // calculate startDate and endDate
    if ((!startDateRaw || !endDateRaw) && !duration) {
      throw new Error(
        "Wrong element format: should contain either startDate and duration, or endDate and duration or startDate and endDate"
      );
    }

    let startDate: moment.Moment;
    if (startDateRaw) {
      startDate = moment(startDateRaw);
    }

    let endDate: moment.Moment;
    if (endDateRaw) {
      endDate = moment(endDateRaw);
    }

    if (startDate && !endDate && duration) {
      endDate = moment(startDate);
      endDate.add(...duration);
    }

    if (!startDate && endDate && duration) {
      startDate = moment(endDate) as moment.Moment;
      startDate.subtract(...duration);
    }

    if (!dependsOn) {
      dependsOn = [];
    }

    return {
      id,
      label,
      startDate,
      endDate,
      duration,
      dependsOn,
    };
  }

  parseUserData(data: Array<IGanttDataRaw>): Array<IGanttData> {
    return data.map(this.prepareDataElement);
  }

  createDataCacheById(
    data: Array<{ id: string; [x: string]: any }>
  ): { [x: string]: { id: string; [x: string]: any } } {
    return data.reduce(
      (cache, elt) => Object.assign(cache, { [elt.id]: elt }),
      {}
    );
  }

  createChildrenCache(data: Array<IGanttData>) {
    const dataCache = this.createDataCacheById(data);

    const fillDependenciesForElement = (
      eltId: string,
      dependenciesByParent: { [x: string]: Array<string> }
    ) => {
      dataCache[eltId].dependsOn.forEach((parentId) => {
        if (!dependenciesByParent[parentId]) {
          dependenciesByParent[parentId] = [];
        }

        if (dependenciesByParent[parentId].indexOf(eltId) < 0) {
          dependenciesByParent[parentId].push(eltId);
        }

        fillDependenciesForElement(parentId, dependenciesByParent);
      });
    };

    return data.reduce((cache, elt) => {
      if (!cache[elt.id]) {
        cache[elt.id] = [];
      }

      fillDependenciesForElement(elt.id, cache);

      return cache;
    }, {} as { [x: string]: Array<string> });
  }

  sortElementsByChildrenCount(data: Array<IGanttData>) {
    const childrenByParentId = this.createChildrenCache(data);

    return data.sort((e1, e2) => {
      if (
        childrenByParentId[e1.id] &&
        childrenByParentId[e2.id] &&
        childrenByParentId[e1.id].length > childrenByParentId[e2.id].length
      ) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortElementsByEndDate(data: Array<IGanttData>) {
    return data.sort((e1, e2) => {
      if (moment(e1.endDate).isBefore(moment(e2.endDate))) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortElements(data: Array<IGanttData>, sortMode: ESortMode) {
    if (sortMode === ESortMode.ChildrenCount) {
      return this.sortElementsByChildrenCount(data);
    } else if (sortMode === ESortMode.Date) {
      return this.sortElementsByEndDate(data);
    }
  }

  findDateBoundaries(data: Array<IGanttData>) {
    let minStartDate: moment.Moment;
    let maxEndDate: moment.Moment;

    data.forEach(({ startDate, endDate }) => {
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
    });

    return {
      minStartDate,
      maxEndDate,
    };
  }

  updateGanttChart(action: "create" | "update") {
    this.changeChartDimensionsHeight();

    // transform raw user data to valid values
    // calculate startDate and endDate based on duration
    // id dependsOn is undefined, then dependsOn=[]
    const data = this.parseUserData(this.chartDataRaw);

    // sort the data
    this.parsedData = this.sortElements(data, this.sortMode);

    // find min start date and max end date from all data points
    const { minStartDate, maxEndDate } = this.findDateBoundaries(data);

    // add some padding to axes
    minStartDate.subtract(2, "days");
    maxEndDate.add(2, "days");

    if (action === "create") {
      this.createChartSVG(data, {
        minStartDate,
        maxEndDate,
      });
    } else {
      this.updateChartSVG(data, { minStartDate, maxEndDate });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartDataRaw.firstChange) {
      this.updateGanttChart("create");
    } else if (this.chartDataRaw.length) {
      this.updateGanttChart("update");
    }
  }

  openForm(row: IGanttData) {
    this.dialog.open(GanttFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      data: { dependencyDropdown: this.parsedData, row },
    });
  }

  deleteRow(row: IGanttData) {
    let state: eConfirmState;

    // check if any row depends on this row
    const dependents = this.parsedData.filter((data) =>
      data.dependsOn.includes(row.id)
    );
    if (dependents.length) {
      // row has dependents
      state = eConfirmState.CANT_DELETE;
    } else {
      state = eConfirmState.CONFIRM;
    }

    this.dialog.open(ConfirmDeleteComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      data: { row, state, dependents },
    });
  }
}
