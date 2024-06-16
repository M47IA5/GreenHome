import { Component, OnInit, Input, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Enfermedades } from 'src/app/modelos/Enfermedad.model';

@Component({
  selector: 'app-ver-enf',
  templateUrl: './ver-enf.component.html',
  styleUrls: ['./ver-enf.component.scss'],
})
export class VerEnfComponent  implements OnInit {

  @Input() enfer!:Enfermedades;

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {}

  dismissModal() {
    this.utils.dismissModal()
  }

}
