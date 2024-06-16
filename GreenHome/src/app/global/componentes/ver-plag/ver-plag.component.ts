import { Component, OnInit, Input, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Plagas } from 'src/app/modelos/Plagas.model';

@Component({
  selector: 'app-ver-plag',
  templateUrl: './ver-plag.component.html',
  styleUrls: ['./ver-plag.component.scss'],
})
export class VerPlagComponent  implements OnInit {

  @Input() plag!:Plagas;

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);


  ngOnInit() {}

  dismissModal() {
    this.utils.dismissModal()
  }
}
