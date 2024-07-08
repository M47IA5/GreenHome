import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Plantas } from 'src/app/modelos/Plantas.model';
import { User } from 'src/app/modelos/User.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-actualizar-plant',
  templateUrl: './agregar-actualizar-plant.component.html',
  styleUrls: ['./agregar-actualizar-plant.component.scss'],
})
export class AgregarActualizarPlantComponent implements OnInit {

  @Input() plant!: Plantas

  form = new FormGroup({
    IDPlanta: new FormControl(''),
    FotoPlanta: new FormControl('',[Validators.required]),
    NombrePlanta: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DiasFertilizacion: new FormControl(null, [Validators.required, Validators.min(0)]),
    Temporada: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DiasGerminacion: new FormControl(null, [Validators.required, Validators.min(0)]),
    DiasTransplante: new FormControl(null, [Validators.required, Validators.min(0)]),
    DiasCrecVegetativo: new FormControl(null, [Validators.required, Validators.min(0)]),
    DiasCrecInflorecencia: new FormControl(null, [Validators.required, Validators.min(0)]),
    DiasFruto: new FormControl(null, [Validators.required, Validators.min(0)]),
    DiasCosecha: new FormControl(null, [Validators.required, Validators.min(0)]),
    TipoLuz: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DiasRiego: new FormControl(null, [Validators.required, Validators.min(0)]),
    TempMin: new FormControl('', [Validators.required, Validators.minLength(2)]),
    TempMax: new FormControl('', [Validators.required, Validators.minLength(2)]),
    DistTransplanteCm: new FormControl(null, [Validators.required, Validators.min(0)]),
    Recomendaciones: new FormControl('', [Validators.required, Validators.minLength(2)]),
    Descripcion: new FormControl('', [Validators.required, Validators.minLength(2)]),
    NombreCientifico: new FormControl('', [Validators.required, Validators.minLength(2)]),
    TipoSiembra: new FormControl('', [Validators.required, Validators.minLength(2)]),
    MonitoreoPLagas: new FormControl(null, [Validators.required, Validators.min(0)]),
  })

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {
    if (this.plant) this.form.setValue(this.plant);
  }

  user(): User {
    return this.utils.getFromLocalStorage('user');
  }

  submit() {
    if (this.form.valid) {

      if (this.plant) this.updatePlant();
      else this.createPlant()

    }
  }

  
  async tomarImagen1() {
    const dataUrl = (await this.utils.tomarFoto('Imagen referencial de la Planta')).dataUrl;
    this.form.controls.FotoPlanta.setValue(dataUrl)
  }

  async tomarImagen() {
    const dataUrl = (await this.utils.tomarFoto2()).dataUrl;
    this.form.controls.FotoPlanta.setValue(dataUrl)
  }

  async sacaFoto() {
    const dataUrl = (await this.utils.sacarFoto()).dataUrl;
    this.form.controls.FotoPlanta.setValue(dataUrl)
  }

  setNumberInputs() {

    let { DiasCosecha } = this.form.controls;
    if (DiasCosecha.value) DiasCosecha.setValue(parseFloat(DiasCosecha.value));

    let { MonitoreoPLagas } = this.form.controls;
    if (MonitoreoPLagas.value) MonitoreoPLagas.setValue(parseFloat(MonitoreoPLagas.value));

  }

  //agregar planta
  async createPlant() {

    let user = this.user();
    let path = `Plantas`

    const loading = await this.utils.loading();
    await loading.present();

    ///subir imagen y obtener la url
    let dataUrl = this.form.value.FotoPlanta;
    let imagenPath = `Plantas/${user.UserID}/${Date.now()}`;
    let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    this.form.controls.FotoPlanta.setValue(imagenUrl);

    const id = this.firebase.getId();
    this.form.value.IDPlanta = id;

    this.firebase.createDoc(this.form.value, path, id).then(async res => {

      this.utils.dismissModal({ success: true });

      this.utils.presentToast({
        message: 'PLanta agregada exitosamente',
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

  //actualizar Planta
  async updatePlant() {


    let path = `Plantas/${this.plant.IDPlanta}`

    const loading = await this.utils.loading();
    await loading.present();

    //si cambio de imagen y obtener la url
    if (this.form.value.FotoPlanta !== this.plant.FotoPlanta) {
      let dataUrl = this.form.value.FotoPlanta;
      let imagenPath = await this.firebase.getFilePath(this.plant.FotoPlanta);
      let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
      this.form.controls.FotoPlanta.setValue(imagenUrl);
    }




    this.firebase.updateDocument(path, this.form.value).then(async res => {

      this.utils.dismissModal({ success: true });

      this.utils.presentToast({
        message: 'Planta Actualizada exitosamente',
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
