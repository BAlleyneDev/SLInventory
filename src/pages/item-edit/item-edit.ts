import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from "ionic-angular";
import { ItemsService } from "../../services/items";
import { Item } from "../../models/items";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-item-edit',
  templateUrl: 'item-edit.html',
})
export class ItemEdit implements OnInit {
  mode = 'New';
  itemForm: FormGroup;
  item: Item;
  index: number;
  items: Item[];

  constructor(
    private navParams:NavParams,
    private itemsService:ItemsService,
    private navCtrl: NavController,
    private authService:AuthService
  ) {
  }

ngOnInit(){
  this.mode = this.navParams.get('mode');
  if(this.mode == 'Edit'){
    this.item = this.navParams.get('item');
    this.index = this.navParams.get('index');
  }
  this.initializeForm();
}

private saveItems(){
     this.authService.getActiveUser().getToken()
  .then(
    (token:string)=>{
      this.itemsService.storeItems(token)
      .subscribe(
        ()=> console.log(),
        error =>{
          console.log(error);
        }
      )
    }
  );
}

public loadItems(){
     this.authService.getActiveUser().getToken()
  .then(
    (token:string)=>{
      this.itemsService.fetchItems(token)
      .subscribe(
        (list:Item[])=>{
          if(list){
            this.itemsService.setReports(list);
          } else{
            this.itemsService.setReports([]);
          }
        },
        error=>{
          console.log(error);
        }
      );
    }
  );
}


onSubmit(){
  const value = this.itemForm.value;
  let items = [];
  if (items.length > 0){
    items = value.items.map(name =>{
         return {name:name, amount:1};
    });
  }

  if(this.mode == 'Edit'){
    this.itemsService.updateItem(this.index,value.name, value.amount, value.location, value.threshold, value.notes, value.limit);
  }
  else
  {
     this.itemsService.addItem(value.name, value.amount, value.location, value.threshold, value.notes, value.limit);
  }
   this.loadItems();
   this.saveItems();
   this.itemForm.reset();
   this.navCtrl.popToRoot();
}


private initializeForm() {
    let name = null;
    let amount = 0;
    let location = null;
    let threshold = 0;
    let notes = null;
    let limit = false;


   if(this.mode == 'Edit'){
     name=this.item.name;
     amount = this.item.amount;
     location = this.item.location;
     threshold = this.item.threshold;
     notes = this.item.notes;
     limit = this.item.limit;
   }


    this.itemForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'amount': new FormControl(amount, Validators.required),
      'location': new FormControl(location, Validators.required),
      'threshold': new FormControl(threshold, Validators.required),
      'notes': new FormControl(notes)
    });
    }

}
