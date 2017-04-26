import {NgModule, ErrorHandler} from '@angular/core';
import { HttpModule } from '@angular/http';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {ShoppingListService} from "../services/shopping-list-service";
import {RecipeService} from "../services/recipe-service";
import {ModelValidationService} from "../services/model-validation-service";
import {FirebaseAuthService} from "../services/firebase-auth-service";
import {FirebaseStorageService} from "../services/firebase-storage-service";
import {SigninPage} from "../pages/signin/signin";
import {AuthPage} from "../pages/auth/auth";
import {BackupPage} from "../pages/backup/backup";
import {TabsPage} from '../pages/tabs/tabs';
import {RecipePage} from "../pages/recipe/recipe";
import {RecipeEditPage} from "../pages/recipe-edit/recipe-edit";
import {RecipesPage} from "../pages/recipes/recipes";
import {ShoppingListPage} from "../pages/shopping-list/shopping-list";
import {ToastWrapper} from "../utils/toast-wrp";

@NgModule({
  declarations: [
    MyApp,
    RecipeEditPage,
    RecipesPage,
    ShoppingListPage,
    TabsPage,
    AuthPage,
    BackupPage
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecipeEditPage,
    RecipesPage,
    ShoppingListPage,
    TabsPage,
    AuthPage,
    BackupPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseAuthService, FirebaseStorageService, ShoppingListService, RecipeService, ModelValidationService, ToastWrapper
  ]
})
export class AppModule {
  /**
   * Name of the database the app uses to store
   * data locally.
   * @type {string}
   */
  public static readonly DB_NAME = 'recipes-db';
}
