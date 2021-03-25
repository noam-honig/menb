import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Bottles } from './bottles';

@Component({
  selector: 'app-bottles',
  templateUrl: './bottles.component.html',
  styleUrls: ['./bottles.component.scss']
})
export class BottlesComponent implements OnInit {

  constructor(private context: Context) { }
  bottles = this.context.for(Bottles).gridSettings({
    allowCRUD: true
  })

  ngOnInit() {
  }

}
