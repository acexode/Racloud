import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionTabComponent } from './option-tab.component';

describe('OptionTabComponent', () => {
  let component: OptionTabComponent;
  let fixture: ComponentFixture<OptionTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
