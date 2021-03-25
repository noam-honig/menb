import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Countries } from './countries';

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

  ngOnInit() {
  }

}
