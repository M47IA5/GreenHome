import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, collection, collectionData, deleteDoc, doc, getDoc, getFirestore, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { User } from '../modelos/User.module';
import { UtilsService } from './utils.service';
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
  //agregar documentos
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);

  }

  createDoc(data: any, path: string, id:string){
    
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);

  }
  
  getId(){
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
}

