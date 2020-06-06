import { Component, Input} from "@angular/core";
import {
  ITaskRaw
} from "../interfaces/chartInterfaces";

@Component({
  selector: "app-chart-cont",
  templateUrl: "./chart-cont.component.html",
  styleUrls: ["./chart-cont.component.scss"],
})
export class ChartContComponent {
  @Input() chartDataRaw: Array<ITaskRaw>;
}
