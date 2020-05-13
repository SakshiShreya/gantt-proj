import { IGanttDataRaw } from "../interfaces/chartInterfaces";
import { AngularFirestore } from "@angular/fire/firestore";

export class GanttScreenService {
  constructor(private fireStore: AngularFirestore) {}

  getGanttData() {
    return this.fireStore
      .collection<IGanttDataRaw>("gantt-data-test")
      .snapshotChanges();
  }

  postNewGanttRow(data: IGanttDataRaw) {
    return this.fireStore.collection("gantt-data-test").add(data);
  }

  updateGanttRow(data: IGanttDataRaw, id: string) {
    return this.fireStore
      .collection("gantt-data-test")
      .doc(id)
      .set(data, { merge: true });
  }

  deleteGanttRow(id: string) {
    return this.fireStore.collection("gantt-data-test").doc(id).delete();
  }
}
