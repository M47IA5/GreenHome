import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Plantas } from '../modelos/Plantas.model';
import { VerPlantComponent } from '../global/componentes/ver-plant/ver-plant.component';
import { AgregarActualizarPlantComponent } from '../global/componentes/agregar-actualizar-plant/agregar-actualizar-plant.component';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';
register(); 
@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.page.html',
  styleUrls: ['./plantas.page.scss'],
})
export class PlantasPage {

  constructor(private utils: UtilsService,
    private firebase: FirebaseService
  ) { }

  
  Plant: Plantas[] = [];
  loading: boolean = false;

  ionViewWillEnter() {
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

  // agregarActualizarPlant(plant: Plantas) {
  //   this.utils.presentModal({
  //     component: AgregarActualizarPlantComponent,
  //     componentProps: { plant }
  //   })
  // }



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
}
