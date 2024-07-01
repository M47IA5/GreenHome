import { Component, OnInit } from "@angular/core";
import { Fertilizantes } from "../modelos/Fertilizantes.model";
import { FirebaseService } from "../services/firebase.service";
import { UtilsService } from "../services/utils.service";
import { User } from "../modelos/User.module";
import { Enfermedades } from "../modelos/Enfermedad.model";
import { Plagas } from "../modelos/Plagas.model";
import { AgregarActualiFertComponent } from "../global/componentes/agregar-actuali-fert/agregar-actuali-fert.component";
import { AgregarActualiPlagaComponent } from "../global/componentes/agregar-actuali-plaga/agregar-actuali-plaga.component";
import { AgregarActualiEnferComponent } from "../global/componentes/agregar-actuali-enfer/agregar-actuali-enfer.component";
import { VerEnfComponent } from "../global/componentes/ver-enf/ver-enf.component";
import { VerFertComponent } from "../global/componentes/ver-fert/ver-fert.component";
import { VerPlagComponent } from "../global/componentes/ver-plag/ver-plag.component";
import { NavController } from '@ionic/angular';
@Component({
  selector: "app-consejos",
  templateUrl: "./consejos.page.html",
  styleUrls: ["./consejos.page.scss"],
})
export class ConsejosPage implements OnInit {
  constructor(private firebase: FirebaseService, private utils: UtilsService, private navCtrl: NavController) { }

  ngOnInit() {

    this.user = this.utils.getFromLocalStorage('user');

  }

  fert: Fertilizantes[] = [];
  enfer: Enfermedades[] = [];
  plag: Plagas[] = [];
  loading: boolean = false;
  user = {} as User;
  adm = 'Q8FUObsjYzfeodZVclySit2MLxq2';
  adm2 = 'nGC5I2396wgDeWAbDfCyJCn5ep43';
  adm3 = '0FLe7KzUchdO5Fb6hioXBE4ra622';
  admin: boolean = false;

  yass: boolean = false;
  fertsa = 'Fertilizante';

  ionViewWillEnter() {
    this.getFert();
    this.getEnfer();
    this.getPlag();
    this.Administrador();
  }

  // diferencia(){
  //   if (this.fertsa === this.fert.){
  //     this.yass = true

  //   } else {
  //     this.yass = false
  //   }

  // }

  Administrador() {
    if (this.user.UserID === this.adm) {
      this.admin = true
    }
    else if (this.user.UserID === this.adm2) {
      this.admin = true
    }
    else if (this.user.UserID === this.adm3) {
      this.admin = true
    } else {
      this.admin = false;
    };
  };


  goToPlantas() {
    this.navCtrl.navigateForward('/plantas');
  }

  goToConsejos() {
    this.navCtrl.navigateForward('/consejos');
  }

  goToHome() {
    this.navCtrl.navigateBack('/home');
  }

  //obtener Fertilizantes
  getFert() {
    this.loading = true;
    let sub = this.firebase
      .getCollection<Fertilizantes>("Fertilizantes")
      .subscribe((res) => {
        console.log(res);
        this.fert = res;

        this.loading = false;

        sub.unsubscribe();
      });
  }

  //obtener Enfermedades

  getEnfer() {
    this.loading = true;
    let sub = this.firebase
      .getCollection<Enfermedades>("Enfermedades")
      .subscribe((res) => {
        console.log(res);
        this.enfer = res;

        this.loading = false;

        sub.unsubscribe();
      });
  }

  //obtener Plagas

  getPlag() {
    this.loading = true;
    let sub = this.firebase.getCollection<Plagas>("Plagas").subscribe((res) => {
      console.log(res);
      this.plag = res;

      this.loading = false;

      sub.unsubscribe();
    });
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

  //Actualizar y agregar fertilizantes

  async addUpdateFert(fert?: Fertilizantes) {

    let success = await this.utils.presentModal({
      component: AgregarActualiFertComponent,
      componentProps: { fert },
    });

    if (success) this.getFert();
  }

  //Actualizar y agregar enfermedades

  async addUpdateEnfer(enfer?: Enfermedades) {

    let success = await this.utils.presentModal({
      component: AgregarActualiEnferComponent,
      componentProps: { enfer },
    });

    if (success) this.getEnfer();
  }

  //Actualizar y agregar plagas

  async addUpdatePlaga(plag?: Plagas) {

    let success = await this.utils.presentModal({
      component: AgregarActualiPlagaComponent,
      componentProps: { plag },
    });

    if (success) this.getPlag();
  }

  //eliminar fertilizantes
  async deleteFert(fert: Fertilizantes) {
    let path = `Fertilizantes/${fert.FertID}`;

    const loading = await this.utils.loading();
    await loading.present();

    this.firebase
      .deleteDocument(path)
      .then(async (res) => {
        this.fert = this.fert.filter((f) => f.FertID !== fert.FertID);

        this.utils.presentToast({
          message: "Fertilizante Eliminado exitosamente",
          duration: 1500,
          color: "success",
          position: "middle",
          icon: "checkmark-circle-outline",
        });
      })
      .catch((error) => {
        console.log(error);

        this.utils.presentToast(error.message);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  //confirmar la eliminacion del fertilizante
  async confirmDeleteFert(fert: Fertilizantes) {
    this.utils.presentAlert({
      header: "Eliminar Fertilizante",
      message: "Seguro que deseas eliminar este Fertilizante?",
      buttons: [
        {
          text: "Cancelar",
        },
        {
          text: "Si, eliminar",
          handler: () => {
            this.deleteFert(fert);
          },
        },
      ],
    });
  }

  //ver detalle fertilizantes

  verFert(fert: Fertilizantes) {
    this.utils.presentModal({
      component: VerFertComponent,
      componentProps: { fert },
    });
  }

  //ver detalle enfermedades

  verEnf(enfer: Enfermedades) {
    this.utils.presentModal({
      component: VerEnfComponent,
      componentProps: { enfer },
    });
  }

  //ver detalle plagas

  verPlag(plag: Plagas) {
    this.utils.presentModal({
      component: VerPlagComponent,
      componentProps: { plag },
    });
  }


  //eliminar enfermedades
  async deleteEnfer(enfer: Enfermedades) {
    let path = `Enfermedades/${enfer.EnferID}`;

    const loading = await this.utils.loading();
    await loading.present();

    this.firebase
      .deleteDocument(path)
      .then(async (res) => {
        this.enfer = this.enfer.filter((e) => e.EnferID !== enfer.EnferID);

        this.utils.presentToast({
          message: "Enfermedades Eliminado exitosamente",
          duration: 1500,
          color: "success",
          position: "middle",
          icon: "checkmark-circle-outline",
        });
      })
      .catch((error) => {
        console.log(error);

        this.utils.presentToast(error.message);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  //confirmar la eliminacion del enfermedades
  async confirmDeleteEnfer(enfer: Enfermedades) {
    this.utils.presentAlert({
      header: "Eliminar Fertilizante",
      message: "Seguro que deseas eliminar este Fertilizante?",
      buttons: [
        {
          text: "Cancelar",
        },
        {
          text: "Si, eliminar",
          handler: () => {
            this.deleteEnfer(enfer);
          },
        },
      ],
    });
  }

  //eliminar Plagas
  async deletePlag(plag: Plagas) {
    let path = `Plagas/${plag.PlagID}`;

    const loading = await this.utils.loading();
    await loading.present();

    this.firebase
      .deleteDocument(path)
      .then(async (res) => {
        this.plag = this.plag.filter((p) => p.PlagID !== plag.PlagID);

        this.utils.presentToast({
          message: "Plaga Eliminada exitosamente",
          duration: 1500,
          color: "success",
          position: "middle",
          icon: "checkmark-circle-outline",
        });
      })
      .catch((error) => {
        console.log(error);

        this.utils.presentToast(error.message);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  //confirmar la eliminacion del plagas
  async confirmDeletePlag(plag: Plagas) {
    this.utils.presentAlert({
      header: "Eliminar Plaga",
      message: "Seguro que deseas eliminar esta Plaga?",
      buttons: [
        {
          text: "Cancelar",
        },
        {
          text: "Si, eliminar",
          handler: () => {
            this.deletePlag(plag);
          },
        },
      ],
    });
  }
}
