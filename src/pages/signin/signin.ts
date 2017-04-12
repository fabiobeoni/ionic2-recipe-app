import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";

/*
  This page shows a different approach to
  validating input data. Uses angular only,
  instead of model validation we have for
  recipe. The code behind works directly
  with the form submitted instead of
  the model class.//
*/
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  signin(form:NgForm) {

  }

}
