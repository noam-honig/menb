import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Bottles } from './bottles';
import { BottleInfoComponent } from '../bottle-info/bottle-info.component';
import { ChartType, ChartOptions } from 'chart.js';
import { Countries } from '../manage/countries';
import { MatPseudoCheckbox } from '@angular/material/core';
import { ImportExcelComponent } from './import-excel.component';
import { DialogService } from '../common/dialog';
import { columnOrderAndWidthSaver } from '../common/columnOrderAndWidthSaver';

@Component({
  selector: 'app-bottles',
  templateUrl: './bottles.component.html',
  styleUrls: ['./bottles.component.scss']
})
export class BottlesComponent implements OnInit {

  constructor(private context: Context, private dialog: DialogService) { }
  
  bottles = this.context.for(Bottles).gridSettings({
    knowTotalRows: true,
    allowCRUD: true,
    showFilter: true,
    confirmDelete: async b => await this.dialog.confirmDelete("בקבוק " + b.name.value),
    gridButtons: [{
      name: 'קליטה מאקסל',
      click: async () => {
        await this.context.openDialog(ImportExcelComponent);
        this.bottles.reloadData();
      }
    }],
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
  columnSaver = new columnOrderAndWidthSaver(this.bottles);

  ngOnInit() {
    this.prepareChart();
    this.columnSaver.load('bottles');
  }

  async prepareChart() {
    return;
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
    if ([...map.keys()].length == 0) {
      map.set('', 1);
    }
    this.pieChartLabels.push(...map.keys());
    this.pieChartData = [...map.values()];

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
