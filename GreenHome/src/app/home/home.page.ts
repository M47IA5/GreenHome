import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../modelos/User.module';
import { PlantasUser } from '../modelos/PlantasUser.model';
import { ActuAgrePlantUserComponent } from '../global/componentes/actu-agre-plant-user/actu-agre-plant-user.component';
import { Plantas } from '../modelos/Plantas.model';
import { VerPlatUserComponent } from '../global/componentes/ver-plat-user/ver-plat-user.component';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private firebase:FirebaseService,
              private utils:UtilsService,
              private navCtrl: NavController
  ) {}


  plantUser: PlantasUser[] = [];
  Plant: Plantas[] = [];
  loading: boolean = false;

  goToPlantas(){
    this.navCtrl.navigateForward('/plantas');
  }

  goToConsejos(){
    this.navCtrl.navigateForward('/consejos');
  }

  goToHome(){
    this.navCtrl.navigateBack('/home');
  }
  user(): User{
    return this.utils.getFromLocalStorage('user');
  }

  cerrarSesion() {
    this.firebase.signOut();
  }

  confirmCerrarsesion() {
    this.utils.presentAlert({
      header: '👋 Cerrar Sesión',
      message: '¿Deseas Cerrar Sesión?',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Salir',
          handler: () => {
            this.cerrarSesion()
          }
        }
      ]
    });
  };

  ionViewWillEnter() {
    this.getPlantUser();
    this.getPlantas();
  }

  //obtener plantas
  getPlantas() {
    this.loading = true;
    let sub = this.firebase.getCollection<Plantas>('Plantas').subscribe(res => {
      console.log(res);
      this.Plant = res;

      this.loading = false;

      sub.unsubscribe();

    })

  }

  getPlantUser() {
    let user = this.user();
    let path = `/users/${user.UserID}/plantasUsuario`;

    this.loading = true;

    let query = [
      //orderBy('precio', 'desc'),
      //where('precio', '>',5000)
    ]

    let sub = this.firebase.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.plantUser = res;

        this.loading = false;

        sub.unsubscribe();
      }
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
  async deletePlant(plantUser: PlantasUser) {

    let user = this.user();
    let path = `/users/${user.UserID}/plantasUsuario/${plantUser.IDPlantaUser}`

    const loading = await this.utils.loading();
    await loading.present();


    this.firebase.deleteDocument(path).then(async res => {

      this.Plant = this.Plant.filter(p => p.IDPlanta !== plantUser.IDPlantaUser);

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
    async confirmDeletePlant(plantUser: PlantasUser) {
      this.utils.presentAlert({
        header: 'Eliminar Planta',
        message: 'Seguro que deseas eliminar esta planta?',
        buttons: [
          {
            text: 'Cancelar',
          }, {
            text: 'Si, eliminar',
            handler: () => {
              this.deletePlant(plantUser)
            }
          }
        ]
      });
    }

    async prePlanta(plantUser: PlantasUser) {
      let success = await this.utils.presentModal({
        component: VerPlatUserComponent,
        componentProps: { plantUser }
      })
      if (success) this.getPlantUser();
    }

}

