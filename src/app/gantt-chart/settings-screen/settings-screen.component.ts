import { Component, OnInit } from "@angular/core";
import { IProj } from "../interfaces/chartInterfaces";
import { GanttFirebaseService } from "../services/gantt-firebase.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-settings-screen",
  templateUrl: "./settings-screen.component.html",
  styleUrls: ["./settings-screen.component.scss"],
})
export class SettingsScreenComponent implements OnInit {
  projData: IProj = { name: "" };
  downloadURL: Observable<string>;
  fb;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.ganttFirebaseService
      .getProj(this.ganttFirebaseService.projId)
      .subscribe((res) => {
        this.projData = res.payload.data();
      });
  }

  logoUploadHandler(files: FileList) {
    const file = files[0];
    const filePath = "logos/" + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((logo) => {
            if (logo) {
              this.fb = logo;
              this.ganttFirebaseService.updateProj(
                this.ganttFirebaseService.projId,
                { logo }
              );

              // TODO: show success screen
            } else {
              // TODO: show failure screen
            }
          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
        }
      });
  }
}
