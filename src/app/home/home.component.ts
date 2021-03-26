import { Component, Input, OnInit } from '@angular/core';
import { Context, ServerFunction, SqlDatabase } from '@remult/core';
import { Bottles } from '../bottles/bottles';
import { SqlBuilder } from '../common/sql-builder';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }
  value = 0;
  countries = 0;

  async ngOnInit() {
    HomeComponent.stats().then(x => {
      this.value = x.count;
      this.countries = x.countries;
    });
  }
  @ServerFunction({ allowed: true })
  static async stats(context?: Context, db?: SqlDatabase) {
    var sql = new SqlBuilder();
    var b = context.for(Bottles).create();

    return {
      count: await context.for(Bottles).count(),
      countries: (await db.execute(sql.query({ select: () => [sql.build("count (distinct ", b.country, ") count")], from: b }))).rows[0].count
    }
  }
}



@Component({
  selector: 'app-number',
  template: `{{display()}}`,
  styleUrls: ['./home.component.scss']
})
export class RunningNumberComponent implements OnInit {

  constructor() { }
  @Input()
  set value(val: number) {
    val = +val;
    let delta = this.theValue - val;
    this.theValue = val;
    this.animateChange(delta);
  }
  display() {
    let val = (this.theValue + this.balanceAnimationDelta);
    if (isNaN(val))
      return '';
    let r = val.toFixed(0);

    return r;
  }
  theValue = 0;
  balanceAnimationDelta = 0;
  interval: NodeJS.Timer;
  private animateChange(change: number) {
    if (this.interval)
      clearInterval(this.interval);

    this.balanceAnimationDelta = change;
    const steps = 50;
    let currentStep = 0;
    this.interval = setInterval(() => {
      currentStep++;
      this.balanceAnimationDelta = Math.round(change * (steps - currentStep) / steps);
      if (currentStep == steps) {
        this.balanceAnimationDelta = 0;
        clearInterval(this.interval);
      }
    }, 30);
  }

  ngOnInit() {
  }
}
