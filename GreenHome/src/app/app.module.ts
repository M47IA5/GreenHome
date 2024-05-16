import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';

import { environment } from 'src/environments/environment';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AgregarActualizarPlantComponent } from './global/componentes/agregar-actualizar-plant/agregar-actualizar-plant.component';
import { VerPlantComponent } from './global/componentes/ver-plant/ver-plant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from './global/componentes/custom-input/custom-input.component';
import { HeaderComponent } from './global/componentes/header/header.component';
import { PrePlantComponent } from './global/componentes/pre-plant/pre-plant.component';

@NgModule({
  declarations: [AppComponent, AgregarActualizarPlantComponent , VerPlantComponent, 
                CustomInputComponent, HeaderComponent, PrePlantComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFireAuthModule,
            AngularFirestoreModule,
            ReactiveFormsModule,
            FormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
