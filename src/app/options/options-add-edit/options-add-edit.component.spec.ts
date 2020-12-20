import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsAddEditComponent } from './options-add-edit.component';

describe('OptionsAddEditComponent', () => {
  let component: OptionsAddEditComponent;
  let fixture: ComponentFixture<OptionsAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
