import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Enfermedades } from 'src/app/modelos/Enfermedad.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-actuali-enfer',
  templateUrl: './agregar-actuali-enfer.component.html',
  styleUrls: ['./agregar-actuali-enfer.component.scss'],
})
export class AgregarActualiEnferComponent  implements OnInit {

  @Input() enfer!: Enfermedades

  constructor(private firebase:FirebaseService,
              private utils:UtilsService
  ) { }

  form = new FormGroup({
    EnferID: new FormControl(''),
    //FotoPlanta: new FormControl('', [Validators.required]),
    NombreEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DescripcionEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    CausasEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    ControlEnfer: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DuracionEnfer: new FormControl(null, [Validators.required, Validators.min(0)]),
  })


  ngOnInit() {
    if (this.enfer) this.form.setValue(this.enfer);
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

  //agregar Enfermedades
  async createEnfer() { 


    let path = `Enfermedades`

    const loading = await this.utils.loading();
    const id = this.firebase.getId();
    this.form.value.EnferID = id;
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

  //actualizar Enfermedades
  async updateEnfer() {


    let path = `Enfermedades/${this.enfer.EnferID}`

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
