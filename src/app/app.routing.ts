import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreloadAllModules } from "@angular/router";

const routes: Routes = [
  {
    path: "chart",
    loadChildren: () =>
      import("./gantt-chart/gantt-chart.module").then(
        (m) => m.GanttChartModule
      ),
  },
  {
    path: "charts",
    loadChildren: () =>
      import("./gantt-list/gantt-list.module").then((m) => m.GanttListModule),
  },
  { path: "", redirectTo: "/charts", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
