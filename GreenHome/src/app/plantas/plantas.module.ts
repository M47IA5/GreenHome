import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantasPageRoutingModule } from './plantas-routing.module';

import { PlantasPage } from './plantas.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GlobalModule } from '../global/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantasPageRoutingModule,
    GlobalModule
  ],
  declarations: [PlantasPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlantasPageModule {}
