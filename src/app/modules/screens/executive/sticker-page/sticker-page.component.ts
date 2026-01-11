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

    try {
      const sheets = this.sheetRefs.toArray();
      if (!sheets.length) return;

      // Use compress: true to reduce internal PDF size
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < sheets.length; i++) {
        const sheetEl = sheets[i].nativeElement;

        // html2canvas is memory intensive. Scale 1.5 is a good balance for quality and performance
        const canvas = await html2canvas(sheetEl, {
          scale: 1.5,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false, // Disable logging to save some resources
          removeContainer: true
        });

        // Use JPEG instead of PNG for significantly smaller file size
        // 0.75-0.80 quality is usually plenty for QR codes and text
        const imgData = canvas.toDataURL('image/jpeg', 0.75);

        if (i > 0) pdf.addPage();

        pdf.addImage(
          imgData,
          'JPEG',
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          'FAST'
        );

        // Memory cleanup: help garbage collector by clearing references
        // We can't explicitly force GC, but clearing references helps
        canvas.width = 0;
        canvas.height = 0;

        // Give the browser a moment to breathe every few pages to prevent UI freezing
        // and allow memory management to take place
        if (i % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      await this.savePdfAsync(pdf, 'stickers.pdf');
      this.markAsPrinted();
    } catch (error) {
      console.error('PDF Generation Error:', error);
    } finally {
      this.isDownloading = false;
    }
  }

  private savePdfAsync(pdf: jsPDF, filename: string): Promise<void> {
    return new Promise((resolve) => {
      pdf.save(filename);
      // Wait a bit to ensure the save process is initiated before resolving
      setTimeout(() => resolve(), 500);
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