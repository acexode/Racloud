import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPriceListsComponent } from './edit-price-lists.component';

describe('EditPriceListsComponent', () => {
  let component: EditPriceListsComponent;
  let fixture: ComponentFixture<EditPriceListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPriceListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPriceListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
