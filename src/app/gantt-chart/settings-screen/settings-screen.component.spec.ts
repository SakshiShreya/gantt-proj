import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsScreenComponent } from './settings-screen.component';

describe('SettingsScreenComponent', () => {
  let component: SettingsScreenComponent;
  let fixture: ComponentFixture<SettingsScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
