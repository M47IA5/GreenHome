import { Component } from '@angular/core';
import { LoginPage } from './login/login.page';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
register(); 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.iniciarApp();
  }

  iniciarApp(){
    
  }


}
