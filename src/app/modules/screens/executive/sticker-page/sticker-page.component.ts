import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';


@Component({
  selector: 'app-sticker-page',
  templateUrl: './sticker-page.component.html',
  styleUrls: ['./sticker-page.component.scss']
})
export class StickerPageComponent implements OnInit {

  products: any;

  constructor(public location: Location, private router: Router, private api: ApiService) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.products = state?.['product'];
    // if (!this.products) router.navigate(['projects/bom']);
  }


  stickers: any = [];
  qrData = "https://hianime.do";

  ngOnInit(): void {

    console.log(this.products);

    const bomIds = this.products?.map((product: any) => product.bomId);

    console.log(bomIds);
    this.fetchStickers(bomIds);
  }

  fetchStickers(bomIds: any) {

    // cosnt payload = this.product

    this.api.post(`stickers/boms/multiple`, { bom_ids: bomIds }).pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          console.log(response);

          this.generateStickers(response.data?.all_stickers)
          // this.snackbar.openSnackbar('Product created successfully', 'success');
        },
        error: (error) => {
          console.log(error);
          // this.snackbar.openSnackbar(error.message, 'error');
        }
      });
  }

  generateStickers(stickers: any) {
    this.stickers = stickers.map((sticker: any) => {
      return {
        projectName: sticker.project_name,
        description: sticker.description,
        specification: sticker.specification,
        section: sticker.section,
        moc: sticker.moc,
        quantity: sticker.total,
        qrData: `{"stickerId": ${sticker.sticker_id}, "seq": ${sticker.seq}}`,
      };
    })
  }

  printStickers(): void {
    window.print();
  }
}
