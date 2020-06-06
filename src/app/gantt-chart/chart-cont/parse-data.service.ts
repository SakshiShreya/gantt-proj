import { Subject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ITask } from "../interfaces/chartInterfaces";

@Injectable({ providedIn: "root" })
export class ParseDataService {
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
