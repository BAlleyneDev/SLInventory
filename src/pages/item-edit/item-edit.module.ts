import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemEdit } from './item-edit';

@NgModule({
  declarations: [
    ItemEdit,
  ],
  imports: [
    IonicPageModule.forChild(ItemEdit),
  ],
})
export class ItemEditModule {}
