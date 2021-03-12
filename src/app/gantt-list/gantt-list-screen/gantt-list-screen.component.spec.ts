import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttListScreenComponent } from './gantt-list-screen.component';

describe('GanttListScreenComponent', () => {
  let component: GanttListScreenComponent;
  let fixture: ComponentFixture<GanttListScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttListScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
