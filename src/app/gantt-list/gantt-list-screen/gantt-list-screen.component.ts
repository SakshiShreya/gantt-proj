import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gantt-list-screen',
  templateUrl: './gantt-list-screen.component.html',
  styleUrls: ['./gantt-list-screen.component.scss']
})
export class GanttListScreenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  createProject() {
    alert("This doesn't do anything for now.")
  }

}
