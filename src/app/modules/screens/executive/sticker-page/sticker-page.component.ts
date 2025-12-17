import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';

interface Sticker {
  id: number;
  projectName: string;
  description: string;
  specification: string;
  section: string;
  moc: string;
  quantity: number;
  qrData: string;
}

@Component({
  selector: 'app-sticker-page',
  templateUrl: './sticker-page.component.html',
  styleUrls: ['./sticker-page.component.scss']
})
export class StickerPageComponent implements OnInit {

  stickerPerPage = 48;
  stickers: any[] = [];
  pagedStickers: any[][] = [];
  products: any;

  constructor(
    public location: Location,
    private router: Router,
    private api: ApiService
  ) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.products = state?.['products'];
    if (!this.products) router.navigate(['home/bom']);
  }

  @ViewChildren('sheetRef') sheetRefs!: QueryList<ElementRef<HTMLDivElement>>;

  headerData = {};
  bomIds: any[] = [];
  isError: boolean = false

  project: any;

  ngOnInit(): void {

    const projectData = localStorage.getItem('project');
    this.project = projectData ? JSON.parse(projectData) : undefined;
    if (!this.project) this.router.navigateByUrl('/home');

    this.bomIds = this.products?.map((product: any) => product.bomId);
    this.fetchStickers(this.bomIds);

    this.headerData = {
      title: 'Preview Stickers',
      showBackButton: true,
      backButtonLink: 'home/bom'
    }
  }

  isStickerGenerating: boolean = true;

  fetchStickers(bomIds: any) {
    this.isStickerGenerating = true;

    this.api.post(`stickers/boms/multiple`, { bom_ids: bomIds })
      .pipe(finalize(() => { this.isStickerGenerating = false }))
      .subscribe({
        next: (response: any) => {
          this.isError = false;
          this.generateStickers(response.data?.all_stickers);
          this.pagedStickers = this.chunkArray(this.stickers, this.stickerPerPage);
        },
        error: (error) => {
          this.isError = true;
        }
      });
  }

  generateStickers(stickers: any) {
    this.stickers = stickers.map((sticker: any) => ({
      projectName: sticker.project_name,
      description: sticker.description,
      specification: sticker.specification,
      section: sticker.section,
      moc: sticker.moc,
      // quantity: sticker.total,
      stcikerId: sticker.sticker_id,
      qrData: sticker.sticker_id,
      seqLabel: sticker.seq_label,
    }));
  }


  private chunkArray<T>(data: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  }

  isDownloading: boolean = false;

  async downloadStickersPdf(): Promise<void> {
    this.isDownloading = true;

    const sheets = this.sheetRefs.toArray();
    if (!sheets.length) return;

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Hide toolbar during capture
    // document.body.classList.add('print-mode');

    for (let i = 0; i < sheets.length; i++) {
      const sheetEl = sheets[i].nativeElement;

      const canvas = await html2canvas(sheetEl, {
        scale: 2,          // sharp output
        backgroundColor: '#ffffff',
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (i > 0) pdf.addPage();

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pageWidth,
        pageHeight
      );
    }

    // document.body.classList.remove('print-mode');

    await this.savePdfAsync(pdf, 'stickers.pdf');

    this.isDownloading = false;

    this.markAsPrinted();
  }

  private savePdfAsync(pdf: jsPDF, filename: string): Promise<void> {
    return new Promise((resolve) => {
      pdf.save(filename);
      setTimeout(() => resolve(), 300);
    });
  }

  markAsPrinted() {
    this.api.post(`boms/mark-printed`, { bom_ids: this.bomIds })
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }
}