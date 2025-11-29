import { Component, OnInit } from '@angular/core';

interface Sticker {
  index: number;
  productCode: string;
  stickerCode: string;
  batch: string;
}

@Component({
  selector: 'app-sticker-page',
  templateUrl: './sticker-page.component.html',
  styleUrls: ['./sticker-page.component.scss']
})
export class StickerPageComponent implements OnInit {


  stickers: Sticker[] = [];
  qrData = "https://hianime.do";

  ngOnInit(): void {
    this.stickers = Array.from({ length: 40 }, (_, i) => {
      const index = i + 1;
      return {
        index,
        productCode: `PROD-${index.toString().padStart(2, '0')}`,
        stickerCode: `STK-${index.toString().padStart(4, '0')}`,
        batch: index <= 10 ? 'A' : index <= 20 ? 'B' : index <= 30 ? 'C' : 'D',
      };
    });
  }

  printStickers(): void {
    window.print();
  }
}
