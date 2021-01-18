import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductFormStepComponent } from './add-product-form-step.component';

describe('AddProductFormStepComponent', () => {
  let component: AddProductFormStepComponent;
  let fixture: ComponentFixture<AddProductFormStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductFormStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductFormStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
