import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import {RecipePage} from "../pages/recipe/recipe";
import {RecipeEditPage} from "../pages/recipe-edit/recipe-edit";
import {RecipesPage} from "../pages/recipes/recipes";
import {ShoppingListPage} from "../pages/shopping-list/shopping-list";
import {ShoppingListService} from "../services/shopping-list-service";
import {RecipeService} from "../services/recipe-service";
import {ModelValidationService} from "../services/model-validation-service";

@NgModule({
  declarations: [
    MyApp,
    RecipePage,
    RecipeEditPage,
    RecipesPage,
    ShoppingListPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecipePage,
    RecipeEditPage,
    RecipesPage,
    ShoppingListPage,
    TabsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShoppingListService, RecipeService, ModelValidationService
  ]
})
export class AppModule {}
