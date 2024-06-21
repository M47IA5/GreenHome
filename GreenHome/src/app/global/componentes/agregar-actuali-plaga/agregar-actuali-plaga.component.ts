import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Plagas } from 'src/app/modelos/Plagas.model';
import { User } from 'src/app/modelos/User.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-actuali-plaga',
  templateUrl: './agregar-actuali-plaga.component.html',
  styleUrls: ['./agregar-actuali-plaga.component.scss'],
})
export class AgregarActualiPlagaComponent implements OnInit {

  @Input() plag!: Plagas

  constructor(private firebase: FirebaseService,
    private utils: UtilsService
  ) { }

  form = new FormGroup({
    PlagID: new FormControl(''),
    FotoPlag: new FormControl('',[Validators.required]),
    NombrePlag: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DescripcionPlag: new FormControl('', [Validators.required, Validators.minLength(2)]),
    CausasPosibles: new FormControl('', [Validators.required, Validators.minLength(2)]),
    Control: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DuracionDias: new FormControl(null, [Validators.required, Validators.min(0)])
  })

  user = {} as User;

  ngOnInit() {
    this.user = this.utils.getFromLocalStorage('user')
    if (this.plag) this.form.setValue(this.plag);
  }

  async tomarImagen() {
    const dataUrl = (await this.utils.tomarFoto('Imagen referencial de la Plaga')).dataUrl;
    this.form.controls.FotoPlag.setValue(dataUrl)
  }

  submit() {
    if (this.form.valid) {

      if (this.plag) this.updatePlag();
      else this.createPlag()

    }
  }

  setNumberInputs() {

    let { DuracionDias } = this.form.controls;
    if (DuracionDias.value) DuracionDias.setValue(parseFloat(DuracionDias.value));
  }

  //agregar Plaga
  async createPlag() {

    let path = `Plagas`

    const loading = await this.utils.loading();
    await loading.present();

    //subir imagen y obtener la url
    let dataUrl = this.form.value.FotoPlag;
    let imagenPath = `Plagas/${this.user.UserID}/${Date.now()}`;
    let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    this.form.controls.FotoPlag.setValue(imagenUrl);

    const id = this.firebase.getId();
    this.form.value.PlagID = id;

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

  //actualizar Plaga
  async updatePlag() {

    let path = `Plagas/${this.plag.PlagID}`

    const loading = await this.utils.loading();
    await loading.present();

    //si cambio de imagen y obtener la url
    if (this.form.value.FotoPlag !== this.plag.FotoPlag) {
      let dataUrl = this.form.value.FotoPlag;
      let imagenPath = await this.firebase.getFilePath(this.plag.FotoPlag);
      let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
      this.form.controls.FotoPlag.setValue(imagenUrl);
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

