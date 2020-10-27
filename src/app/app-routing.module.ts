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
