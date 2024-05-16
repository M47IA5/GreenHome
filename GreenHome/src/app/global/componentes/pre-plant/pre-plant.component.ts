import { Component, Input, OnInit, inject } from '@angular/core';
import { Plantas } from 'src/app/modelos/Plantas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { VerPlantComponent } from '../ver-plant/ver-plant.component';

@Component({
  selector: 'app-pre-plant',
  templateUrl: './pre-plant.component.html',
  styleUrls: ['./pre-plant.component.scss'],
})
export class PrePlantComponent  implements OnInit {

  @Input() plant!: Plantas;

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {

  }
  dismissModal() {
    this.utils.dismissModal()
  }
  verPlanta(plant: Plantas) {
    this.utils.presentModal({
      component: VerPlantComponent,
      componentProps: { plant }
    })
  }
}
