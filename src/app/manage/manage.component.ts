import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Countries, Locations, States, Shapes, BottleTypes, Types } from './countries';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(private context:Context) { }
  countries = this.context.for(Countries).gridSettings({
    allowCRUD:true
  });
  types = this.context.for(Types).gridSettings({
    allowCRUD:true
  });
  bottleType = this.context.for(BottleTypes).gridSettings({
    allowCRUD:true
  });
  shapes = this.context.for(Shapes).gridSettings({
    allowCRUD:true
  });
  states = this.context.for(States).gridSettings({
    allowCRUD:true
  });
  locations = this.context.for(Locations).gridSettings({
    allowCRUD:true
  });

  ngOnInit() {
  }

}
