import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsejosPageRoutingModule } from './consejos-routing.module';

import { ConsejosPage } from './consejos.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsejosPageRoutingModule
  ],
  declarations: [ConsejosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsejosPageModule {}
