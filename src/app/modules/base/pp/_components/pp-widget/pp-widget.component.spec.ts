import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpWidgetComponent } from './pp-widget.component';

describe('PpWidgetComponent', () => {
  let component: PpWidgetComponent;
  let fixture: ComponentFixture<PpWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpWidgetComponent]
    });
    fixture = TestBed.createComponent(PpWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
