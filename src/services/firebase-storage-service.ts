import firebase from "firebase";
import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FirebaseStorageService {

  private // Create a storage reference from our storage service
  private _storageSrv:firebase.storage.Storage;

  constructor(private _http:Http){
    this._storageSrv = firebase.storage();
  }

  uploadFile(
    url:string,
    content:string,
    stateChangeCallback:(progress:number,state:string,snapshotUrl:string,error:firebase.FirebaseError)=>void
  ):
  void{
    let uploadTask:firebase.storage.UploadTask = this._storageSrv.ref(url).putString(content);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot)=>{
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        stateChangeCallback(progress,snapshot.state,null,null);
      },
      (error:firebase.FirebaseError)=>{
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        stateChangeCallback(0,null,null,error);
      },
      ()=>{
        // Upload completed successfully, now we can get the download URL
        stateChangeCallback(100,null,uploadTask.snapshot.downloadURL,null);
      });
  }

  downloadFile(url:string,callback:(json:any,err:Error)=>void):void{
    let self = this;
    this._storageSrv.ref(url).getDownloadURL()
      .then(url=>{
        self._http.get(url)
          .map((res:Response) => res.json())
          .subscribe(
            data=>{
              callback(data,null);
            },
            err=>{callback(null,err)}
          );
      })
      .catch(err=>{callback(null,err)});
  }

}
