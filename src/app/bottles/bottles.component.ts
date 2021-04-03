import { Component, isDevMode, OnInit } from '@angular/core';
import { Context, StringColumn } from '@remult/core';
import { Bottles, LookupColumn } from './bottles';
import { BottleInfoComponent } from '../bottle-info/bottle-info.component';
import { ChartType, ChartOptions } from 'chart.js';
import { Countries } from '../manage/countries';
import { MatPseudoCheckbox } from '@angular/material/core';
import { ImportExcelComponent } from './import-excel.component';
import { DialogService } from '../common/dialog';
import { columnOrderAndWidthSaver } from '../common/columnOrderAndWidthSaver';
import { UploadImageComponent } from './upload-image.component';
import { BusyService } from '@remult/angular';
import * as xlsx from 'xlsx';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-bottles',
  templateUrl: './bottles.component.html',
  styleUrls: ['./bottles.component.scss']
})
export class BottlesComponent implements OnInit {

  constructor(private context: Context, private dialog: DialogService, private busy: BusyService) { }
  searchString = new StringColumn({
    caption: 'חפש בקבוק',
    valueChange: async () => {
      // the call to `this.busy.donotWait` causes the load products method to run without the "Busy" circle in the ui
      await this.busy.donotWait(async () => await this.bottles.reloadData());
    }
  })

  bottles = this.context.for(Bottles).gridSettings({
    knowTotalRows: true,
    allowCRUD: true,
    allowDelete: false,
    showFilter: true,

    gridButtons: [{
      name: 'קליטה מאקסל',
      click: async () => {
        await this.context.openDialog(ImportExcelComponent);
        this.bottles.reloadData();
      }
    },
    {
      name: 'יצוא לאקסל',
      click: async () => {
        let result = [];

        for await (const p of this.context.for(Bottles).iterate(this.bottles.getFilterWithSelectedRows())) {
          let item = {};
          for (const col of p.columns) {
            item[col.defs.caption] = col.value;
            if (col instanceof LookupColumn)
              item[col.defs.caption] = await col.getNameAsync()
          }
          result.push(item);
        }
        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(result));
        xlsx.writeFile(wb, "bottles.xlsx");
      }

    }],
    where: p =>
      // if there is a search value, search by it
      this.searchString.value ? p.name.isContains(this.searchString)
        : undefined
    ,
    columnSettings: (b) => [
      ...b.columns.toArray().filter(x => x != b.id)
    ],
    numOfColumnsInGrid: 3,
    rowButtons: [{
      textInMenu: 'פרטים',
      icon: 'edit',
      showInLine: true,

      click: (bottle) => {
        this.edit(bottle);
      }
    }, {
      textInMenu: 'צילום',
      icon: 'photo_camera',
      showInLine: true,
      click: async (b) => {
        this.uploadImage(b);
      }
    },
    {
      textInMenu: 'שכפל',
      click: async (b) => {
        this.bottles.addNewRow();
        let newb = this.bottles.currentRow;
        for (const col of b.columns) {
          newb.columns.find(col).value = col.value;
        }
        this.edit(newb);

      }
    },
    {
      textInMenu: 'מחק',
      icon: 'delete',

      click: async (b) => {
        if (await this.dialog.confirmDelete("בקבוק " + b.name.value)) {
          await b.delete();
        }
      }
    }]
  })
  columnSaver = new columnOrderAndWidthSaver(this.bottles);

  uploadImage(b: Bottles) {
    this.context.openDialog(UploadImageComponent, x => x.args = {
      bottleId: b.id.value,
      afterUpload: async (image) => {
        let i = await b.findImage();
        i.image.value = image;
        await i.save();
      }
    });
  }

  edit(bottle: Bottles) {
    this.context.openDialog(BottleInfoComponent, c => c.args = {
      bottle: bottle
    });
  }

  ngOnInit() {
    this.prepareChart();
    this.columnSaver.load('bottles');
    if (false)
      setTimeout(() => {
        this.context.openDialog(BottleInfoComponent, c => c.args = {
          bottle: this.bottles.items[0]
        })
      }, 500);
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
