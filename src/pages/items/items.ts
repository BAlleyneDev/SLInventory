import { Component } from '@angular/core';
import { NavController, reorderArray, AlertController, ToastController } from "ionic-angular";
import { ItemEdit } from "../item-edit/item-edit";
import { Item } from "../../models/items";
import { ItemsService } from "../../services/items";
import { ItemDetail } from "../item-detail/item-detail";
import { EmailComposer } from "@ionic-native/email-composer";
import { Admin } from "../admin/admin";
import { ReportsService } from "../../services/reports";
import { Report } from "../report/report";

import { Storage } from '@ionic/storage';
import { Badge } from "@ionic-native/badge";

import firebase from 'firebase';
import { AuthService } from "../../services/auth";
import { Reports } from "../../models/report";




@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class Items {
   items: Item[];
   reports: Reports[];
   tempNames: string[] = new Array(50);
   tempAmounts: number[] = new Array(50);
   tempThresholds: number[] = new Array(50);
   num:number;
   count:number=0;
   regActivated:boolean=false;
   date: string = new Date().toDateString();
   registeredDevice: boolean = false;
   report:string="";
   badgeCount:number=0;

   chartOptions:any;

   searchQuery: string= '';
 

  constructor(private navCtrl:NavController,
              private itemsService:ItemsService,
              private alertCtrl:AlertController,
              private emailComposer: EmailComposer,
              private toastCtrl: ToastController,
              private reportService: ReportsService,
              public storage: Storage,
              private badge:Badge,
              private authService:AuthService
  ) {
     
   
  }


refresh(){
  this.loadItems();
}

getLocation(ev: any){
   this.items = this.itemsService.getItems();
  let val = ev.target.value;

  if(val && val.trim() != ''){
    this.items = this.items.filter((item)=>{
      return (item.location.toLowerCase().indexOf(val.toLowerCase())>-1);
    })
  }
}

getItems(ev: any){
   this.items = this.itemsService.getItems();
  let val = ev.target.value;

  if(val && val.trim() != ''){
    this.items = this.items.filter((item)=>{
      return (item.name.toLowerCase().indexOf(val.toLowerCase())>-1);
    })
  }
}



async requestPermission(){
   try{
     let hasPermission = await this.badge.hasPermission();
     console.log(hasPermission)
     if(!hasPermission){
      let permission = await this.badge.registerPermission();
      console.log(permission);
     }
   }catch(e){
     console.error(e);
   }
}

async setBadge(badgeNumber:number){
    try{
      let badges = await this.badge.set(badgeNumber);
      console.log(badges);
    } catch(e){
       console.error(e);
    }
}

async getBadge(){
      try{
      let badgeAmount = await this.badge.get();
      console.log(badgeAmount);
    } catch(e){
       console.error(e);
    }
  }

async increaseBadges(badgeNumber:string){
  try{
      let badge = await this.badge.increase(Number(badgeNumber));
  }catch(e){
    console.log(e);
  }
}

async decreaseBadges(badgeNumber:string){
  try{
      let badge = await this.badge.decrease(Number(badgeNumber));
  }catch(e){
    console.log(e);
  }
}


private setBadgesOnLoad(){
   let i=0;
   let badgeCount = 0;
   while(i<this.items.length){
     if(this.items[i].limit == true)
        badgeCount++;
    i++;
   }
   this.setBadge(badgeCount);
}


 getTempNames(){
    let i=0;
      while(i<this.items.length)
      {
         this.tempNames[i] =this.items[i].name;
         i++;
      }
      return this.tempNames;
  }

  getTempAmounts(){
    let i=0;
      while(i<this.items.length)
      {     
         this.tempAmounts[i] =Number(this.items[i].amount);
         i++;
      }
      return this.tempAmounts;
  }

  getTempThreshold(){
    let i=0;
      while(i<this.items.length)
      {
         this.tempThresholds[i] =Number(this.items[i].threshold);
         i++;
      }
      return this.tempThresholds;
  }


onGenerateFullReport(){
  let i = 0;
  while(i<this.items.length)
  {
    this.report= this.report+ "Item: "+this.items[i].name+ "  Amount:" + this.items[i].amount+"\n";
    i++;
  }
  let reportEmail = {
             to: 'b.alleyne.sa@gmail.com',
             subject: 'All Items Report List', 
             body: "Report:<br>"+this.report,
             isHtml: true
           };
           this.emailComposer.open(reportEmail);

  this.report = "";

}


/*onGenerateFullReport(){
   this.report =this.itemsService.onShowReport();
    let reportEmail = {
             to: 'b.alleyne.sa@gmail.com',
             subject: 'All Items Report List', 
             body: "Reports:<br>"+this.report,
             isHtml: true
           };
           this.emailComposer.open(reportEmail);
}
*/

onLoadChart(){
this.getTempNames();
this.getTempAmounts();
this.getTempThreshold();



 this.chartOptions={
       chart: {
            type: 'bar',
            width: 300
        },
        title: {
            text: 'Inventory Bar Chart',
        },
        xAxis: {
            categories: this.tempNames
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        },
         plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
       },
        series: [{
            name: 'Amount',
            data: this.tempAmounts
        },
           {
            name: 'Threshold',
            data: this.tempThresholds
          }
        ]
    }
   this.tempNames=[];
   this.tempAmounts=[];
   this.tempThresholds=[];    
   
}

adminaccess(){
  
  this.count++;
  if(this.count >= 10)
  {
    this.count=0;
    this.navCtrl.push(Admin);
  }
  
}




registerDevice(){
   const alert = this.alertCtrl.create({
     title: 'Please enter your name',
     inputs: [
       {
       name: 'yourName',
       placeholder: 'Name'
       }
     ],
     buttons:[
       {
         text: 'Cancel',
         role: 'cancel'
       },
       {
         text: 'Register',
         handler: data =>{
           if(data.yourName == "Colin" || data.yourName == "Kiel" || data.yourName == "Kayla" || 
             data.yourName == "Jamar" || data.yourName == "Natalie" || data.yourName == "Shane")
           {
              const password = this.alertCtrl.create({
                title: 'Please enter your password',
                inputs: [
                  {
                      name:'yourPassword',
                      placeholder:'Password'
                  }
                ],
                buttons:[
                  {
                    text:'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Register',
                    handler: data2=>{
                       if(data2.yourPassword == "hpk2Wr" && data.yourName == 'Colin')//Colin
                        {
                         this.storage.set('yourName', data.yourName);
                         this.storage.set('rValue', 1);
                         this.registeredDevice=true;
                         this.presentToast(2,data.yourName,0);
                        }
                      else if(data2.yourPassword == "SEp9Nb" && data.yourName == 'Kayla')
                        { 
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                         else if(data2.yourPassword == "tAaX8V" && data.yourName == 'Keil')
                        {
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                         else if(data2.yourPassword == "GG7wgT" && data.yourName == 'Natalie')
                        {
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                        else if(data2.yourPassword == "NPqf3p" && data.yourName == 'Jamar')
                        {
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                        else if(data2.yourPassword == "YtxT9D" && data.yourName == 'Shane')
                        {
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                        else if(data2.yourPassword == "9GxypF" && data.yourName == 'Bentley')
                        {
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                        else if(data2.yourPassword == "W2SDzF" && data.yourName == 'Shanice')
                        {
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                        else if(data2.yourPassword == "35VvXh" && data.yourName == 'Roger')
                        {
                          this.storage.set('yourName', data.yourName);
                          this.storage.set('rValue', 1);
                          this.registeredDevice=true;
                          this.presentToast(2,data.yourName,0);
                        }
                        else
                        {
                          this.presentToast(3,"", 0);
                        }
                    }
                  }
                ]
              })
              password.present();
           }
           else
             this.presentToast(3,"", 0); 
         }
       }
     ]
   })
   alert.present();
}


presentToast(option:number,name:string, amount:number){
  if(option == 0)
  {
  let toast = this.toastCtrl.create({
    message: name + ' has been increased to ' + amount,
    duration: 2000,
    position: 'middle'
  });
     toast.present();
  }
  else if(option == 1)
  {
  let toast = this.toastCtrl.create({
    message: name + ' has been decreased to ' + amount,
    duration: 2000,
    position: 'middle'
  });
    toast.present();
  }
  else if (option == 2)
  {
    let toast = this.toastCtrl.create({
    message: name+' registered',
    duration: 1200,
    position: 'middle'
  });
    toast.present();
  }
  else if (option == 3)
  {
    let toast = this.toastCtrl.create({
    message: 'Unable to register',
    duration: 1200,
    position: 'middle'
  });
    toast.present();
  }
}

addtoAmount(index:number, name:string, amount:number, location:string, threshold:number,limit:boolean,item: Item){
   // this.loadItems();
   console.log(item);
    const Notealert = this.alertCtrl.create({
         title: 'Note(Adding)',
     inputs: [
       {
       name: 'note',
       placeholder: 'Notes'
      }
     ],
     buttons:[
       {
         text: 'Cancel',
         role: 'cancel'
       },
       {
         text:'Add Note',
         handler: n=>{

             if(amount >= threshold)
              {
                console.log(limit);
                limit=false;
                this.decreaseBadges("1");
                this.itemsService.setLimit(index,limit);
               }
               this.presentToast(0,name, amount*1+1);
               this.itemsService.addAmount(index, name,amount,location, threshold,limit,item);
               this.saveItems();
               

                this.storage.get('yourName').then((yourName)=>{
          this.reportService.addReport(yourName,this.date,name,' added ', n.note);
          this.saveReports();
           });
           
         }
       }]
    });
  Notealert.present();
} 

subAmount(index:number, name:string, amount:number, location:string, threshold:number, limit:boolean,item: Item){
  
  //this.loadItems();
  const Notealert = this.alertCtrl.create({
      title:'Note(Sub)',
      inputs:[
        {
         name: 'note',
         placeholder:'note'
        }
      ],
      buttons:[
        {
        text:'Cancel',
        role:'cancel'
       },
       {
         text:'Add Note',
         handler:n=>{
              

              this.presentToast(1,name,amount-1);


   if(amount == threshold ) //set threshold number
   {
     if(this.badgeCount<1)
     {
       this.setBadge(0);
       this.badgeCount++;
     }
     console.log(" Inside Amount ="+amount + " Threshold="+threshold);
     this.increaseBadges("1");
     limit=true;
     this.itemsService.setLimit(index,limit);
     const alert = this.alertCtrl.create({
       title: 'Running Low',
       message: 'Please inform Natalie',
       buttons: [{
         text:'Ok',
         handler: ()=>{
           let email = {
             to: 'NKing@sandylane.com',
             subject: 'Low supplies',
             body: 'Dear Nathalie<br><br> Please note that ____ is running low. <br><br>Regards<br>',
             isHtml: true
           };
           this.emailComposer.open(email);
         }
       }]
     });
     alert.present();
   }
   
   this.itemsService.subAmount(index, name,amount,location,threshold,limit,item);
    this.saveItems();
   this.storage.get('yourName').then((yourName)=>{
      this.reportService.addReport(yourName,this.date,name,' removed ',n.note);
      this.saveReports();
   });
   
         }
       }
      ]
  });

  Notealert.present();

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
            this.items = list;
          } else{
            this.items=[];
          }
        },
        error=>{
          console.log(error);
        }
      );
    }
  );
}

private saveReports(){
     this.authService.getActiveUser().getToken()
  .then(
    (token:string)=>{
      this.reportService.storeItems(token)
      .subscribe(
        ()=> console.log(),
        error =>{
          console.log(error);
        }
      )
    }
  );
}


public loadReports(){
   this.authService.getActiveUser().getToken()
  .then(
    (token:string)=>{
      this.reportService.fetchItems(token)
      .subscribe(
        (list:Reports[])=>{
          if(list){
            this.reportService.setReports(list);
          } else{
            this.reportService.setReports([]);
          }
        },
        error=>{
          console.log(error);
        }
      );
    }
  );
}



ionViewWillEnter(){
  this.items = this.itemsService.getItems();
  this.setBadgesOnLoad();
  //this.saveItems();
  
}

ionViewDidEnter(){
   this.loadItems();
   this.loadReports();

   this.requestPermission();

  this.storage.get('rValue').then((r)=>{
      if(r == 1)
      {
         this.registeredDevice = true;
      }
      else
        this.registeredDevice = false;
   });
  this.setBadgesOnLoad();

  
}

ionViewWillLeave(){
  this.setBadgesOnLoad();
}

 

/*

ionViewDidEnter(){
  this.loadItems();
  this.items = this.itemsService.getItems();
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
//Written by Brandon Alleyne - on my way up
  this.requestPermission();

  this.storage.get('rValue').then((r)=>{
      if(r == 1)
      {
         this.registeredDevice = true;
      }
      else
        this.registeredDevice = false;
   });
}

*/
 addItem(){
    this.navCtrl.push(ItemEdit,{mode:'New'});
 }

onLoadItem(item: Item, index: number){
   this.navCtrl.push(ItemDetail, {item: item, index:index});
}



 reorderItems(indexes){
   this.items = reorderArray(this.items, indexes);
 }

}
