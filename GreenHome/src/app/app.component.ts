import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonicModule, Platform } from '@ionic/angular';
import { FcmService } from './services/fcm/fmc.service';


register(); 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private fcm: FcmService
  ) {
    this.platform.ready().then(() => {
      this.fcm.initPush();
    }).catch(e => {
      console.log('error fcm: ', e);
    });
  }
}



