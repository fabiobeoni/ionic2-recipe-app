import {NgModule, ErrorHandler} from '@angular/core';
import { HttpModule } from '@angular/http';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {RecipePage} from "../pages/recipe/recipe";
import {RecipeEditPage} from "../pages/recipe-edit/recipe-edit";
import {RecipesPage} from "../pages/recipes/recipes";
import {ShoppingListPage} from "../pages/shopping-list/shopping-list";
import {ShoppingListService} from "../services/shopping-list-service";
import {RecipeService} from "../services/recipe-service";
import {ModelValidationService} from "../services/model-validation-service";
import {ToastCtrl} from "../utils/toast-ctrl";
import {SigninPage} from "../pages/signin/signin";
import {SignupPage} from "../pages/signup/signup";

@NgModule({
  declarations: [
    MyApp,
    RecipeEditPage,
    RecipesPage,
    ShoppingListPage,
    TabsPage,
    SigninPage,
    SignupPage
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
    SigninPage,
    SignupPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShoppingListService, RecipeService, ModelValidationService, ToastCtrl
  ]
})
export class AppModule {
  public static readonly DB_NAME = 'recipes-db';
}
