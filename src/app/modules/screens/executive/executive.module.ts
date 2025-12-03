import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveRoutingModule } from './executive-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddEditProjectComponent } from './projects/add-edit-project/add-edit-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { PpModule } from '../../base/pp/pp.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BoxComponent } from './box/box.component';
import { BomComponent } from './bom/bom.component';
import { BoxProductsComponent } from './box-products/box-products.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddEditProductComponent } from './bom/modals/add-edit-product/add-edit-product.component';
import { CoreModule } from 'src/app/core/core.module';
import { QRCodeModule } from 'angularx-qrcode';
import { StickersComponent } from './bom/modals/stickers/stickers.component';
import { StickerPageComponent } from './sticker-page/sticker-page.component';
import { AddEditBoxComponent } from './box/modals/add-edit-box/add-edit-box.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ProjectsComponent, AddEditProjectComponent, HomeComponent, BoxComponent, BomComponent, BoxProductsComponent, AddEditProductComponent, StickersComponent, StickerPageComponent, AddEditBoxComponent],
  imports: [
    CommonModule, ExecutiveRoutingModule, SharedModule, MatDialogModule, FormsModule, ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule, PpModule, MatTooltipModule, MatMenuModule, CoreModule, QRCodeModule,
    MatSelectModule
  ],
})
export class ExecutiveModule { }
