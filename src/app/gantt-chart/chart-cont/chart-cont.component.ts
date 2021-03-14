import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from "@angular/core";
import { ITaskRaw } from "../interfaces/chartInterfaces";

@Component({
  selector: "app-chart-cont",
  templateUrl: "./chart-cont.component.html",
  styleUrls: ["./chart-cont.component.scss"],
})
export class ChartContComponent {
  @Input() chartDataRaw: Array<ITaskRaw>;
  @ViewChild("chartContainer", { static: true }) chartContainer: ElementRef;
  width = "615px";
  isGettingDragged = false;

  constructor() {
    if (localStorage.getItem("chartWidth")) {
      this.width = localStorage.getItem("chartWidth");
    } else {
      this.width = "615px";
    }
  }

  startDragging(event: MouseEvent) {
    event.preventDefault();
    this.isGettingDragged = true;
  }

  @HostListener("window:mouseup", ["$event"])
  @HostListener("window:pointerup", ["$event"])
  stopDragging(event: MouseEvent) {
    this.changeWidth(event);
    if (this.isGettingDragged) {
      localStorage.setItem("chartWidth", this.width);
    }

    this.isGettingDragged = false;
  }

  @HostListener("window:mousemove", ["$event"])
  @HostListener("window:pointermove", ["$event"])
  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    this.changeWidth(event);
  }

  changeWidth(event: MouseEvent) {
    if (this.isGettingDragged) {
      const clientRect = this.chartContainer.nativeElement.getBoundingClientRect();

      // Calculate new width
      let width = event.clientX - clientRect.left;

      if (width < 213) {
        width = 213;
      }
      if (width > 615) {
        width = 615;
      }
      if (width > clientRect.width - 20) {
        width = clientRect.width - 20;
      }

      this.width = width + "px";
    }
  }
}
