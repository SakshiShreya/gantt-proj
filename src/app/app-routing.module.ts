import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GanttScreenComponent } from "./gantt-screen/gantt-screen.component";
import { PreloadAllModules } from "@angular/router";

const routes: Routes = [
  { path: "chart1", component: GanttScreenComponent },
  {
    path: "chart",
    loadChildren: () =>
      import("./gantt-chart/gantt-chart.module").then(
        (m) => m.GanttChartModule
      ),
  },
  { path: "", redirectTo: "/chart", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
