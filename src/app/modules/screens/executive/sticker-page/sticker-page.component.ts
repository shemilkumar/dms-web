import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-sticker-page',
  templateUrl: './sticker-page.component.html',
  styleUrls: ['./sticker-page.component.scss']
})
export class StickerPageComponent implements OnInit {

  @ViewChild('printContainer') printContainer!: ElementRef;

  products: any;
  stickers: any[] = [];
  stickerPerPage = 10;

  constructor(
    public location: Location,
    private router: Router,
    private api: ApiService
  ) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.products = state?.['product'];
    // if (!this.products) router.navigate(['projects/bom']);
  }
  pagedStickers: any[] = [];


  ngOnInit(): void {
    const bomIds = this.products?.map((product: any) => product.bomId);
    // this.fetchStickers(bomIds);
    this.generateStickers(this.dummyData);

    this.pagedStickers = this.chunkArray(this.stickers, this.stickerPerPage);
    console.log(this.pagedStickers);
  }

  dummyData = [
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-58fb3194-f383-4da9-96b0-a7aa4fd2684a",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "1/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-2b00f810-8d58-4e31-b247-780fe6cddbcc",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "2/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-fe22af78-7d52-4e93-a8c6-bbb874514e5c",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "3/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-203190fa-7ead-4ac9-b030-13fbda338c05",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "4/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-06557fa1-e410-4583-b9c6-3a951d01dde3",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "5/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-9b640f2e-1856-43d6-b345-52f9e86055a2",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "6/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-3504ea1f-9307-42e2-8455-1c6f1bfa2695",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "7/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-0e6006b8-e948-4fb6-9ecf-cc03fe803fd9",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "8/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-77a4fc62-0d53-42ca-8d6b-d3caf95d1296",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "9/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-4bb58c7a-8116-4881-bfbd-97a3ce886504",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "10/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-e26eed5d-377d-4c09-bde1-04c6e1ca0875",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "11/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-e08f53d5-ae9e-432b-a6c7-36f173a02bf3",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "12/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-eff3dea1-5a79-453f-9d69-7ea4209ede93",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "13/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-6693bcad-3201-45c9-8b87-0842ecd18866",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "14/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-e50617fe-18b8-4eec-90f8-9c0d185a8cd4",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "15/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-57836a42-a537-4b48-932d-59f7f4f3f659",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "16/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-a4fc9dcd-650e-4cd1-b7e9-9cad7aa9f42b",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "17/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-e04bd524-4384-42f5-8a26-82ecd01bd515",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "18/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-404b8dd7-3111-4e5a-b050-c3871b587d2e",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "19/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-8a606a75-eb94-4711-b057-3835c650c246",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "20/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-90f80e99-023b-4d56-8ca8-8b453d3f741a",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "21/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-78a082ab-3014-4845-a6b9-b7273e96d60c",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "22/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-82c8b42d-5d66-47db-b582-c1b69625f079",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "23/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-8dae0ce7-0134-4cca-88c6-09301c020b97",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "24/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-8d7dbbdb-7f23-400a-b527-dfc112d690da",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "25/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-e97a40ba-16c7-441f-afa9-621fdba2b783",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "26/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-4c0ba06c-bec7-40b0-9bac-41ef83dd29de",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "27/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-4cc96a78-02d4-4d80-ac43-27265769d5fe",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "28/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-abfa37f3-940f-4f94-a547-a42fdaf2ce57",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "29/30"
    },
    {
      "project_id": "PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a",
      "bom_id": "BOM-dc4a2bce-1829-471b-bf04-bdf27b96789e",
      "sticker_id": "STK-562862b7-9996-4fb7-b8e7-12bf507ce285",
      "project_name": "Project Check ",
      "description": "Bend 90°",
      "specification": "Ø80_R120_1thk",
      "section": "Section 10",
      "moc": "AF",
      "page_no": "M4",
      "seq_label": "30/30"
    }
  ]


  fetchStickers(bomIds: any) {
    this.api.post(`stickers/boms/multiple`, { bom_ids: bomIds })
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.generateStickers(response.data?.all_stickers);
        },
        error: (error) => {
          console.log(error);
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
      quantity: sticker.total,
      stcikerId: sticker.sticker_id,
      qrData: sticker.sticker_id
    }));
  }

  chunkArray<T>(data: T[], chunkSize: number): T[][] {
    const result: T[][] = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }

    return result;
  }

  async downloadStickersPdf(): Promise<void> {
    if (!this.printContainer) return;

    const element = this.printContainer.nativeElement as HTMLElement;

    // Make sure layout is stable before capture
    await new Promise(requestAnimationFrame);

    const canvas = await html2canvas(element, {
      scale: 3,              // higher scale = sharper (important for QR)
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');  // A4 portrait
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = (pdf as any).getImageProperties(imgData);

    // Compute best fit ratio so the WHOLE sheet fits on one page
    const ratio = Math.min(
      pdfWidth / imgProps.width,
      pdfHeight / imgProps.height
    );

    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    const x = (pdfWidth - imgWidth) / 2;   // center horizontally
    const y = (pdfHeight - imgHeight) / 2; // center vertically (optional)

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    pdf.save('stickers.pdf');

    // After successful PDF generation -> call your "printed" API if needed
    // this.api.post('stickers/mark-printed', { bom_ids: ... }).subscribe();
  }


}
