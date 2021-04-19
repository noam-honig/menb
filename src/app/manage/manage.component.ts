import { Component, OnInit } from '@angular/core';
import { GridSettings } from '@remult/angular';
import { Context } from '@remult/core';
import { Countries, Locations, States, Shapes, BottleTypes, Types } from './countries';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(private context: Context) { }
  countries = new GridSettings(this.context.for(Countries), {
    allowCRUD: true
  });
  types = new GridSettings(this.context.for(Types), {
    allowCRUD: true
  });
  bottleType = new GridSettings(this.context.for(BottleTypes), {
    allowCRUD: true
  });
  shapes = new GridSettings(this.context.for(Shapes), {
    allowCRUD: true
  });
  states = new GridSettings(this.context.for(States), {
    allowCRUD: true
  });
  locations = new GridSettings(this.context.for(Locations), {
    allowCRUD: true
  });

  ngOnInit() {
  }

}
