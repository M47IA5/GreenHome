import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componentes/header/header.component';
import { CustomInputComponent } from './componentes/custom-input/custom-input.component';
import { AgregarActualizarPlantComponent } from './componentes/agregar-actualizar-plant/agregar-actualizar-plant.component';
import { VerPlantComponent } from './componentes/ver-plant/ver-plant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgregarActualiFertComponent } from './componentes/agregar-actuali-fert/agregar-actuali-fert.component';
import { AgregarActualiEnferComponent } from './componentes/agregar-actuali-enfer/agregar-actuali-enfer.component';
import { AgregarActualiPlagaComponent } from './componentes/agregar-actuali-plaga/agregar-actuali-plaga.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    AgregarActualizarPlantComponent,
    VerPlantComponent,
    AgregarActualiFertComponent,
    AgregarActualiEnferComponent,
    AgregarActualiPlagaComponent,
    VerPlantComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    AgregarActualizarPlantComponent,
    ReactiveFormsModule,
    VerPlantComponent,
    AgregarActualiFertComponent,
    AgregarActualiEnferComponent,
    AgregarActualiPlagaComponent,
    VerPlantComponent
  ],

  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class GlobalModule { }
