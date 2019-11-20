import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '@app/components/home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxMdModule} from "ngx-md";


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    NgxMdModule,
    FormsModule
  ]
})
export class HomeModule { }
