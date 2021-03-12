import { Component, OnDestroy, OnInit } from "@angular/core";
import { IProj } from "src/app/shared/interfaces/ganttInterface";
import { GanttFirebaseService } from "../../shared/services/gantt-firebase.service";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-settings-screen",
  templateUrl: "./settings-screen.component.html",
  styleUrls: ["./settings-screen.component.scss"],
})
export class SettingsScreenComponent implements OnInit, OnDestroy {
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
  projId: string;
  projDataSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(
    private ganttFirebaseService: GanttFirebaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(({ id }: Params) => {
      this.projId = id;
      this.getData();
    });

    this.ganttFirebaseService.getAllLogos().then(({ items }) => {
      this.logoRefs = items;
      this.selectLogo();
    });
  }

  getData() {
    // First unsubscribe if already subscribed for some other project id
    if (this.projDataSubscription) {
      this.projDataSubscription.unsubscribe();
    }

    this.projDataSubscription = this.ganttFirebaseService
      .getProj(this.projId)
      .subscribe((res) => {
        const temp = res.payload.data();
        this.projData = { ...temp };
        this.name = temp.name;
        this.selectLogo();
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.projDataSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
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
      .updateProj(this.projId, {
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
