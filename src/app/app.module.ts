import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChartComponent } from "./chart/chart.component";
import { GanttScreenComponent } from "./gantt-screen/gantt-screen.component";
import { GanttFormComponent } from "./gantt-form/gantt-form.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppMaterialModule } from "./app-material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
import { GanttScreenService } from "./gantt-screen/gantt-screen.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfirmDeleteComponent } from "./chart/confirm-delete/confirm-delete.component";

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    GanttScreenComponent,
    GanttFormComponent,
    ConfirmDeleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  entryComponents: [GanttFormComponent, ConfirmDeleteComponent],
  providers: [
    GanttScreenService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
