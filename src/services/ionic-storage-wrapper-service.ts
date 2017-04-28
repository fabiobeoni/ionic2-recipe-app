import {Injectable} from "@angular/core";
import {Storage} from '@ionic/storage';
import {AppModule} from "../app/app.module";

@Injectable()
export class IonicStorageWrapperService{

  private _storage:Storage;

  get storage(): Storage {
    return this._storage;
  }

  constructor(){
    this._storage = new Storage({name:AppModule.DB_NAME});
  }
}
