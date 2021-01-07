import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOverlayComponent } from './app-overlay.component';

describe('AppOverlayComponent', () => {
  let component: AppOverlayComponent;
  let fixture: ComponentFixture<AppOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
