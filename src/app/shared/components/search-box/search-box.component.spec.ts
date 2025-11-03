import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBoxComponent } from './search-box.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBoxComponent]
    });
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the input value when the input changes', () => {
    component.onChange.emit = jest.fn();

    const inputElement: HTMLInputElement = inputEl.nativeElement;

    // Simulate user input
    inputElement.value = 'Angular';
    inputEl.triggerEventHandler('input', { target: inputElement });

    // Trigger change detection
    fixture.detectChanges();

    // Assert that the emit method was called with 'Angular'
    expect(component.onChange.emit).toHaveBeenCalledWith('Angular');
  });
});
