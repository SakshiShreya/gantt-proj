import { Component, Input, OnChanges } from "@angular/core";
import {
  ITaskRaw,
  ITask,
  ISubtaskRaw,
  ISubtask,
} from "../../interfaces/chartInterfaces";
import { EMove } from "../../interfaces/chartEnums";
import * as moment from "moment";
import { MatDialog } from "@angular/material";
import { TaskFormComponent } from "../../task-components/task-form/task-form.component";
import { SubtaskFormComponent } from "../../subtask-components/subtask-form/subtask-form.component";
import { DeleteTaskComponent } from "../../task-components/delete-task/delete-task.component";
import { DeleteSubtaskComponent } from "../../subtask-components/delete-subtask/delete-subtask.component";
import { GanttChartService } from "../../services/gantt-chart.service";
import { GanttFirebaseService } from "../../../shared/services/gantt-firebase.service";
import { forkJoin } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnChanges {
  @Input() chartDataRaw: Array<ITaskRaw>;
  chartData: Array<ITask> = [];
  eMove = EMove;

  constructor(
    public dialog: MatDialog,
    private ganttChartService: GanttChartService,
    private ganttFirebaseService: GanttFirebaseService,
    private route: ActivatedRoute
  ) {}

  prepareSubtask({
    startDate: startDateRaw,
    duration,
    ...subtask
  }: ISubtaskRaw): ISubtask {
    let startDate: moment.Moment;
    if (startDateRaw) {
      startDate = moment(startDateRaw);
    }

    const endDate = moment(startDate);
    endDate.add(...([(duration[0] as number) - 1, duration[1]] || [0, "days"]));

    return {
      startDate,
      endDate,
      duration,
      ...subtask,
    };
  }

  parseData(): Array<ITask> {
    return this.chartDataRaw.map((task) => ({
      ...task,
      subtasks: task.subtasks
        ? task.subtasks.map(this.prepareSubtask)
        : undefined,
    }));
  }

  ngOnChanges() {
    this.chartData = this.parseData();
    this.ganttChartService.setParseData(this.chartData);
  }

  editTask(row: ITaskRaw) {
    const projId = this.route.snapshot.params.id;

    this.dialog.open(TaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { projId, row },
    });
  }

  deleteTask(row: ITaskRaw) {
    const projId = this.route.snapshot.params.id;

    this.dialog.open(DeleteTaskComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { projId, row },
    });
  }

  addSubtask(row: ITaskRaw) {
    const projId = this.route.snapshot.params.id;

    this.dialog.open(SubtaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { projId, parent: row },
    });
  }

  editSubtask(taskId: string, subtaskId: number) {
    const projId = this.route.snapshot.params.id;

    this.dialog.open(SubtaskFormComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { projId, parent: this.chartDataRaw[taskId], subtaskId },
    });
  }

  deleteSubtask(taskId: string, subtaskId: number) {
    const projId = this.route.snapshot.params.id;
    this.dialog.open(DeleteSubtaskComponent, {
      width: "50%",
      minWidth: "300px",
      maxWidth: "550px",
      maxHeight: "100vh",
      data: { projId, parent: this.chartDataRaw[taskId], subtaskId },
    });
  }

  moveTasks(taskIndex: number, moveDirection: EMove) {
    const currTask = this.chartDataRaw[taskIndex];
    let otherTask: ITaskRaw = null;
    const projId = this.route.snapshot.params.id;

    if (moveDirection === EMove.UP) {
      // previous task
      otherTask = this.chartDataRaw[taskIndex - 1];
    } else {
      // next task
      otherTask = this.chartDataRaw[taskIndex + 1];
    }

    const currUpdate = this.ganttFirebaseService.updateTask(
      projId,
      currTask.id,
      { order: otherTask.order }
    );

    const otherUpdate = this.ganttFirebaseService.updateTask(
      projId,
      otherTask.id,
      { order: currTask.order }
    );

    forkJoin([currUpdate, otherUpdate]).subscribe(() => {
      /* do nothing for now */
    });
  }

  moveSubtasks(taskIndex: number, subtaskIndex: number, moveDirection: EMove) {
    let subtasks = this.chartDataRaw[taskIndex].subtasks;
    const projId = this.route.snapshot.params.id;

    const removeSubtask = (): Promise<void> => {
      return this.ganttFirebaseService.deleteSubtask(
        projId,
        this.chartDataRaw[taskIndex],
        subtaskIndex
      );
    };

    const multipleCalls = (promises: Array<Promise<void>>) => {
      forkJoin(promises).subscribe(() => {
        /* do nothing for now */
      });
    };

    const updateTask = () => {
      this.ganttFirebaseService
        .updateTask(projId, this.chartDataRaw[taskIndex].id, { subtasks })
        .then(() => {
          /* do nothing for now */
        });
    };

    if (moveDirection === EMove.UP) {
      if (subtaskIndex === 0) {
        // if it is topmost subtask, then it needs to be moved to the bottom of previous task

        // remove the subtask from this task
        const remove = removeSubtask();
        // and add it to the bottom of previous task
        const prevSubtasks = this.chartDataRaw[taskIndex - 1].subtasks || [];
        prevSubtasks.push(subtasks[subtaskIndex]);
        const add = this.ganttFirebaseService.updateTask(
          projId,
          this.chartDataRaw[taskIndex - 1].id,
          { subtasks: prevSubtasks }
        );

        // update both tasks in database
        multipleCalls([remove, add]);
      } else {
        // not the first subtask, then just swap the subtask with previous subtask and update in db
        const temp = subtasks[subtaskIndex];
        subtasks[subtaskIndex] = subtasks[subtaskIndex - 1];
        subtasks[subtaskIndex - 1] = temp;

        updateTask();
      }
    } else {
      if (subtaskIndex === this.chartDataRaw[taskIndex].subtasks.length - 1) {
        // if it is bottom-most subtask, then it needs to be moved to the top of next task

        // remove the subtask from this task
        const remove = removeSubtask();
        // and add it to the top of previous task
        const nextSubtasks = this.chartDataRaw[taskIndex + 1].subtasks || [];
        nextSubtasks.unshift(subtasks[subtaskIndex]);
        const add = this.ganttFirebaseService.updateTask(
          projId,
          this.chartDataRaw[taskIndex + 1].id,
          { subtasks: nextSubtasks }
        );

        // update both tasks in database
        multipleCalls([remove, add]);
      } else {
        // not the last subtask, then just swap the subtask with next subtask and update in db
        const temp = subtasks[subtaskIndex];
        subtasks[subtaskIndex] = subtasks[subtaskIndex + 1];
        subtasks[subtaskIndex + 1] = temp;

        updateTask();
      }
    }
  }
}
