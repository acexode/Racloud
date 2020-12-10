import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTabComponent } from './customer-tab.component';

describe('CustomerTabComponent', () => {
  let component: CustomerTabComponent;
  let fixture: ComponentFixture<CustomerTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
