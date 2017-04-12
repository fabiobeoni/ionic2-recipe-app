import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth-service";


/*
  This page shows a different approach to
  validating input data. Uses angular only,
  instead of model validation we have for
  recipe. The code behind works directly
  with the form submitted instead of
  the model class.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  constructor(private authSrv:AuthService){}

  signup(form:NgForm){
    this.authSrv.signup(form.value.email,form.value.password)
      .then(data=>{console.info(data)})
      .catch(error=>{console.error(error)});
  }

}
