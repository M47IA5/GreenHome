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
import { VerEnfComponent } from './componentes/ver-enf/ver-enf.component';
import { VerFertComponent } from './componentes/ver-fert/ver-fert.component';
import { VerPlagComponent } from './componentes/ver-plag/ver-plag.component';
import { ActuAgrePlantUserComponent } from './componentes/actu-agre-plant-user/actu-agre-plant-user.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    AgregarActualizarPlantComponent,
    VerPlantComponent,
    AgregarActualiFertComponent,
    AgregarActualiEnferComponent,
    AgregarActualiPlagaComponent,
    VerPlantComponent,
    VerEnfComponent,
    VerFertComponent,
    VerPlagComponent,
    ActuAgrePlantUserComponent
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
    VerPlantComponent,
    VerEnfComponent,
    VerFertComponent,
    VerPlagComponent,
    ActuAgrePlantUserComponent
  ],

  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class GlobalModule { }
