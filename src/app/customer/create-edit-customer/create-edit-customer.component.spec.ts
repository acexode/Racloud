import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCustomerComponent } from './create-edit-customer.component';

describe('CreateEditCustomerComponent', () => {
  let component: CreateEditCustomerComponent;
  let fixture: ComponentFixture<CreateEditCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
