import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../modelos/User.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form = new FormGroup({
    UserID: new FormControl(''),
    EmailUser: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required]),
    NombreUser: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })
  constructor() { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {

       await this.firebaseSvc.updateUser(this.form.value.NombreUser);
        console.log(res);

        let uid = res.user.uid;
        this.form.controls.UserID.setValue(uid);

        this.setUserInfo(uid)

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Error al registrarse',
          duration: 2500,
          position: 'middle',
          icon: 'alert-circle-outline'

        })

      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
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

}
