import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http'

import { MyApp } from './app.component';
import { Items } from '../pages/items/items';
import { ItemDetail } from "../pages/item-detail/item-detail";
import { ItemEdit } from "../pages/item-edit/item-edit";
import { ItemsService } from "../services/items";
import { EmailComposer } from '@ionic-native/email-composer';
import { Admin } from "../pages/admin/admin";
import { ReportsService } from "../services/reports";
import { Report } from "../pages/report/report";

import { IonicStorageModule } from '@ionic/storage';
import { EditItem } from "../pages/edit-item/edit-item";
import { Badge } from "@ionic-native/badge";
import { Login } from "../pages/login/login";
import { AuthService } from "../services/auth";

import {ChartModule} from 'angular2-highcharts';
import * as highcharts from 'Highcharts';

//Written by Brandon Alleyne - on my way up

@NgModule({
  declarations: [
    MyApp,
    Items,
    ItemDetail,
    ItemEdit,
    Admin,
    Report,
    EditItem,
    Login
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartModule.forRoot(highcharts)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Items,
    ItemDetail,
    ItemEdit,
    Admin,
    Report,
    EditItem,
    Login
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ItemsService,
    EmailComposer,
    ReportsService,
    Badge,
    AuthService
  ]
})
export class AppModule {}
