import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-contra-olvidada',
  templateUrl: './contra-olvidada.component.html',
  styleUrls: ['./contra-olvidada.component.scss'],
})
export class ContraOlvidadaComponent  implements OnInit {


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

  })

  constructor(private fireBase: FirebaseService,
              private utils: UtilsService
  ){}

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utils.loading();
      await loading.present();

      this.fireBase.sendRecoveryEmail(this.form.value.email).then(res => {

        this.utils.presentToast({
          message: 'Correo enviado con exito',
          duration: 1500,
          position: 'middle',
          icon: 'mail-outline'

        });

        this.utils.dismissModal({ success: true });
        this.form.reset();

      }).catch(error => {
        console.log(error);

        this.utils.presentToast({
          message: error.message,
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
