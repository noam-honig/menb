import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { BackendMethod, FieldRef, Remult } from 'remult';

import * as xlsx from 'xlsx';//https://sheetjs.com/
import { DialogService } from '../common/dialog';
import { BottleTypes, Countries, LookupTableBase, Shapes, Types } from '../manage/countries';
import { Bottles } from './bottles';

@Component({
    selector: 'app-import-excel',
    template: `
      <input #fileInput type="file" (input)="onFileInput($event)" />
  `,
    styles: []
})
export class ImportExcelComponent {
    constructor(private remult: Remult, private dialog: DialogService, private matDialog: MatDialogRef<any>) {

    }

    async onFileInput(eventArgs: any) {
        for (const file of eventArgs.target.files) {
            let f: File = file;
            await new Promise((res) => {
                var fileReader = new FileReader();

                fileReader.onload = async (e: any) => {

                    // pre-process data
                    var binary = "";
                    var bytes = new Uint8Array(e.target.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    // call 'xlsx' to read the file
                    var oFile = xlsx.read(binary, { type: 'binary', cellDates: true, cellStyles: true });
                    let sheets = oFile.SheetNames;
                    var dataArray: any[][] = xlsx.utils.sheet_to_json(oFile.Sheets[sheets[0]], { header: 1 });

                    dataArray = dataArray.filter(x => x[0] || x[1] || x[2] || x[3]);
                    if (await this.dialog.yesNoQuestion("האם לקלוט " + dataArray.length + " בקבוקים?")) {
                        let processed = await ImportExcelComponent.ImportBottles(dataArray);
                        this.dialog.info("נקלטו " + processed + " בקבוקים");
                        this.matDialog.close();
                    }


                };
                fileReader.readAsArrayBuffer(f);
            });
            return;//to import the first file only
        }
    }

    @BackendMethod({ allowed: true })
    static async ImportBottles(dataArray: any, remult?: Remult) {
        let i = 0;
        for (const row of dataArray) {


            i++;
            if (i == 1)
                continue;
            var bottleName: string = row[xlsx.utils.decode_col("A")];

            //find existing product by name
            let b = remult!.repo(Bottles).create();
            b.name = bottleName;

            let lookup = async (eType: {
                new(...args: any[]): LookupTableBase;
            }, dataCol: FieldRef<any, LookupTableBase | undefined> | undefined, col: string) => {

                let val: string = row[xlsx.utils.decode_col(col)];
                if (val && val.trim().length > 0) {
                    val = val.trim();
                    let r = await remult!.repo(eType).findFirst({ name: val }, {
                        useCache: true
                    });
                    if (r.isNew()) {
                        r.name = val;
                        await r.save();
                    }
                    dataCol!.value = r;
                }
            }
            await lookup(Types, b.$.type, 'B');
            b.manufacturer = row[xlsx.utils.decode_col("C")];
            await lookup(Countries, b.$.country, 'D');
            b.volume = +row[xlsx.utils.decode_col("E")];
            b.alcohol = +row[xlsx.utils.decode_col("F")];
            await lookup(BottleTypes, b.$.bottleType, 'G');
            await lookup(Shapes, b.$.shape, 'H');
            b.quantity = +row[xlsx.utils.decode_col("I")];
            b.shapeComments = row[xlsx.utils.decode_col("J")];
            b.comments = row[xlsx.utils.decode_col("K")];
            await b.save();

        }
        return i;
    }

}
