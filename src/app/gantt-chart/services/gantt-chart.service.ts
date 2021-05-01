import { Observable, Subject } from "rxjs";
import {
  ISubtask,
  ISubtaskRaw,
  ITask,
  ITaskRaw,
} from "../interfaces/chartInterfaces";

export class GanttChartService {
  private parseDataState = new Subject<Array<ITask>>();
  parseData = Array<ITask>();

  setParseData(data: Array<ITask>) {
    this.parseData = data;
    this.parseDataState.next(data);
  }

  getParseData(): Observable<Array<ITask>> {
    return this.parseDataState.asObservable();
  }

  /**
   * @param data chart data - may be raw or parsed
   * @param taskIndex index of task (not task.id)
   * @param subtaskIndex index of subtask
   * @returns Array<taskindex, subtaskindex]> of all subtasks that are dependendent on current subtask
   */
  findDependents(
    data: Array<ITaskRaw> | Array<ITask>,
    taskIndex: number,
    subtaskIndex: number
  ) {
    const dependents: Array<[number, number]> = [];
    data.forEach((task: ITaskRaw | ITask, taskid: number) => {
      task.subtasks &&
        task.subtasks.forEach(
          (subtask: ISubtaskRaw | ISubtask, subtaskid: number) => {
            subtask.dependencies &&
              subtask.dependencies.forEach((dependency) => {
                if (
                  data[taskIndex].id + "-" + subtaskIndex ===
                  dependency.subtask
                ) {
                  dependents.push([taskid, subtaskid]);
                }
              });
          }
        );
    });
    return dependents;
  }
}
