import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskFormComponent } from './subtask-form.component';

describe('SubtaskFormComponent', () => {
  let component: SubtaskFormComponent;
  let fixture: ComponentFixture<SubtaskFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtaskFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
