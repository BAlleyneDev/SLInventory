import { Injectable } from "@angular/core";

import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { AuthService } from "./auth";
import { Badge } from "@ionic-native/badge";

@Injectable()
export class BadgesService{
  private badgesAmount:number = 0;

  constructor(private http:Http, private authService:AuthService, private badge:Badge) {}

    
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
      this.badgesAmount = await this.badge.set(badgeNumber);
      console.log(this.badgesAmount);
    } catch(e){
       console.error(e);
    }
}

async getBadge(){
      try{
      this.badgesAmount = await this.badge.get();
      console.log(this.badgesAmount);
    } catch(e){
       console.error(e);
    }
  }

async increaseBadges(badgeNumber:string){
  try{
      this.badgesAmount = await this.badge.increase(Number(badgeNumber));
  }catch(e){
    console.log(e);
  }
}

async decreaseBadges(badgeNumber:string){
  try{
      this.badgesAmount = await this.badge.decrease(Number(badgeNumber));
  }catch(e){
    console.log(e);
  }
}


}