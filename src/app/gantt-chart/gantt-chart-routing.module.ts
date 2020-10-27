import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GanttScreenComponent } from "./gantt-screen/gantt-screen.component";

const routes: Routes = [{ path: "", component: GanttScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttChartRoutingModule {}
