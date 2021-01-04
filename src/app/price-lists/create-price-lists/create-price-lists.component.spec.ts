import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePriceListsComponent } from './create-price-lists.component';

describe('CreatePriceListsComponent', () => {
  let component: CreatePriceListsComponent;
  let fixture: ComponentFixture<CreatePriceListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePriceListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePriceListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
