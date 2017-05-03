import firebase from 'firebase';

/**
 * Provides a service to easily interact
 * with the Firebase Authentication
 * remote service and perform login,
 * registration and logout.
 */
export class FirebaseAuthService {


  private _auth:firebase.auth.Auth;

  private _authStateChangedSubscribers:any[]=[];

  /**
   * Returns true when the user has
   * an active session with the Firebase
   * backend service.
   * @type {boolean}
   * @private
   */
  private _isUserAuthenticated:boolean=false;

  /**
   * Current session with the
   * Firebase backend, returns
   * the loggedin user object.
   */
  private _user:any;

  /**
   * Current session with the
   * Firebase backend, returns
   * the loggedin user object.
   */
  get user(): any {
    return this._user;
  }

  /**
   * Returns true when the user has
   * an active session with the Firebase
   * backend service
   * @type {boolean}
   * @private
   */
  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  subscribeAuthStateChange(callback:any):any{
    this._authStateChangedSubscribers.push(callback);
    return callback;
  }

  unscribeAuthStateChange(callback:void):void{
    let index = this._authStateChangedSubscribers.indexOf(callback);
    this._authStateChangedSubscribers.splice(index,1);
  }

  private fireAuthStateChange():void{
    for(let callback of this._authStateChangedSubscribers)
      callback();
  }

  /**
   * Initialize the Firebase service
   * with config params from Firebase
   * console, and register the
   * authentication change event to
   * notify to clients when the session
   * is created or deleted.
   */
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

    this._auth = firebase.auth();

    this._auth.onAuthStateChanged((user)=>{
      srv._user = user;
      srv._isUserAuthenticated = (user!=undefined&&user!=null);

      console.log('State change invoked on _auth, user = ' + user);

      srv.fireAuthStateChange();
    });
  }

  /**
   * Register a new account on
   * Firebase service with given
   * credentials, and authenticate
   * the user.
   * @param email
   * @param password
   * @returns {firebase.Promise<any>}
   */
  signup(email:string,password:string):firebase.Promise<any>{
    return this._auth.createUserWithEmailAndPassword(email,password);
  }

  /**
   * Log-in the user on Firebase
   * service with given credentials
   * @param email
   * @param password
   * @returns {firebase.Promise<any>}
   */
  signin(email:string,password:string):firebase.Promise<any>{
    return this._auth.signInWithEmailAndPassword(email,password);
  }

  /**
   * Closes the session with Firebase service.
   * @returns {firebase.Promise<any>}
   */
  logout():firebase.Promise<any>{
    return this._auth.signOut();
  }
}
