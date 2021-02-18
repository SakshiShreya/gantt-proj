import { Component, OnInit } from "@angular/core";
import { IProj } from "../interfaces/chartInterfaces";
import { GanttFirebaseService } from "../services/gantt-firebase.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-settings-screen",
  templateUrl: "./settings-screen.component.html",
  styleUrls: ["./settings-screen.component.scss"],
})
export class SettingsScreenComponent implements OnInit {
  projData: IProj = { name: "" };
  logoRefs: firebase.storage.Reference[];
  fb;
  logoRef: firebase.storage.Reference;
  selectedLogoData: { name: string; url: string };

  constructor(private ganttFirebaseService: GanttFirebaseService) {}

  ngOnInit() {
    this.ganttFirebaseService
      .getProj(this.ganttFirebaseService.projId)
      .subscribe((res) => {
        this.projData = res.payload.data();
        this.selectLogo();
      });

    this.ganttFirebaseService.getAllLogos().then(({ items }) => {
      this.logoRefs = items;
      this.selectLogo();
    });
  }

  selectLogo() {
    if (this.projData.logo && this.projData.logo.name) {
      this.logoRef = this.logoRefs.find(
        (logoRef) => logoRef.name === this.projData.logo.name
      );
    }
  }

  onLogoChange() {
    console.log(this.logoRef);
    if (this.logoRef) {
      this.logoRef.getDownloadURL().then((url) => {
        this.selectedLogoData = { name: this.logoRef.name, url };
      });
    } else {
      this.selectedLogoData = { name: "", url: "" };
    }
  }

  onLogoSave() {
    console.log(this.selectedLogoData);
    this.ganttFirebaseService
      .updateProj(this.ganttFirebaseService.projId, {
        logo: this.selectedLogoData,
      })
      .then((res) => console.log(res))
      .catch(console.log);
  }
}
