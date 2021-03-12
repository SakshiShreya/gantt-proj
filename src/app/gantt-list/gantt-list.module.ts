import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppMaterialModule } from "../shared/modules/app-material.module";
import { GanttListRoutingModule } from "./gantt-list.routing";
import { GanttFirebaseService } from "../shared/services/gantt-firebase.service";
import { GanttListScreenComponent } from './gantt-list-screen/gantt-list-screen.component';

@NgModule({
  declarations: [GanttListScreenComponent],
  imports: [CommonModule, AppMaterialModule, GanttListRoutingModule],
  providers: [GanttFirebaseService],
})
export class GanttListModule {}
