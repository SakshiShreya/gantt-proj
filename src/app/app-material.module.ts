import { NgModule } from "@angular/core";
import {
  MatInputModule,
  MatDatepickerModule,
  MatButtonModule,
  MatSelectModule,
  MatDialogModule,
} from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

@NgModule({
  exports: [
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
  ],
})
export class AppMaterialModule {}
