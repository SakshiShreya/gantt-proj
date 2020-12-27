import { Observable, Subject } from 'rxjs';
import { ITask } from '../interfaces/chartInterfaces';

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
}
