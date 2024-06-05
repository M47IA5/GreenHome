import { Component, OnInit, Input, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Fertilizante } from 'src/app/modelos/Fertilizante.model';

@Component({
  selector: 'app-ver-fert',
  templateUrl: './ver-fert.component.html',
  styleUrls: ['./ver-fert.component.scss'],
})
export class VerFertComponent  implements OnInit {

  @Input() fert!:Fertilizante;

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {}

  dismissModal() {
    this.utils.dismissModal()
  }
}
