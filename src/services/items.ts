import { Injectable } from "@angular/core";

import { Item } from "../models/items";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { AuthService } from "./auth";


@Injectable()
export class ItemsService {
  private items: Item[]=[];
  private tempNames:any;
  report:string="";
  temp:string="";
  newLine = String.fromCharCode(10); 
  constructor(private http:Http, private authService:AuthService) {}

 

  addItem(name: string,
            amount: number,
            location: string,
            threshold: number,
            notes: string,
            limit: boolean) {
    this.items.push(new Item(name,amount,location,threshold, notes, limit));
    console.log(this.items);
  }

  onGenerateFullReport(name:string, amount:number){
    this.report = this.report + 'Item: ' + name + '  Amount: '+ amount+ '.<br>     ' + this.newLine;
 }

 onShowReport()
 {
   return this.report;
 }

  addAmount(index: number,
            name: string,
            amount:number,
            location: string,
            threshold: number,
            limit:boolean,
            item: Item){
                item.amount = item.amount*1+1;
            }

   subAmount(index: number,
            name: string,
            amount:number,
            location: string,
            threshold: number,
            limit:boolean,
            item: Item){
                item.amount = item.amount*1-1;
            }

    setLimit(index:number, limitVal:boolean){
         this.items[index].limit=limitVal;
    }

  getItems() {
    return this.items.slice();
  }

  updateItem(index: number,
               name: string,
               amount: number,
               location: string,
               threshold: number,
               notes:string,
               limit:boolean) {
    this.items[index] = new Item(name,amount,location, threshold, notes,limit);
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  setReports(items:Item[]){
    this.items = items;
  }

storeItems(token:string){
  const userID = this.authService.getActiveUser().uid;

  return this.http
  .put('https://slinventory-fbd18.firebaseio.com/' + userID + '/item-list.json?auth=' + token, this.items)
  .map((response:Response)=>{
     return response.json();
  });
}

 fetchItems(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://slinventory-fbd18.firebaseio.com/' + userId + '/item-list.json?auth=' + token)
      .map((response: Response) => {
        const recipes: Item[] = response.json() ? response.json() : [];
        
        return recipes;
      })
      .do((recipes: Item[]) => {
        if (recipes) {
          this.items = recipes;
        } else {
          this.items = [];
        }
      });
  }



  
}
