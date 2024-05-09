import { Component, Input, OnInit, inject } from '@angular/core';
import { Plantas } from 'src/app/modelos/Plantas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ver-plant',
  templateUrl: './ver-plant.component.html',
  styleUrls: ['./ver-plant.component.scss'],
})
export class VerPlantComponent  implements OnInit {

  @Input() plant!: Plantas;

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {

  }
  dismissModal() {
    this.utils.dismissModal()
  }
}
