import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, collection, collectionData, deleteDoc, doc, getDoc, getFirestore, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { User } from '../modelos/User.module';
import { UtilsService } from './utils.service';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  constructor(private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private utils: UtilsService
  ) { }

  getCollection<tipo>(path: string) {
    const collection = this.firestore.collection<tipo>(path);
    return collection.valueChanges();
  }

  obtdoc<tipo>(path: string) {
    const collection = this.firestore.doc<tipo>(path);
    return collection.valueChanges();
  }

  //agregar documentos
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);

  }

  createDoc(data: any, path: string, id: string) {

    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);

  }

  //obtiene la id directo de la firestore
  getId() {
    return this.firestore.createId();
  }

  //actualizar documentos
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //borrar documentos
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //guard
  getAuth() {
    return getAuth();
  }

  //iniciar sesion
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.EmailUser, user.Password);
  }

  //Registrar
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.EmailUser, user.Password);
  }

  // Actualizar usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // enviar email para restablecer contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  async verifyEmail(): Promise<void> {
    return (await this.auth.currentUser).sendEmailVerification();
  }

  // obtener usuarios por uid

  async getUid() {
    const user = await this.auth.currentUser;
    return user.uid;
  }

  //cerrar sesion
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utils.routerLink('/login')
  }

  //setear documentos/ guardar datos
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //obtener documentos
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  stateUser() {
    return this.auth.authState;
  }
  getCollectionData(path: string, colletionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...colletionQuery), { idField: 'IDPlantaUser' });
  }

  //subir la imagen
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })

  }

  //obtener ruta de la imagen
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath

  }

  //Eliminar archivos
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

}

