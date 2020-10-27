import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DeleteSubtaskComponent } from "./delete-subtask.component";

describe("DeleteTaskComponent", () => {
  let component: DeleteSubtaskComponent;
  let fixture: ComponentFixture<DeleteSubtaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSubtaskComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSubtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
