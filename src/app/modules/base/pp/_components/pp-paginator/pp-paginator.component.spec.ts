import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpPaginatorComponent } from './pp-paginator.component';

describe('PpPaginatorComponent', () => {
  let component: PpPaginatorComponent;
  let fixture: ComponentFixture<PpPaginatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpPaginatorComponent]
    });
    fixture = TestBed.createComponent(PpPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
