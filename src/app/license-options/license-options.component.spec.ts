import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseOptionsComponent } from './license-options.component';

describe('LicenseOptionsComponent', () => {
  let component: LicenseOptionsComponent;
  let fixture: ComponentFixture<LicenseOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
