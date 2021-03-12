import { Component, OnInit } from "@angular/core";
import { IProj } from "../interfaces/chartInterfaces";
import { GanttFirebaseService } from "../services/gantt-firebase.service";
import * as moment from "moment";

@Component({
  selector: "app-settings-screen",
  templateUrl: "./settings-screen.component.html",
  styleUrls: ["./settings-screen.component.scss"],
})
export class SettingsScreenComponent implements OnInit {
  name = "";
  projData: IProj = { name: "" };
  logoRefs: firebase.storage.Reference[] = []; // list to store data for dropdown
  logoRef: firebase.storage.Reference; // selected data in dropdown
  saving: { [x in keyof Required<IProj>]: boolean } = {
    name: false,
    logo: false,
    projManager: false,
    startDate: false,
    description: false,
  };
  reloadLogo = true;
  loading = true;

  constructor(private ganttFirebaseService: GanttFirebaseService) {}

  ngOnInit() {
    this.ganttFirebaseService
      .getProj(this.ganttFirebaseService.projId)
      .subscribe((res) => {
        const temp = res.payload.data();
        this.projData = { ...temp };
        this.name = temp.name;
        this.selectLogo();
        this.loading = false;
      });

    this.ganttFirebaseService.getAllLogos().then(({ items }) => {
      this.logoRefs = items;
      this.selectLogo();
    });
  }

  selectLogo() {
    if (this.projData.logo && this.projData.logo.name && this.logoRefs.length) {
      this.logoRef = this.logoRefs.find(
        (logoRef) => logoRef.name === this.projData.logo.name
      );

      this.loadLogo();
    }
  }

  onLogoChange() {
    this.reloadLogo = true;
    if (this.logoRef) {
      this.loadLogo();
    } else {
      this.projData.logo = { name: "", url: "" };
    }
  }

  loadLogo() {
    this.reloadLogo &&
      this.logoRef.getDownloadURL().then((url) => {
        this.projData.logo = { name: this.logoRef.name, url };
      });
  }

  onSave(field: keyof IProj) {
    if (field.toLowerCase().includes("date")) {
      this.convertMomentToDate(field);
    }

    this.reloadLogo = false;
    this.saving[field] = true;

    this.ganttFirebaseService
      .updateProj(this.ganttFirebaseService.projId, {
        [field]: this.projData[field],
      })
      .then(() => (this.saving[field] = false))
      .catch(console.log);
  }

  convertMomentToDate(field: keyof IProj) {
    this.projData[field] = ((this.projData[
      field
    ] as unknown) as moment.Moment).format("YYYY-MM-DD") as string & {
      name: string;
      url: string;
    };
  }
}
