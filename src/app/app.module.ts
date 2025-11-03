import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateProjectComponent } from './modules/executive/modals/create-project/create-project.component';
import { AddEditProjectComponent } from './modules/executive/modals/add-edit-project/add-edit-project.component';

@NgModule({
  declarations: [AppComponent, CreateProjectComponent, AddEditProjectComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
