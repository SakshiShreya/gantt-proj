import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GanttListScreenComponent } from "./gantt-list-screen/gantt-list-screen.component";

const routes: Routes = [
  { path: "", component: GanttListScreenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttListRoutingModule {}