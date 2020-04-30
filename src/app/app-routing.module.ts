import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GanttScreenComponent } from "./gantt-screen/gantt-screen.component";

const routes: Routes = [{ path: "chart", component: GanttScreenComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
