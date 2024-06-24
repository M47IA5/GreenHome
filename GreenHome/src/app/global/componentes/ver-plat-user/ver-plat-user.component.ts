import { Component, Input, OnInit, inject } from '@angular/core';
import { PlantasUser } from 'src/app/modelos/PlantasUser.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActuAgrePlantUserComponent } from '../actu-agre-plant-user/actu-agre-plant-user.component';
import { User } from 'src/app/modelos/User.module';

@Component({
  selector: 'app-ver-plat-user',
  templateUrl: './ver-plat-user.component.html',
  styleUrls: ['./ver-plat-user.component.scss'],
})
export class VerPlatUserComponent implements OnInit {
  @Input() plantUser!: PlantasUser;
  PlantUSer: PlantasUser[] = [];

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);
  loading: boolean = false;

  user(): User {
    return this.utils.getFromLocalStorage('user');
  }

  ngOnInit() {

  }
  async dismissModal() {

    const loading = await this.utils.loading();
    await loading.present();
    this.utils.dismissModal({ success: true }).then(async res => {
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

  getPlantUser() {
    let user = this.user();
    this.loading = true;
    let sub = this.firebase.obtdoc<PlantasUser>(`users/${user.UserID}/plantasUsuario/${this.plantUser.IDPlantaUser}`).subscribe(res => {
      console.log(res);
      this.plantUser = res;
      this.loading = false;
      sub.unsubscribe();
    })
  }

  async addUpdatePlant(plantUser?: PlantasUser) {

    let success = await this.utils.presentModal({
      component: ActuAgrePlantUserComponent,
      componentProps: { plantUser }
    })
    if (success) this.getPlantUser();
  }


  //eliminar planta
  async deletePlant(PlantUser: PlantasUser) {

    let user = this.user();
    let path = `/users/${user.UserID}/plantasUsuario/${PlantUser.IDPlantaUser}`

    const loading = await this.utils.loading();
    await loading.present();


    this.firebase.deleteDocument(path).then(async res => {

      this.PlantUSer = this.PlantUSer.filter(p => p.IDPlantaUser !== PlantUser.IDPlantaUser);
      this.utils.dismissModal({ success: true });
      this.utils.presentToast({
        message: 'Planta Eliminada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })


    }).catch(error => {
      console.log(error);

      this.utils.presentToast(
        error.message
      )

    }).finally(() => {
      loading.dismiss();
    })

  }

  //confirmar la eliminacion de la planta
  async confirmDeletePlant(PlantUser: PlantasUser) {
    this.utils.presentAlert({
      header: 'Eliminar Planta',
      message: 'Seguro que deseas eliminar esta planta?',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deletePlant(PlantUser)
          }
        }
      ]
    });
  }

}
