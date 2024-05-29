import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Plagas } from 'src/app/modelos/Plagas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-actuali-plaga',
  templateUrl: './agregar-actuali-plaga.component.html',
  styleUrls: ['./agregar-actuali-plaga.component.scss'],
})
export class AgregarActualiPlagaComponent  implements OnInit {

  @Input() plag!: Plagas

  constructor(private firebase:FirebaseService,
              private utils:UtilsService
  ) { }

  form = new FormGroup({
    PlagID: new FormControl(''),
    //FotoPlanta: new FormControl('', [Validators.required]),
    NombrePlag: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DescripcionPlag: new FormControl('', [Validators.required, Validators.minLength(2)]),
    CausasPosibles: new FormControl('', [Validators.required, Validators.minLength(2)]),
    Control: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DuracionDias: new FormControl(null, [Validators.required, Validators.min(0)]),
  })


  ngOnInit() {
    if (this.plag) this.form.setValue(this.plag);
  }



  submit() {
    if (this.form.valid) {

      if (this.plag) this.updateEnfer();
      else this.createEnfer()

    }
  }

  setNumberInputs() {

    let { DuracionDias } = this.form.controls;
    if (DuracionDias.value) DuracionDias.setValue(parseFloat(DuracionDias.value));
  }

  //agregar Plagas
  async createEnfer() { 


    let path = `Plagas`

    const loading = await this.utils.loading();
    const id = this.firebase.getId();
    this.form.value.PlagID = id;
    await loading.present();

    /*///subir imagen y obtener la url
    let dataUrl = this.form.value.FotoPlanta;
    let imagenPath = `${this.user.uid}/${Date.now()}`;
    let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    this.form.controls.FotoPlanta.setValue(imagenUrl);*/



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

  //actualizar Plagas
  async updateEnfer() {


    let path = `Plagas/${this.plag.PlagID}`

    const loading = await this.utils.loading();
    await loading.present();

    //si cambio de imagen y obtener la url
    //   /*if (this.form.value.FotoPlanta !== this.Plant.FotoPlanta) {
    //     let dataUrl = this.form.value.FotoPlanta;
    //     let imagenPath = await this.firebase.getFilePath(this.Plant.FotoPlanta);
    //     let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    //     this.form.controls.FotoPlanta.setValue(imagenUrl);
    //   }*/




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

