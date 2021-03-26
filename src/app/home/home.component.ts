import { Component, OnInit } from '@angular/core';
import { ServerFunction } from '@remult/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

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
            this.img = dataurl;
            let before = new Date();
            await HomeComponent.upload(dataurl);
            this.res = {
              compressed: dataurl.length,
              original: e.target.result.toString().length,
              ratio: dataurl.length / e.target.result.toString().length,
              duration: new Date().valueOf() - before.valueOf()
            }



          }
          img.src = e.target.result.toString();



        };
        fileReader.readAsDataURL(f);
      });
      return;//to import the first file only
    }
  }
  img: string;
  res: {};

  @ServerFunction({ allowed: true })
  static async upload(data: string) {
    console.log(data.length);

  }
  ngOnInit() {
  }
}

