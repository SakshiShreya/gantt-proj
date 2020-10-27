import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChartContComponent } from "./chart-cont.component";

describe("ChartComponent", () => {
  let component: ChartContComponent;
  let fixture: ComponentFixture<ChartContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartContComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
