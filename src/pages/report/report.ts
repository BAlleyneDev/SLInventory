import { Component } from '@angular/core';
import { ReportsService } from "../../services/reports";
import { Reports } from "../../models/report";
import { NavController } from "ionic-angular";
import { Items } from "../items/items";
import { EmailComposer } from "@ionic-native/email-composer";
import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class Report {
        reports:Reports[];
        report:string="-----";
  constructor(
       private reportService: ReportsService,
       private navCtrl: NavController,
        private emailComposer: EmailComposer,
        private authService:AuthService
  ) {
  }


  ionViewWillEnter(){
  this.reports = this.reportService.getReports();
  
}

ionViewDidEnter(){
   this.loadItems();
}


onGenerateFullReport(){
  let i = 0;
  while(i<this.reports.length)
  {
    this.report = this.report + this.reports[i].yourName + this.reports[i].message + this.reports[i].name + " on " + this.reports[i].date + " from " + this.reports[i].comment+"-----";
    i++;
  }
  let reportEmail = {
             to: 'b.alleyne.sa@gmail.com',
             subject: 'Add and Remove Report List', 
             body: "Report:<br>"+this.report,
             isHtml: true
           };
           this.emailComposer.open(reportEmail);

  this.report = "";

}


/*onGenerateFullReport(){
   this.report =this.reportService.onShowReport();
    let reportEmail = {
             to: 'b.alleyne.sa@gmail.com',
             subject: 'Add and Remove Report List', 
             body: "Reports:<br>"+this.report,
             isHtml: true
           };
           this.emailComposer.open(reportEmail);
}
*/
clearReports(){
  this.reportService.clearReportList();
  this.saveItems();
  this.navCtrl.popToRoot();
}


removeReport(index:number){
  this.reportService.removeReport(index);
  this.saveItems();
  this.loadItems();
 // this.navCtrl.setRoot(this.navCtrl.getActive().component);
}

returnToHome(){
  this.navCtrl.push(Items);
}


private saveItems(){
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

public loadItems(){
   this.authService.getActiveUser().getToken()
  .then(
    (token:string)=>{
      this.reportService.fetchItems(token)
      .subscribe(
        (list:Reports[])=>{
          if(list){
            this.reports = list;
          } else{
            this.reports=[];
          }
        },
        error=>{
          console.log(error);
        }
      );
    }
  );
}


}
