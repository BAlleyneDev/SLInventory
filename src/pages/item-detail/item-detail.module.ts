import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemDetail } from './item-detail';

@NgModule({
  declarations: [
    ItemDetail,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetail),
  ],
})
export class ItemDetailModule {}
