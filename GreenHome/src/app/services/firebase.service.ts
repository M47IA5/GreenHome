import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, collection, collectionData, deleteDoc, doc, getFirestore, query, updateDoc } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  
  constructor(private firestore: AngularFirestore) { }

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
}

