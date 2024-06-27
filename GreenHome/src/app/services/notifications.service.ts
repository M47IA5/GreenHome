import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public platform: Platform,
              public router: Router
              
  ) { }



  inicializar() {

    if (this.platform.is('capacitor')){
        PushNotifications.requestPermissions().then( result => {
          console.log('PushNotifications.requestPermission()');
          if (result.receive === 'granted') {
            console.log('permisos concedidos');

            PushNotifications.register();
            this.addListener();


          } else {

          } 
        });
    } else {
      console.log('PushNotifications.requestPermission() -> no es movil');
    }
  }

  addListener() {

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        this.router.navigate(['/home']);
      }
    );

  }

}

