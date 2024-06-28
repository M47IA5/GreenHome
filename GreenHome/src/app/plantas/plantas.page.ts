import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Plantas } from '../modelos/Plantas.model';
import { VerPlantComponent } from '../global/componentes/ver-plant/ver-plant.component';
import { AgregarActualizarPlantComponent } from '../global/componentes/agregar-actualizar-plant/agregar-actualizar-plant.component';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';
import { PrePlantComponent } from '../global/componentes/pre-plant/pre-plant.component';
import { NavController } from '@ionic/angular';
import { User } from '../modelos/User.module';
register(); 
@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.page.html',
  styleUrls: ['./plantas.page.scss'],
})
export class PlantasPage {

  constructor(private utils: UtilsService,
    private firebase: FirebaseService,
    private navCtrl: NavController
  ) { }

  
  Plant: Plantas[] = [];
  loading: boolean = false;


  adm= 'Q8FUObsjYzfeodZVclySit2MLxq2'; 
  adm2= 'nGC5I2396wgDeWAbDfCyJCn5ep43';
  adm3= '0FLe7KzUchdO5Fb6hioXBE4ra622';
  admin: boolean = false;
  user = {} as User;

  ionViewWillEnter() {
    this.getPlantas();
    this.Administrador();
  }

  ngOnInit() {

    this.user = this.utils.getFromLocalStorage('user');

  }

  Administrador(){
    if(this.user.UserID === this.adm) {
      this.admin = true
    }
    else if(this.user.UserID === this.adm2) {
      this.admin = true
    }
    else if(this.user.UserID === this.adm3) {
      this.admin = true
    } else {
      this.admin = false;
    };    
  };
 
  goToPlantas(){
    this.navCtrl.navigateForward('/plantas');
  }

  goToConsejos(){
    this.navCtrl.navigateForward('/consejos');
  }

  goToHome(){
    this.navCtrl.navigateBack('/home');
  }
  doRefresh(event) { 
    setTimeout(() => {
      this.getPlantas();
      event.target.complete();
    }, 1000);
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

  async addUpdatePlant(plant?: Plantas) {

    let success = await this.utils.presentModal({
      component: AgregarActualizarPlantComponent,
      componentProps: { plant }
    })
    if (success) this.getPlantas();
  }

  //eliminar planta
  async deletePlant(plant: Plantas) {


    let path = `Plantas/${plant.IDPlanta}`

    const loading = await this.utils.loading();
    await loading.present();


    this.firebase.deleteDocument(path).then(async res => {

      this.Plant = this.Plant.filter(p => p.IDPlanta !== plant.IDPlanta);

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
  async confirmDeletePlant(plant: Plantas) {
    this.utils.presentAlert({
      header: 'Eliminar Planta',
      message: 'Seguro que deseas eliminar esta planta?',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deletePlant(plant)
          }
        }
      ]
    });
  }

  verPlanta(plant: Plantas) {
    this.utils.presentModal({
      component: VerPlantComponent,
      componentProps: { plant }
    })
  }

  async prePlanta(plant: Plantas) {
    let success = await this.utils.presentModal({
      component: PrePlantComponent,
      componentProps: { plant }
    })
    if (success) this.getPlantas();
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
}
