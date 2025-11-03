import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpHeaderComponent } from './pp-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PpHeaderComponent', () => {
  let component: PpHeaderComponent;
  let fixture: ComponentFixture<PpHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA] // Add this line to ignore unknown elements

    });
    fixture = TestBed.createComponent(PpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
