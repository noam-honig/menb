import { Component, OnInit } from '@angular/core';
import { BottleImages, Bottles } from '../bottles/bottles';
import { Context } from '@remult/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UploadImageComponent } from '../bottles/upload-image.component';
import { openDialog, DataAreaSettings } from '@remult/angular';

@Component({
  selector: 'app-bottle-info',
  templateUrl: './bottle-info.component.html',
  styleUrls: ['./bottle-info.component.scss']
})
export class BottleInfoComponent implements OnInit {

  constructor(private dialog: MatDialogRef<any>, private context: Context) {
    dialog.afterClosed().subscribe(() => {
      if (this.saved)
        this.args.bottle.undoChanges();
    });
  }
  args: {
    bottle: Bottles
  }
  images: BottleImages[] = [];
  imageIndex = 0;
  get image() {
    if (this.images.length == 0) {
      this.images.push(this.args.bottle.images.create());
      this.imageIndex = 0;
    }
    return this.images[this.imageIndex];
  }
  back() {
    if (this.imageIndex > 0)
      this.imageIndex--;
  }
  next() {
    if (this.imageIndex < this.images.length - 1) {
      this.imageIndex++;
    }
  }
  addAPhoto() {
    this.images.push(this.args.bottle.images.create());
    this.imageIndex = this.images.length - 1;
    this.image.num.value = this.images.length;
  }
  deletePhoto() {
    this.toDeleteImages.push(this.image);
    this.images = this.images.filter(x => x != this.image);
    if (this.imageIndex >= this.images.length)
      this.imageIndex = this.images.length - 1;
  }
  toDeleteImages: BottleImages[]=[];
  rightArea: DataAreaSettings;
  leftArea: DataAreaSettings;
  bottomArea: DataAreaSettings;
  ngOnInit() {
    let b = this.args.bottle;
    this.rightArea = new DataAreaSettings({
      columnSettings: () => [
        b.country,
        b.name,
        b.manufacturer,
        b.comments,
        [b.bottleType, b.shape],
        b.shapeComments,
        [b.alcohol, b.volume],


      ]
    });
    this.leftArea = new DataAreaSettings({
      columnSettings: () => [


        [b.type,
        b.subType],
        b.quantity,


      ]
    });
    this.bottomArea = new DataAreaSettings({
      columnSettings: () => [

        b.state,
        b.location,
        [b.entryDate, b.origin],
        [b.cost, b.worth],
        [b.exitDate, b.exitReason]

      ]
    });
    if (!this.args.bottle.isNew()) {
      this.args.bottle.reload();
      this.args.bottle.images.reload().then(x => {
        this.images = x;
      });
    }
  }

  saved = false;
  async save() {
    await this.args.bottle.save();
    for (const i of this.images) {
      if (i.image.wasChanged()) {
        i.bottleId.value = this.args.bottle.id.value;
        await i.save();
        this.saved = true;
      }
    }
    for (const i of this.toDeleteImages) {
      await i.delete();
    }
    this.dialog.close();
  }
  close() {
    this.dialog.close();
  }
  async upload() {
    if (this.args.bottle.isNew())
      await this.args.bottle.save();
    await openDialog(UploadImageComponent, x => x.args = {
      bottleId: this.args.bottle.id.value
      ,
      afterUpload: (image, fileName) => {
        this.image.image.value = image;
        this.image.fileName.value = fileName;
      }
    });
  }
  openImage() {
    if (this.image.image.value) {
      var image = new Image();
      image.src = this.image.image.value;;
      image.style.width='100%';

      var w = window.open("");
      w.document.write(image.outerHTML);
    }
  }
  async dropFile(e: DragEvent) {

    e.preventDefault();
    e.stopPropagation();
    this.inDrag = false;
    await this.loadFiles(e.dataTransfer.files);

  }
  private async loadFiles(files: any) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      let f: File = file;
      await new Promise((res) => {
        var fileReader = new FileReader();

        fileReader.onload = async (e: any) => {
          this.image.image.value = e.target.result.toString();
          this.image.fileName.value = f.name;
          res({});

        };
        fileReader.readAsDataURL(f);
      });
    }
  }

  onFileInput(e: any) {
    this.loadFiles(e.target.files);
  }
  dragEnter(e: DragEvent) {
    this.inDrag = true;
    this.preventDefault(e);

  }
  dragLeave(e: DragEvent) {
    this.inDrag = false;
    this.preventDefault(e);


  }
  inDrag = false;
  preventDefault(eventArgs: any) {
    eventArgs.preventDefault();
    eventArgs.stopPropagation();

  }

}
