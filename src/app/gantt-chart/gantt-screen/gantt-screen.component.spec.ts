import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttScreenComponent } from './gantt-screen.component';

describe('GanttScreenComponent', () => {
  let component: GanttScreenComponent;
  let fixture: ComponentFixture<GanttScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
