import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Admin } from './admin';

@NgModule({
  declarations: [
    Admin,
  ],
  imports: [
    IonicPageModule.forChild(Admin),
  ],
})
export class AdminModule {}
