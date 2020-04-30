import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttFormComponent } from './gantt-form.component';

describe('GanttFormComponent', () => {
  let component: GanttFormComponent;
  let fixture: ComponentFixture<GanttFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
