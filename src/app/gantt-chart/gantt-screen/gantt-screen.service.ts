import { IProj, ITaskRaw, ISubtaskRaw } from "../interfaces/chartInterfaces";
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

  updateTask(projId: string, taskId: string, taskData: ITaskRaw) {
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
}
