import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../modelos/User.module';
import { ContraOlvidadaComponent } from '../global/componentes/contra-olvidada/contra-olvidada.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  form = new FormGroup({
    EmailUser: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        

        this.getUserInfo(res.user.uid)

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Error al iniciar sesión',
          duration: 2500,
          position: 'middle',
          icon: 'alert-circle-outline'

        })

      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  async setUserInfo(UserID: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${UserID}`;
      delete this.form.value.Password;

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', this.form.value);
      this.utilsSvc.routerLink('/home');
      this.form.reset();


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Error al iniciar sesión',
          duration: 2500,
          position: 'middle',
          icon: 'alert-circle-outline'

        })

      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  async getUserInfo(UserID: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${UserID}`;
      

      this.firebaseSvc.getDocument(path).then((user: User) => {

      this.utilsSvc.saveInLocalStorage('user', user);
      this.utilsSvc.routerLink('/home');
      this.form.reset();

      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.NombreUser}`,
        duration: 1500,
        position: 'middle',
        icon: 'person-circle-outline'

      })


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Ocurrio un error',
          duration: 2500,
          position: 'middle',
          icon: 'alert-circle-outline'

        })

      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  async olvidoContra() {
    let success = await this.utilsSvc.presentModal({
      component: ContraOlvidadaComponent
    })
    if (success) this.utilsSvc.dismissModal()
  }
}
