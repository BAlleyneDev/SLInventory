import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { ItemsService } from "../../services/items";
import { Item } from "../../models/items";
import { ItemDetail } from "../item-detail/item-detail";
import { Report } from "../report/report";
import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class Admin {
  items: Item[];

  constructor(private navCtrl:NavController,
              private itemsService:ItemsService,
              private authService:AuthService
              ) {}


  ionViewWillEnter(){
  this.items = this.itemsService.getItems();
  }
 
  onLoadItem(item: Item, index: number, mode:string){
   this.navCtrl.push(ItemDetail, {item: item, index:index,mode:mode});
}


   onDeleteItem(index:number){
     this.itemsService.removeItem(index);
     this.saveItems();
     this.navCtrl.popToRoot();
  }

  loadReports(){
    this.navCtrl.push(Report);
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

}
