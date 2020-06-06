import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GanttScreenComponent } from "./gantt-screen/gantt-screen.component";
import { GanttChartRoutingModule } from "./gantt-chart-routing.module";
import { AppMaterialModule } from "./../app-material.module";
import { ChartContComponent } from "./chart-cont/chart-cont.component";
import { GanttScreenService } from "./gantt-screen/gantt-screen.service";
import { TaskFormComponent } from "./task-components/task-form/task-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SubtaskFormComponent } from "./subtask-components/subtask-form/subtask-form.component";
import { DeleteTaskComponent } from "./task-components/delete-task/delete-task.component";
import { DeleteSubtaskComponent } from "./subtask-components/delete-subtask/delete-subtask.component";
import { TableComponent } from "./chart-cont/table/table.component";
import { ChartComponent } from './chart-cont/chart/chart.component';

@NgModule({
  declarations: [
    GanttScreenComponent,
    ChartContComponent,
    TaskFormComponent,
    SubtaskFormComponent,
    DeleteTaskComponent,
    DeleteSubtaskComponent,
    TableComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    GanttChartRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
  ],
  providers: [GanttScreenService],
  entryComponents: [
    TaskFormComponent,
    SubtaskFormComponent,
    DeleteTaskComponent,
    DeleteSubtaskComponent,
  ],
})
export class GanttChartModule {}
