import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Bottles } from './bottles';
import { BottleInfoComponent } from '../bottle-info/bottle-info.component';

@Component({
  selector: 'app-bottles',
  templateUrl: './bottles.component.html',
  styleUrls: ['./bottles.component.scss']
})
export class BottlesComponent implements OnInit {

  constructor(private context: Context) { }
  bottles = this.context.for(Bottles).gridSettings({
    allowCRUD: true,
    rowButtons: [{
      name: 'פרטים',
      icon: 'edit',
      click: (bottle) => {
        this.context.openDialog(BottleInfoComponent, c => c.args = {
          bottle: bottle
        })
      }
    }]
  })

  ngOnInit() {
  }

}
