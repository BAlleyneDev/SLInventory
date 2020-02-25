import { Injectable } from "@angular/core";


import { Reports } from "../models/report";
import { Http, Response} from '@angular/http';
import 'rxjs/Rx';
import { AuthService } from "./auth";

@Injectable()
export class ReportsService {
  private reports: Reports[]=[];
  i:number;
  //report:string="";
  constructor(private http:Http, private authService:AuthService) {}

  addReport(yourName: string,
            date: string,
            name: string,
            message: string,
            comment:string) {
    this.reports.push(new Reports(yourName,date, name, message,comment));
   // this.saveReports();
   // this.onGenerateFullReport(yourName,date,name,message);
  }


  getReports() {
    return this.reports.slice();
  }

  setReports(reports:Reports[]){
    this.reports = reports;
  }

 /*onGenerateFullReport(yourName:string, date:string, name:string, message:string){
    this.report = this.report + yourName + message + name + " on " + date + "       \n";
 }

 onShowReport()
 {
   return this.report;
 }
*/
  removeReport(index: number) {
    this.reports.splice(index, 1);
  }

  clearReportList(){
    this.reports=[];
  }

  storeItems(token:string){
  const userID = this.authService.getActiveUser().uid;

  return this.http
  .put('https://slinventory-fbd18.firebaseio.com/' + userID + '/report-list.json?auth=' + token, this.reports)
  .map((response:Response)=>{
     return response.json();
  });
}



/*private saveReports(){
     this.authService.getActiveUser().getToken()
  .then(
    (token:string)=>{
      this.storeItems(token)
      .subscribe(
        ()=> console.log(),
        error =>{
          console.log(error);
        }
      )
    }
  );
}

*/


 fetchItems(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://slinventory-fbd18.firebaseio.com/' + userId + '/report-list.json?auth=' + token)
      .map((response: Response) => {
        const recipes: Reports[] = response.json() ? response.json() : [];
        
        return recipes;
      })
      .do((recipes: Reports[]) => {
        if (recipes) {
          this.reports = recipes;
        } else {
          this.reports = [];
        }
      });
  }

  
}
