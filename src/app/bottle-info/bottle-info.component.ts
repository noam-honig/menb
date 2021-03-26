import { Component, OnInit } from '@angular/core';
import { BottleImages, Bottles } from '../bottles/bottles';
import { Context, DataAreaSettings } from '@remult/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UploadImageComponent } from '../bottles/upload-image.component';

@Component({
  selector: 'app-bottle-info',
  templateUrl: './bottle-info.component.html',
  styleUrls: ['./bottle-info.component.scss']
})
export class BottleInfoComponent implements OnInit {

  constructor(private dialog: MatDialogRef<any>, private context: Context) { }
  args: {
    bottle: Bottles
  }
  image: BottleImages;
  rightArea: DataAreaSettings;
  leftArea: DataAreaSettings;
  bottomArea: DataAreaSettings;
  ngOnInit() {
    let b = this.args.bottle;
    this.rightArea = new DataAreaSettings({
      columnSettings: () => [
        b.country,
        b.name,
        b.manufacturer,
        b.comments,
        [b.bottleType, b.shape],
        b.shapeComments,
        [b.alcohol, b.volume],


      ]
    });
    this.leftArea = new DataAreaSettings({
      columnSettings: () => [


        [b.type,
        b.subType],
        b.quantity,


      ]
    });
    this.bottomArea = new DataAreaSettings({
      columnSettings: () => [

        b.state,
        b.location,
        [b.entryDate, b.origin],
        [b.cost, b.worth],
        [b.exitDate, b.exitReason]

      ]
    });
    this.args.bottle.findImage().then(i => this.image = i);
  }

  async save() {
    await this.args.bottle.save();
    if (this.image.image.value != this.image.image.originalValue) {
      this.image.bottleId.value = this.args.bottle.id.value;
      await this.image.save();
    }
    this.dialog.close();
  }
  close() {
    this.args.bottle.undoChanges();
    this.dialog.close();
  }
  async upload() {
    if (this.args.bottle.isNew())
      await this.args.bottle.save();
    await this.context.openDialog(UploadImageComponent, x => x.args = {
      bottleId: this.args.bottle.id.value
      ,
      afterUpload: (image) => this.image.image.value = image
    });
  }

}
