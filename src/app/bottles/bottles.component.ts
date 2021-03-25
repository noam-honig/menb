import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Bottles } from './bottles';
import { BottleInfoComponent } from '../bottle-info/bottle-info.component';
import { ChartType, ChartOptions } from 'chart.js';
import { Countries } from '../manage/countries';

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
    this.prepareChart();
  }

  async prepareChart() {
       this.pieChartLabels.splice(0);
    this.pieChartData.splice(0);
    let map = new Map<string, number>();
    for await (let b of this.context.for(Bottles).iterate()) {
      let c = await this.context.for(Countries).lookupAsync(b.country);
      let val = map.get(c.name.value);
      if (val == undefined)
        val = 0;
      val++;
      map.set(c.name.value, val);


    }
    this.pieChartLabels.push(...map.keys());

    this.pieChartData = [...map.values()];
    console.log({
      l: this.pieChartLabels,
      d: this.pieChartData
    })
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels = ["noam", "yael", "ilan"];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

}
