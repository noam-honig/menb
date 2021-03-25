import { Component, OnInit } from '@angular/core';
import { Bottles } from '../bottles/bottles';
import { DataAreaSettings } from '@remult/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bottle-info',
  templateUrl: './bottle-info.component.html',
  styleUrls: ['./bottle-info.component.scss']
})
export class BottleInfoComponent implements OnInit {

  constructor(private dialog: MatDialogRef<any>) { }
  args: {
    bottle: Bottles
  }
  area: DataAreaSettings;
  ngOnInit() {
    let b = this.args.bottle;
    this.area = new DataAreaSettings({
      columnSettings: () => [
        b.country,
        b.name,
        b.manufacturar,
        b.comments,
        [b.bottleType, b.shape],
        b.shapeComments,
        b.type,
        b.subType,
        b.quantity,
        b.state,
        b.location,
        [b.entryDate, b.origin],
        [b.cost, b.worth],
        [b.exitDate, b.exitReason]

      ]
    });
  }
  async save() {
    await this.args.bottle.save();
    this.dialog.close();
  }

}
