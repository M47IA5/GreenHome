import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  constructor(private firebase: FirebaseService,
    private utils: UtilsService
  ) { }

  user = {} as User;

  ngOnInit() {
    this.user = this.utils.getFromLocalStorage('user');
    if (this.plantUser) this.form.setValue(this.plantUser);
  }

  form = new FormGroup({
    IDPlantaUser: new FormControl(''),
    NombrePlanta: new FormControl('', [Validators.required, Validators.minLength(2)]),
    NombrePerso: new FormControl('', [Validators.required]),
    FechaSiembra: new FormControl('', [Validators.required, Validators.minLength(2)]),
    TipoPLanta: new FormControl('', [Validators.required, Validators.minLength(2)]),
    UltimoDiaRiego: new FormControl('', [Validators.required, Validators.minLength(2)]),
    
    Temporada: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  submit() {
    if (this.form.valid) {
      if (this.plantUser) this.updatePlant();
      else this.createPlant()

    }
  }

  // setNumberInputs() {

  //   let { FechaSiembra } = this.form.controls;
  //   if (FechaSiembra.value) FechaSiembra.setValue(parseFloat(FechaSiembra.value));

  //   let { UltimoDiaRiego } = this.form.controls;
  //   if (UltimoDiaRiego.value) UltimoDiaRiego.setValue(Data(UltimoDiaRiego.value));

  // }


  async createPlant() {

    let path = `users/${this.user.UserID}/plantasUsuario`

    const loading = await this.utils.loading();
    const id = this.firebase.getId();
    this.form.value.IDPlantaUser = id;
    await loading.present();

    /*///subir imagen y obtener la url
    let dataUrl = this.form.value.FotoPlanta;
    let imagenPath = `${this.user.uid}/${Date.now()}`;
    let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    this.form.controls.FotoPlanta.setValue(imagenUrl);*/

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
    //   /*if (this.form.value.FotoPlanta !== this.Plant.FotoPlanta) {
    //     let dataUrl = this.form.value.FotoPlanta;
    //     let imagenPath = await this.firebase.getFilePath(this.Plant.FotoPlanta);
    //     let imagenUrl = await this.firebase.uploadImage(imagenPath, dataUrl);
    //     this.form.controls.FotoPlanta.setValue(imagenUrl);
    //   }*/




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
