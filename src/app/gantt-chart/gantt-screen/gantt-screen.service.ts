import { IProj, ITask, ISubTask } from "../interfaces/chartInterfaces";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";

export class GanttScreenService {
  constructor(private fireStore: AngularFirestore) {}

  getProj(projId: string) {
    return this.fireStore
      .collection("gantt-data")
      .doc<IProj>(projId)
      .snapshotChanges();
  }

  getTasks(projId: string) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection<ITask>("Tasks")
      .snapshotChanges();
  }

  postNewProj(projData: IProj) {
    return this.fireStore.collection("gantt-data").add(projData);
  }

  postNewTask(projId: string, taskData: ITask) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .add(taskData);
  }

  postNewSubTask(projId: string, taskId: string, subTaskData: ISubTask) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskId)
      .update({
        subTasks: firebase.firestore.FieldValue.arrayUnion(subTaskData),
      });
  }

  updateTask(projId: string, taskId: string, taskData: ITask) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskId)
      .set(taskData, { merge: true });
  }

  updateSubTask(
    projId: string,
    taskData: ITask,
    subTaskId: number,
    subTaskData: ISubTask
  ) {
    const subTask = [...taskData.subTasks];
    subTask[subTaskId] = subTaskData;

    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskData.id)
      .set({ subTask }, { merge: true });
  }

  deleteTask(projId: string, taskId: string) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskId)
      .delete();
  }
}
