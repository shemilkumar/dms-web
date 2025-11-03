// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ButtonComponent } from './button.component';
// import { By } from '@angular/platform-browser';

// describe('ButtonComponent', () => {
//   let component: ButtonComponent;
//   let fixture: ComponentFixture<ButtonComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ButtonComponent]
//     }).compileComponents();

//     fixture = TestBed.createComponent(ButtonComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the button component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should render the correct variant class', () => {
//     component.variant = 'outline';
//     fixture.detectChanges();
//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     expect(buttonElement.classes['btn-outline']).toBeTruthy();
//     expect(buttonElement.classes['btn-primary']).toBeFalsy();
//   });

//   it('should render primary button by default', () => {
//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     expect(buttonElement.classes['btn-primary']).toBeTruthy();
//   });

//   it('should disable the button when disabled input is true', () => {
//     component.disabled = true;
//     fixture.detectChanges();
//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     expect(buttonElement.nativeElement.disabled).toBeTruthy();
//   });

//   it('should not disable the button when disabled input is false', () => {
//     component.disabled = false;
//     fixture.detectChanges();
//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     expect(buttonElement.nativeElement.disabled).toBeFalsy();
//   });

//   it('should project content inside the button', () => {
//     component.variant = 'primary';
//     fixture.detectChanges();

//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     buttonElement.nativeElement.innerHTML = '<span>Click Me</span>';
//     fixture.detectChanges();

//     expect(buttonElement.nativeElement.textContent.trim()).toBe('Click Me');
//   });

//   // it('should apply the loading state if loading is true', () => {
//   //   component.loading = true;
//   //   fixture.detectChanges();
//   //   const buttonElement = fixture.debugElement.query(By.css('button'));
//   //   expect(buttonElement.nativeElement.classList.contains('loading')).toBeTruthy();
//   // });

//   it('should render normal button by default', () => {
//     component.type = 'normal';
//     fixture.detectChanges();

//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     buttonElement.nativeElement.innerHTML = 'Normal Button';
//     fixture.detectChanges();

//     expect(buttonElement.nativeElement.textContent.trim()).toBe('Normal Button');
//   });

//   it('should render add icon when type is add', () => {
//     component.type = 'add';
//     component.label = 'Add Button'
//     fixture.detectChanges();

//     const buttonElement = fixture.debugElement.query(By.css('button'));

//     expect(buttonElement.nativeElement.textContent.trim()).toBe('Add Button');
//     expect(buttonElement.nativeElement.querySelector('img')).toBeTruthy();
//     expect(buttonElement.nativeElement.querySelector('img').src).toContain('add.svg');
//   });

//   // it('should render icon button when type is icon', () => {
//   //   // <ng-container *ngIf="type === 'icon'">
//   //   //     <ng-content></ng-content>
//   //   // </ng-container>

//   //   component.type = 'icon'
//   //   fixture.detectChanges();

//   //   const buttonElement = fixture.debugElement.query(By.css('button'));
//   //   buttonElement.nativeElement.innerHTML = '<img src="icon.svg"/>';
//   //   fixture.detectChanges();

//   //   expect(buttonElement.nativeElement).toBe('<img src="icon.svg"/>');
//   // }
//   // )

//   it('should run handleClick event when the button is clicked', () => {
//     component.onClick.emit = jest.fn();
//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     buttonElement.nativeElement.click();

//     expect(component.onClick.emit).toHaveBeenCalled();
//   })

//   it('should not run handleClick event when the button is disabled', () => {
//     component.onClick.emit = jest.fn();
//     component.disabled = true;
//     fixture.detectChanges();

//     const buttonElement = fixture.debugElement.query(By.css('button'));
//     buttonElement.nativeElement.click();

//     expect(component.onClick.emit).not.toHaveBeenCalled();
//   })
// });
