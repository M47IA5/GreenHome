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

  constructor(private firebase: FirebaseService,
    private utils: UtilsService,
    private navCtrl: NavController
  ) { }

  alertButtons = ['Regar plantita'];
  plantUser: PlantasUser[] = [];
  Plant: Plantas[] = [];
  loading: boolean = false;
  goToPlantas() {
    this.navCtrl.navigateForward('/plantas');
  }

  goToConsejos() {
    this.navCtrl.navigateForward('/consejos');
  }

  goToHome() {
    this.navCtrl.navigateBack('/home');
  }
  user(): User {
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
    this.recordarFechaImportante()
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

  verificarRiego(UltimoDiaRiego) {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    let anio = fecha.getFullYear();
    let fechaActual = new Date(anio, mes, dia);
    let fechaRiego = new Date(UltimoDiaRiego);
    let diferencia = fechaActual.getTime() - fechaRiego.getTime();
    let dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    if (dias >= 3) {
      return true;
    } else {
      return false;
    }
  }
  presentarRiego(plantID: string) {
    this.utils.presentAlert({
      header: 'Tu plantita tiene sed 💧',
      message: '¿Desea regar su planta?',
      buttons: [
        {
          text: 'Si 👍',
          handler: () => {
            this.updateRiegoPlanta(plantID)
          }
        }, {
          text: 'No 👎',
        }
      ]
    });
  };

  updateRiegoPlanta(plantID: string) {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    let anio = fecha.getFullYear();
    let fechaActual = new Date(anio, mes, dia);
    let fechaRiego = fechaActual.toISOString().split('T')[0];

    let user = this.user();
    let path = `/users/${user.UserID}/plantasUsuario/${plantID}`;
  
    const updateData = {
      UltimoDiaRiego: fechaRiego
    };
  
    this.firebase.updateDocument(path, updateData).then(() => {
      console.log('💧 Se ha regado la planta! 💧');
      this.getPlantUser();
      this.PlantaRegada();
    }).catch(error => {
      console.error('No se pudo regar la planta:', error);
    });
  }

  PlantaRegada() {
    this.utils.presentAlert({
      header: 'Tu plantita ya no tiene sed 💧',
      message: 'Su planta fue regada con éxito',
      buttons: [
        {
          text: 'Aceptar',
        }
      ]
    });
  };

   diasDesdePlantacion(FechaPlantacion){
     let fecha = new Date();
     let dia = fecha.getDate();
     let mes = fecha.getMonth();
     let anio = fecha.getFullYear();
     let fechaActual = new Date(anio, mes, dia);
     let fechaPlantacion = new Date(FechaPlantacion);
     let dias = fechaActual.getTime() - fechaPlantacion.getTime();
     let diasDesdePlantacion = Math.ceil(dias / (1000 * 3600 * 24))
     return diasDesdePlantacion;
   }

  getPlantaByNombre(nombrePlanta: string): Plantas | undefined {
    return this.Plant.find(planta => planta.NombrePlanta === nombrePlanta);
  }
  recordarFechaImportante(){
    console.log("Revisando fechas importantes")
     var PU : PlantasUser
    for (var pb of this.plantUser){

      let plant = this.getPlantaByNombre(pb.NombrePlanta);
      let diasDesdePlantacion = this.diasDesdePlantacion(pb.FechaSiembra)
      console.log("Nombre de la planta a revisar:"+ pb.NombrePerso)
      console.log("Dias desde plantacion: " + diasDesdePlantacion)
      if(diasDesdePlantacion == plant.DiasGerminacion){
        console.log("La planta esta germinando")
        this.utils.presentAlert({
          header: '¡Recordatorio!',
          message: '¡Tu planta '+ pb.NombrePerso +' debería estar pasando por su fase de germinación!',
          buttons: [
            {
              text: 'Aceptar👍',
              }
            ]
          })
        }

        if(diasDesdePlantacion == plant.DiasCosecha){
          console.log("La planta esta germinando")
          this.utils.presentAlert({
            header: '¡Recordatorio!',
            message: '¡Tu planta '+ pb.NombrePerso +' debería estar lista para su cosecha!',
            buttons: [
              {
                text: 'Aceptar👍',
                }
              ]
            })
          }
    }
      
    }

    unaNuevaPlanta(){
      this.goToPlantas()
      this.utils.presentAlert({
        header: '🌱Seleccione una planta del catalogo🌱',
        message: 'Para agregar una planta a su Huerta',
        buttons: [
          {
            text: 'OK👍',
          }
        ]
      });
    }
  }


 








