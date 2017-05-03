import firebase from "firebase";
import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Provides a service to easily interact
 * with the Firebase Storage remote service
 * and perform file upload and download.
 */
@Injectable()
export class FirebaseStorageService {

  // Create a storage reference from our storage service
  private _storageSrv:firebase.storage.Storage;

  constructor(private _http:Http){
    this._storageSrv = firebase.storage();
  }

  /**
   * Uploads a file to the Firebase Storage service.
   * While uploading, the client can use the callback
   * to be aware of upload status changes.
   * @param url
   * @param content
   * @param stateChangeCallback
   */
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

  /**
   * Downloads the given file from Firebase Storage
   * service.
   * @param url
   * @param callback
   */
  downloadFile(url:string,callback:(data:any,err:Error)=>void):void{
    let self = this;
    this._storageSrv.ref(url).getDownloadURL()
      .then(url=>{
        self._http.get(url)
          //.map((res:Response) => res.json())
          .subscribe((response:Response)=>{
              callback(response.text(),null);
            },
            err=>{callback(null,err)}
          );
      })
      .catch(err=>{callback(null,err)});
  }

}
