import { Component, Input, OnInit, inject } from '@angular/core';
import { Plantas } from 'src/app/modelos/Plantas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { VerPlantComponent } from '../ver-plant/ver-plant.component';
import { AgregarActualizarPlantComponent } from '../agregar-actualizar-plant/agregar-actualizar-plant.component';

@Component({
  selector: 'app-pre-plant',
  templateUrl: './pre-plant.component.html',
  styleUrls: ['./pre-plant.component.scss'],
})
export class PrePlantComponent implements OnInit {

  @Input() plant!: Plantas;
  loading: boolean = false;
  Plant: Plantas[] = [];


  firebase = inject(FirebaseService);
  utils = inject(UtilsService);

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

  verPlanta(plant: Plantas) {
    this.utils.presentModal({
      component: VerPlantComponent,
      componentProps: { plant }
    })
  }

  getPlantas() {
    this.loading = true;
    let sub = this.firebase.obtdoc<Plantas>(`Plantas/${this.plant.IDPlanta}`).subscribe(res => {
      console.log(res);
      this.plant = res;
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
  async deletePlant(Plant: Plantas) {


    let path = `Plantas/${Plant.IDPlanta}`

    const loading = await this.utils.loading();
    await loading.present();


    this.firebase.deleteDocument(path).then(async res => {

      this.Plant = this.Plant.filter(p => p.IDPlanta !== Plant.IDPlanta);
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
  async confirmDeletePlant(Plant: Plantas) {
    this.utils.presentAlert({
      header: 'Eliminar Planta',
      message: 'Seguro que deseas eliminar esta planta?',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deletePlant(Plant)
          }
        }
      ]
    });
  }

}
