import { Component, OnInit } from '@angular/core';
import { GridSettings } from '@remult/angular';
import { Remult } from 'remult';
import { Countries, Locations, States, Shapes, BottleTypes, Types } from './countries';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(private remult: Remult) { }
  countries = new GridSettings(this.remult.repo(Countries), {
    allowCrud: true
  });
  types = new GridSettings(this.remult.repo(Types), {
    allowCrud: true
  });
  bottleType = new GridSettings(this.remult.repo(BottleTypes), {
    allowCrud: true
  });
  shapes = new GridSettings(this.remult.repo(Shapes), {
    allowCrud: true
  });
  states = new GridSettings(this.remult.repo(States), {
    allowCrud: true
  });
  locations = new GridSettings(this.remult.repo(Locations), {
    allowCrud: true
  });

  ngOnInit() {
  }

}
