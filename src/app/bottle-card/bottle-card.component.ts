import { Component, Input, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { BottleInfoComponent } from '../bottle-info/bottle-info.component';
import { Bottles } from '../bottles/bottles';
import { Roles } from '../users/roles';

@Component({
  selector: 'app-bottle-card',
  templateUrl: './bottle-card.component.html',
  styleUrls: ['./bottle-card.component.scss']
})
export class BottleCardComponent implements OnInit {

  constructor(private remult: Remult) { }
  @Input() b!: Bottles;
  ngOnInit(): void {
  }
  async edit(bottle: Bottles) {
    await openDialog(BottleInfoComponent, c => c.args = {
      bottle: bottle
    });
    bottle.imageReloadVersion++;

  }
  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }


}
