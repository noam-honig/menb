import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BusyService } from '@remult/angular';
import { Context, ServerFunction } from '@remult/core';
import { DialogService } from '../common/dialog';
import { BottleImages } from './bottles';

@Component({
    selector: 'app-home',
    template: `<input #fileInput type="file" (input)="onFileInput($event)" accept="image/*" />
   `,

})
export class UploadImageComponent implements OnInit {

    constructor(private context: Context,
        private busy: BusyService,
        private dialog: DialogService,
        private matDialog: MatDialogRef<any>) { }
    args: {
        bottleId: string,
        afterUpload: () => void
    }

    async onFileInput(eventArgs: any) {
        for (const file of eventArgs.target.files) {
            let f: File = file;
            await new Promise((res) => {
                var fileReader = new FileReader();

                fileReader.onload = async (e: any) => {



                    var img = new Image();

                    var canvas = document.createElement("canvas");

                    img.onload = async () => {
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        var MAX_WIDTH = 300;
                        var MAX_HEIGHT = 500;
                        var width = img.width;
                        var height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);

                        var dataurl = canvas.toDataURL("image/png");

                        let before = new Date();
                        let im = await this.context.for(BottleImages).findFirst(b => b.bottleId.isEqualTo(this.args.bottleId));
                        if (!im) {
                            im = this.context.for(BottleImages).create();
                            im.bottleId.value = this.args.bottleId;
                        }
                        im.image.value = dataurl; try {
                            await im.save();
                            this.dialog.info("תמונה הועלתה תוך" + ((new Date().valueOf() - before.valueOf()) / 1000).toFixed(1) + " שניות");
                            this.args.afterUpload();
                        }
                        catch {

                        }
                        this.matDialog.close();
                    }
                    img.src = e.target.result.toString();



                };
                fileReader.readAsDataURL(f);
            });
            return;//to import the first file only
        }
    }


    ngOnInit() {
    }
}

