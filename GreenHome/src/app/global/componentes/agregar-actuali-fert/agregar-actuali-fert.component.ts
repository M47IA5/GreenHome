import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Fertilizantes } from 'src/app/modelos/Fertilizantes.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-actuali-fert',
  templateUrl: './agregar-actuali-fert.component.html',
  styleUrls: ['./agregar-actuali-fert.component.scss'],
})
export class AgregarActualiFertComponent  implements OnInit {

  @Input() fert!: Fertilizantes

  constructor(private firebase:FirebaseService,
              private utils:UtilsService
  ) { }

  form = new FormGroup({
    FertID: new FormControl(''),
    //FotoPlanta: new FormControl('', [Validators.required]),
    NombreFert: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DescripcionFert: new FormControl('', [Validators.required, Validators.minLength(2)]),
    ModoDeUso: new FormControl('', [Validators.required, Validators.minLength(2)]),
    FrecuenciaDias: new FormControl(null, [Validators.required, Validators.min(0)]),
  })


  ngOnInit() {
    if (this.fert) this.form.setValue(this.fert);
  }



  submit() {
    if (this.form.valid) {

      if (this.fert) this.updateFert();
      else this.createFert()

    }
  }

  setNumberInputs() {

    let { FrecuenciaDias } = this.form.controls;
    if (FrecuenciaDias.value) FrecuenciaDias.setValue(parseFloat(FrecuenciaDias.value));
  }

  //agregar fertilizante
  async createFert() { 


    let path = `Fertilizantes`

    const loading = await this.utils.loading();
    const id = this.firebase.getId();
    this.form.value.FertID = id;
    await loading.present();

    /*///subir imagen y obtener la url
    let dataUrl = this.form.value.FotoPlanta;
    let imagenPath = `${this.user.uid}/${Date.now()}`;
    let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    this.form.controls.FotoPlanta.setValue(imagenUrl);*/



    this.firebase.createDoc(this.form.value, path, id).then(async res => {

      this.utils.dismissModal({ success: true });

      this.utils.presentToast({
        message: 'Fertilizante agregado exitosamente',
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

  //actualizar fertilizante
  async updateFert() {


    let path = `Fertilizantes/${this.fert.FertID}`

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
        message: 'Fertilizante Actualizado exitosamente',
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
