import firebase from 'firebase';

/**
 * Provides a service to easily interact
 * with the Firebase Authentication
 * remote service and perform login,
 * registration and logout.
 */
export class FirebaseAuthService {

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
   * backend service.
   * @type {boolean}
   * @private
   */
  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
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


    firebase.auth().onAuthStateChanged((user)=>{
      srv._user = user;
      srv._isUserAuthenticated = (user!=undefined&&user!=null);
      srv.onAuthStateChance();
    });

    this.onInitializationCompleted();
  }

  /**
   * Invoked when Firebase initialization
   * is completed. The client of this service
   * can attach an handler to this get
   * notified.
   */
  onInitializationCompleted():void{};

  /**
   * Invoked when Firebase session
   * state changes. The client of this service
   * can attach an handler to this get
   * notified.
   */
  onAuthStateChance():void{};

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
    return firebase.auth().createUserWithEmailAndPassword(email,password);
  }

  /**
   * Log-in the user on Firebase
   * service with given credentials
   * @param email
   * @param password
   * @returns {firebase.Promise<any>}
   */
  signin(email:string,password:string):firebase.Promise<any>{
    return firebase.auth().signInWithEmailAndPassword(email,password);
  }

  /**
   * Closes the session with Firebase service.
   */
  logout():void{
    firebase.auth().signOut();
  }
}
