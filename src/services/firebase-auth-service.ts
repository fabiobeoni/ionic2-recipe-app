import firebase from 'firebase';


export class FirebaseAuthService {

  get user(): any {
    return this._user;
  }
  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  private _isUserAuthenticated:boolean=false;
  private _user:any;

  initialize():void{
    let srv = this;

    firebase.initializeApp({
      apiKey: "AIzaSyCFN3pjOjpCOn3kYzeQzUHZXarD5g2uOW4",
      authDomain: "ionic2-recipe-app-fcb9c.firebaseapp.com",
      databaseURL: "https://ionic2-recipe-app-fcb9c.firebaseio.com",
      projectId: "ionic2-recipe-app-fcb9c",
      storageBucket: "ionic2-recipe-app-fcb9c.appspot.com",
      messagingSenderId: "178926283871"
    });


    firebase.auth().onAuthStateChanged((user)=>{
      srv._user = user;
      srv._isUserAuthenticated = (user!=undefined&&user!=null);
      srv.onAuthStateChance();
    });

    this.onInitializationCompleted();
  }

  onInitializationCompleted():void{};
  onAuthStateChance():void{};

  signup(email:string,password:string):firebase.Promise<any>{
    return firebase.auth().createUserWithEmailAndPassword(email,password);
  }

  signin(email:string,password:string):firebase.Promise<any>{
    return firebase.auth().signInWithEmailAndPassword(email,password);
  }

  logout():void{
    firebase.auth().signOut();
  }
}
