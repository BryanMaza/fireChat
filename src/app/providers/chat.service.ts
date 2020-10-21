import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  chats: Mensaje[] = [];
  public usuario: any = {};
  constructor(
    private afs: AngularFirestore,
    public _afAuth:AngularFireAuth
  ) {

    // Recibe los valores de la autenticacion
    this._afAuth.authState.subscribe(user => {
      console.log('estado del usuario: ',user);
      
      if (!user) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });

  }


  login(proveedor:string) {
    this._afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.usuario = {};
    this._afAuth.signOut();
  }



  cargarMensajes() {

    this.itemsCollection = this.afs.collection<Mensaje>('chats' , ref=>ref.orderBy('fecha','desc').limit(5));

    return this.itemsCollection.valueChanges().pipe(map((msj: Mensaje[]) => {
      console.log(msj);
      this.chats = msj;

      this.chats = [];
      for (let mensaje of msj){
        this.chats.unshift(mensaje);
      }
      return this.chats;
    }));

  }

  agregarMensaje(texto: string) {
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }

    return this.itemsCollection.add(mensaje);
  }
}
