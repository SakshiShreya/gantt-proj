import { Observable, Subject } from 'rxjs';
import { ITask } from '../interfaces/chartInterfaces';

export class GanttChartService {
  private showDependencyState = new Subject<boolean>();
  showDependency = false;
  private parseDataState = new Subject<Array<ITask>>();
  parseData = Array<ITask>();

  setShowDependency(data: boolean) {
    this.showDependency = data;
    this.showDependencyState.next(data);
  }

  getShowDependency(): Observable<boolean> {
    return this.showDependencyState.asObservable();
  }

  setParseData(data: Array<ITask>) {
    this.parseData = data;
    this.parseDataState.next(data);
  }

  getParseData(): Observable<Array<ITask>> {
    return this.parseDataState.asObservable();
  }
}
