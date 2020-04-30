import { NgModule } from "@angular/core";
import {
  MatInputModule,
  MatDatepickerModule,
  MatButtonModule,
  MatSelectModule,
} from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

@NgModule({
  exports: [
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class AppMaterialModule {}
