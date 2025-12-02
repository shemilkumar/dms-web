import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabHeaderComponent } from './components/tab-header/tab-header.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ButtonComponent } from './components/button/button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { ToastComponent } from './components/toast/toast.component';
import { HeaderComponent } from './components/header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { ShrinkMessagePipe } from './pipes/shrink-message.pipe';
import { EpochConverterPipe } from './pipes/epoch-converter.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { PpModule } from '../modules/base/pp/pp.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ButtonComponent,
    TabHeaderComponent,
    CustomModalComponent,
    ShrinkMessagePipe,
    SearchBoxComponent,
    ToastComponent,
    HeaderComponent,
    EpochConverterPipe,
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
    PpModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  exports: [
    ButtonComponent,
    CustomModalComponent,
    TabHeaderComponent,
    ShrinkMessagePipe,
    SearchBoxComponent,
    ToastComponent,
    HeaderComponent,
    EpochConverterPipe,
    UserManagementComponent
  ],
})
export class SharedModule { }
