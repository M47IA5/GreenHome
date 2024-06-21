import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Enfermedades } from 'src/app/modelos/Enfermedad.model';
import { User } from 'src/app/modelos/User.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-actuali-enfer',
  templateUrl: './agregar-actuali-enfer.component.html',
  styleUrls: ['./agregar-actuali-enfer.component.scss'],
})
export class AgregarActualiEnferComponent implements OnInit {

  @Input() enfer!: Enfermedades

  constructor(private firebase: FirebaseService,
    private utils: UtilsService
  ) { }

  form = new FormGroup({
    EnferID: new FormControl(''),
    FotoEnfer: new FormControl('', [Validators.required]),
    NombreEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DescripcionEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    CausasEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    ControlEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DuracionEnfer: new FormControl(null, [Validators.required, Validators.min(0)]),
  })

  user = {} as User;

  ngOnInit() {

    this.user = this.utils.getFromLocalStorage('user')

    if (this.enfer) this.form.setValue(this.enfer);
  }

  async tomarImagen() {
    const dataUrl = (await this.utils.tomarFoto('Imagen referencial de la Plaga')).dataUrl;
    this.form.controls.FotoEnfer.setValue(dataUrl)
  }



  submit() {
    if (this.form.valid) {

      if (this.enfer) this.updateEnfer();
      else this.createEnfer()

    }
  }

  setNumberInputs() {

    let { DuracionEnfer } = this.form.controls;
    if (DuracionEnfer.value) DuracionEnfer.setValue(parseFloat(DuracionEnfer.value));
  }

  //agregar Enfermedad
  async createEnfer() {


    let path = `Enfermedades`

    const loading = await this.utils.loading();
    await loading.present();

    ///subir imagen y obtener la url
    let dataUrl = this.form.value.FotoEnfer;
    let imagenPath = `Enfermedades/${this.user.UserID}/${Date.now()}`;
    let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    this.form.controls.FotoEnfer.setValue(imagenUrl);

    const id = this.firebase.getId();
    this.form.value.EnferID = id;

    this.firebase.createDoc(this.form.value, path, id).then(async res => {

      this.utils.dismissModal({ success: true });

      this.utils.presentToast({
        message: 'Enfermedad agregada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'

      })


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

  //actualizar Enfermedad
  async updateEnfer() {


    let path = `Enfermedades/${this.enfer.EnferID}`

    const loading = await this.utils.loading();
    await loading.present();

    //si cambio de imagen y obtener la url
    if (this.form.value.FotoEnfer !== this.enfer.FotoEnfer) {
      let dataUrl = this.form.value.FotoEnfer;
      let imagenPath = await this.firebase.getFilePath(this.enfer.FotoEnfer);
      let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
      this.form.controls.FotoEnfer.setValue(imagenUrl);
    }




    this.firebase.updateDocument(path, this.form.value).then(async res => {

      this.utils.dismissModal({ success: true });

      this.utils.presentToast({
        message: 'Enfermedad Actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'

      })


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
