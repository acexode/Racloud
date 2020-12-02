import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaLogoComponent } from './ra-logo.component';

describe('RaLogoComponent', () => {
  let component: RaLogoComponent;
  let fixture: ComponentFixture<RaLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
