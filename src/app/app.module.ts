import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppMaterialModule } from "./shared/modules/app-material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AngularFireStorageModule } from "@angular/fire/storage";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
