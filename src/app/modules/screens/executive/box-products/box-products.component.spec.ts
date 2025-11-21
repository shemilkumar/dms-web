import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxProductsComponent } from './box-products.component';

describe('BoxProductsComponent', () => {
  let component: BoxProductsComponent;
  let fixture: ComponentFixture<BoxProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxProductsComponent]
    });
    fixture = TestBed.createComponent(BoxProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
