import { NgModule } from "@angular/core";
import {
  MatInputModule,
  MatDatepickerModule,
  MatButtonModule,
  MatSelectModule,
  MatDialogModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
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
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
  ],
})
export class AppMaterialModule {}
