import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Plantas } from 'src/app/modelos/Plantas.model';
import { PlantasUser } from 'src/app/modelos/PlantasUser.model';
import { User } from 'src/app/modelos/User.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-actu-agre-plant-user',
  templateUrl: './actu-agre-plant-user.component.html',
  styleUrls: ['./actu-agre-plant-user.component.scss'],
})
export class ActuAgrePlantUserComponent implements OnInit {

  @Input() plantUser!: PlantasUser
  @Input() plant!: Plantas
  constructor(private firebase: FirebaseService,
    private utils: UtilsService
  ) { }

  Plant: Plantas[] = [];
  loading: boolean = false;
  user = {} as User;

  ngOnInit() {
    this.user = this.utils.getFromLocalStorage('user');
    if (this.plantUser) this.form.setValue(this.plantUser);
  }

  form = new FormGroup({
    IDPlantaUser: new FormControl(''),
    NombrePlanta: new FormControl(''),
    NombrePerso: new FormControl('', [Validators.required]),
    FechaSiembra: new FormControl('', [Validators.required, Validators.minLength(2)]),
    TipoPLanta: new FormControl(''),
    UltimoDiaRiego: new FormControl('', [Validators.required, Validators.minLength(2)]),
    Temporada: new FormControl(''),
    FotoPlantUser: new FormControl('', [Validators.required])
  })

  submit() {
    if (this.form.valid) {
      if (this.plantUser) this.updatePlant();
      else this.createPlantUser();

    }
  }

  // setNumberInputs() {

  //   let { FechaSiembra } = this.form.controls;
  //   if (FechaSiembra.value) FechaSiembra.setValue(parseFloat(FechaSiembra.value));

  //   let { UltimoDiaRiego } = this.form.controls;
  //   if (UltimoDiaRiego.value) UltimoDiaRiego.setValue(Data(UltimoDiaRiego.value));

  // }

  async tomarImagen() {
    const dataUrl = (await this.utils.tomarFoto2()).dataUrl;
    this.form.controls.FotoPlantUser.setValue(dataUrl)
  }

  async sacaFoto() {
    const dataUrl = (await this.utils.sacarFoto()).dataUrl;
    this.form.controls.FotoPlantUser.setValue(dataUrl)
  }


  async GuardarImagen() {
    const dataUrl = (await this.utils.tomarFoto('Imagen referencial de la planta')).dataUrl;
    this.form.controls.FotoPlantUser.setValue(dataUrl)
  }

  getPlantas() {
    this.loading = true;
    let sub = this.firebase.getCollection<Plantas>('Plantas').subscribe(res => {
      console.log(res);
      this.Plant = res;

      this.loading = false;

      sub.unsubscribe();

    })

  }

  ionViewWillEnter() {
    this.getPlantas();
  }

  async createPlantUser() {

    let path = `users/${this.user.UserID}/plantasUsuario`

    const loading = await this.utils.loading();
    await loading.present();


    ///subir imagen y obtener la url
    let dataUrl = this.form.value.FotoPlantUser;
    let imagenPath = `PlantaUser/${this.user.NombreUser}/${this.user.UserID}/${Date.now()}`;
    let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    this.form.controls.FotoPlantUser.setValue(imagenUrl);



    const id = this.firebase.getId();
    this.form.value.IDPlantaUser = id;

    this.form.value.NombrePlanta = this.plant.NombrePlanta;

    this.form.value.TipoPLanta = this.plant.TipoSiembra;
    this.form.value.Temporada = this.plant.Temporada;



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

    let path = `users/${this.user.UserID}/plantasUsuario/${this.plantUser.IDPlantaUser}`
    const loading = await this.utils.loading();
    await loading.present();

    //si cambio de imagen y obtener la url
    if (this.form.value.FotoPlantUser !== this.plantUser.FotoPlantUser) {
      let dataUrl = this.form.value.FotoPlantUser;
      let imagenPath = await this.firebase.getFilePath(this.plantUser.FotoPlantUser);
      let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
      this.form.controls.FotoPlantUser.setValue(imagenUrl);
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

