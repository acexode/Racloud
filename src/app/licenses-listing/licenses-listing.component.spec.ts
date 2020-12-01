import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensesListingComponent } from './licenses-listing.component';

describe('LicensesListingComponent', () => {
  let component: LicensesListingComponent;
  let fixture: ComponentFixture<LicensesListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
