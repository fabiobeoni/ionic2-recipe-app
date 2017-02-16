import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController} from 'ionic-angular';
import {Ingredient} from "../../models/ingradient";

@Component({
  selector: 'page-recipe-edit',
  templateUrl: 'recipe-edit.html'
})
export class RecipeEditPage implements OnInit {

  public static Modes = {
    EDIT:'Edit',
    ADD:'New'
  };

  mode = RecipeEditPage.Modes.ADD;

  options:string[]= ['Easy','Medium','Difficult'];

  ingredients:string[] = [];

  constructor(
    public navParams: NavParams,
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController
  ) {}

  ngOnInit(){
    this.mode = this.navParams.data;
  }

  manageIngredients(){
    const actSheet = this.actionSheetCtrl.create({
      title:'Select',
      buttons:[
        {
          text:'Add Ingredient',
          handler:()=>{}
        },
        {
          text:'Remove all Ingredients',
          role:'destructive',
          handler:()=>{}
        },
        {
          text:'Cancel',
          role:'cancel',
          handler:()=>{}
        },
      ]
    });

    actSheet.present();
  }

  createNewIngredientAlert(){
    const ingredientAlert = this.alertCtrl.create({
      title:'Add Ingredient',
      inputs:[
        {
          name:'name',
          placeholder:'Name'
        }
      ],
      buttons:[
        {
          text:'Cancel',
          role:'cancel'
        },
        {
          text:'Add',
          handler: data => {
            if(!data.name && data.name.trim()!='')
               this.ingredients.push(data.name);
            else
              alert('Error');
          }
        }
      ]
    });
  }

}
