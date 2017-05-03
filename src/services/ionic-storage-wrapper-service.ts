import {Injectable} from "@angular/core";
import {Storage} from '@ionic/storage';
import {AppModule} from "../app/app.module";

/**
 * This is a utility class to have a
 * single initialization of the Ionic
 * Storage in the project.
 * TODO// replace with standard Ionic Storage initialization as soon as the bug in the lib is fixed
 */
@Injectable()
export class IonicStorageWrapperService{

  private _storage:Storage;

  /**
   * Returns the initialized instance of
   * the Ionic Stoage service.
   * @returns {Storage}
   */
  get storage(): Storage {
    return this._storage;
  }

  constructor(){
    this._storage = new Storage({name:AppModule.DB_NAME});
  }
}
