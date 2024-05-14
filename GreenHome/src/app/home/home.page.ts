import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../modelos/User.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private firebase:FirebaseService,
              private utils:UtilsService
  ) {}

  user(): User{
    return this.utils.getFromLocalStorage('user');
  }

  cerrarSesion() {
    this.firebase.signOut();
  }

}
