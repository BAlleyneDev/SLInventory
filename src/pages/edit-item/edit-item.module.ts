import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditItem } from './edit-item';

@NgModule({
  declarations: [
    EditItem,
  ],
  imports: [
    IonicPageModule.forChild(EditItem),
  ],
})
export class EditItemModule {}
