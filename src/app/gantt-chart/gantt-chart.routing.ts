import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GanttScreenComponent } from "./gantt-screen/gantt-screen.component";
import { SettingsScreenComponent } from "./settings-screen/settings-screen.component";

const routes: Routes = [
  {path: "settings", component: SettingsScreenComponent},
  { path: "", component: GanttScreenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanttChartRoutingModule {}
