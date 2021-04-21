import {
  ITaskRaw,
  ISubtaskRaw,
} from "../../gantt-chart/interfaces/chartInterfaces";
import { IProj } from "../interfaces/ganttInterface";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";

export class GanttFirebaseService {
  constructor(private fireStore: AngularFirestore) {}

  getProj(projId: string) {
    return this.fireStore
      .collection("gantt-data")
      .doc<IProj>(projId)
      .snapshotChanges();
  }

  getProjList() {
    return this.fireStore.collection<IProj>("gantt-data").snapshotChanges();
  }

  updateProj(projId: string, projData: Partial<IProj>) {
    return this.fireStore
      .collection("gantt-data")
      .doc<IProj>(projId)
      .update(projData);
  }

  getTasks(projId: string) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection<ITaskRaw>("Tasks")
      .snapshotChanges();
  }

  postNewProj(projData: IProj) {
    return this.fireStore.collection("gantt-data").add(projData);
  }

  postNewTask(projId: string, taskData: ITaskRaw) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .add(taskData);
  }

  postNewSubtask(projId: string, taskId: string, subtaskData: ISubtaskRaw) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskId)
      .update({
        subtasks: firebase.firestore.FieldValue.arrayUnion(subtaskData),
      });
  }

  // Feels like I have used set here and update otherwise
  // so that I can remember that we can use set also
  updateTaskCompletely(projId: string, taskId: string, taskData: Partial<ITaskRaw>) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskId)
      .set(taskData, { merge: false });
  }

  updateTask(projId: string, taskId: string, taskData: Partial<ITaskRaw>) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskId)
      .set(taskData, { merge: true });
  }

  updateSubtask(
    projId: string,
    taskData: ITaskRaw,
    subtaskId: number,
    subtaskData: ISubtaskRaw
  ) {
    // copy the task list
    const subtasks = [...taskData.subtasks];
    // update the subtask that we want to change
    subtasks[subtaskId] = subtaskData;

    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskData.id)
      .update({ subtasks });
  }

  deleteTask(projId: string, taskId: string) {
    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskId)
      .delete();
  }

  deleteSubtask(projId: string, taskData: ITaskRaw, subtaskId: number) {
    // copy the task list
    const subtasks = [...taskData.subtasks];
    // remove the subtask that we want to delete
    subtasks.splice(subtaskId, 1);

    return this.fireStore
      .collection("gantt-data")
      .doc(projId)
      .collection("Tasks")
      .doc(taskData.id)
      .update({ subtasks });
  }

  getAllLogos() {
    let logosRef = firebase.storage().ref("logos");
    return logosRef.listAll();
  }
}
