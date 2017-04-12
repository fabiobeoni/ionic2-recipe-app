import firebase from 'firebase';

export class AuthService{
  signup(email:string,password:string):any{
    return firebase.auth().createUserWithEmailAndPassword(email,password);
  }
}
