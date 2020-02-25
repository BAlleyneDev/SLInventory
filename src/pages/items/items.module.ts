import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Items } from './items';

@NgModule({
  declarations: [
    Items,
  ],
  imports: [
    IonicPageModule.forChild(Items),
  ],
})
export class ItemsModule {}
