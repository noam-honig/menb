import { Component, OnInit } from '@angular/core';
import { Bottles } from '../bottles/bottles';
import { DataAreaSettings } from '@remult/core';

@Component({
  selector: 'app-bottle-info',
  templateUrl: './bottle-info.component.html',
  styleUrls: ['./bottle-info.component.scss']
})
export class BottleInfoComponent implements OnInit {

  constructor() { }
  args:{
    bottle:Bottles
  }
  area:DataAreaSettings;
  ngOnInit() {
    let b = this.args.bottle;
    this.area = new DataAreaSettings({
      columnSettings:()=>[
        b.country,
        b.name,
        b.manufacturar,
        b.comments,
        [b.bottleType,b.shape],
        b.shapeComments
      ]
    });
  }

}
