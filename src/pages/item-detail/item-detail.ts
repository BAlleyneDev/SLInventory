import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from "ionic-angular";
import { ItemsService } from "../../services/items";
import { Item } from "../../models/items";
import { ItemEdit } from "../item-edit/item-edit";
import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetail implements OnInit {
  item: Item;
  index: number;
  mode:string;


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private itemService: ItemsService,
              private authService: AuthService
  ) {
  }

  ngOnInit(){
     this.item = this.navParams.get('item');
     this.index = this.navParams.get('index');
     this.mode = this.navParams.get('mode');
  }
   


  onEditItem(){
    this.navCtrl.push(ItemEdit, {mode: 'Edit', item:this.item, index:this.index});
  }

  onDeleteItem(){
    this.itemService.removeItem(this.index);
    this.saveItems();
     setTimeout(()=>{
        console.log('Waiting Completed');
      }, 100);
    this.navCtrl.popToRoot();
  }


  ionViewWillLeave(){
       this.saveItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetail');
  }

  private saveItems(){
     this.authService.getActiveUser().getToken()
  .then(
    (token:string)=>{
      this.itemService.storeItems(token)
      .subscribe(
        ()=> console.log(),
        error =>{
          console.log(error);
        }
      )
    }
  );
}



}
