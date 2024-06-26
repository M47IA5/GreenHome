import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router

  ) { }

  //cargando

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //Modal

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss()
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts
    );

    await alert.present();
  }

  // enruta a cualquier pagina disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }
  
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }


  //habilita la opcion de tomar fotos
  async tomarFoto(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto : 'sacar foto',
      promptLabelPicture: 'Toma una foto'
    });
  };

  async tomarFoto2() {
    return await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
  };

  async sacarFoto() {
    return await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
  };
  
}
