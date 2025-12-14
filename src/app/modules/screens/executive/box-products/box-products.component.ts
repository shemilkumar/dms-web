import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { PPTableConfig, TableState } from 'src/app/modules/base/pp/_models/pp-column.model';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
// import * as XLSX from 'xlsx-js-style';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { logoBase64 } from 'src/environments/logoBase64';
import { apiResponseToExportOptions, ExportOptions } from 'src/environments/responseToExportExcelOptions';

// TABLE ROW
export type PackageRow = {
  slNo?: number;                // optional but useful for export ordering
  description?: string;
  specification?: string;
  moc?: string;
  quantity?: number | string;
  uom?: string;
  remarks?: string;
};


@Component({
  selector: 'app-box-products',
  templateUrl: './box-products.component.html',
  styleUrls: ['./box-products.component.scss']
})
export class BoxProductsComponent {

  box: any = {};
  isLoading: boolean = false;
  packageList$: Observable<any> = of([]);
  private packageListData: any[] = []; // keep raw data for export

  constructor(
    public location: Location,
    private router: Router,
    private api: ApiService,
    private snackbar: SnackbarService
  ) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.box = state?.['box'];
    if (!this.box) router.navigate(['home/box']);
  }

  config: PPTableConfig = {
    id: 'package-list-table',
    rowSelectEnabled: false,
    actions: {
      header: {
        class: ['flex', 'items-center', 'justify-end'],
      },
      show: true,
      headerLabel: 'gg',
      class: ['flex', 'items-center', 'justify-end'],
    },
    page: {
      pageSize: 10,
      pageIndex: 0,
      length: 10,
    },
    paginator: {
      hide: true,
      offline: false,
    },
    sort: {
      active: 'name',
      direction: 'asc',
    },
    translateKey: 'package-list-table',
    translate: true,
    tableState: TableState.DEFAULT,
  };

  columns = [
    {
      id: 'description',
      label: 'Description',
      headerClass: ['text-start'],
      sortable: false,
      cellClass: [],
      // style: "max-width: 450px; width: 450px;",
    },
    {
      id: 'specification',
      label: 'Specification',
      headerClass: ['text-start'],
      sortable: false,
      cellClass: [],
    },
    {
      id: 'moc',
      label: 'MOC',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'section',
      label: 'Section',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'uom',
      label: 'UOM',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'quantity',
      label: 'Quantity',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'dispatchedStickers',
      label: 'Dispatched Stickers',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'pendingStickers',
      label: 'Pending Stickers',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'action-buttons',
      label: '',
      headerClass: ['text-start'],
      sortable: false,
      cellClass: ['fw-bold', 'font-size-16'],
      // style: "width: 25%",
    },
  ];

  headerData: any = {};

  ngOnInit(): void {
    if (!this.box) return;

    this.headerData = {
      title: this.box.boxName,
      showBackButton: true,
      backButtonLink: 'home/box'
    }
    this.fetchPackageList();
  }

  packageListResponse: any;

  fetchPackageList(searchText: string = '') {
    this.isLoading = true;

    this.config.tableState = TableState.LOADING;

    let url = `stickers/package/${this.box.boxId}/package-list`;

    this.packageList$ = this.api.get(url).pipe(
      tap((response) => this.packageListResponse = response),
      map((res: any) => {
        const items = res.data?.package_list || [];

        const mapped = items.map((item: any) => ({
          description: item.description,
          specification: item.specification,
          moc: item.moc,
          section: item.section,
          uom: item.uom,
          quantity: item.quantity,
          dispatchedStickers: item.dispatched_stickers,
          pendingStickers: item.pending_stickers,
        }));

        this.packageListData = mapped;

        return mapped;
      }),
      tap(items => {
        if (items.length === 0) {
          this.config.tableState = TableState.NO_DATA;
        } else {
          this.config.tableState = TableState.SUCCESS;
        }
      }),
      catchError(err => {
        console.error(err);
        this.config.tableState = TableState.FAILURE;
        return of([]);
      }))
  }

  isExporting: boolean = false;

  companyName: string = 'COMPANY NAME';
  companyTagline: string = 'COMPANY TAGLINE';
  companyAddress: string = 'COMPANY ADDRESS';


  exportToExcel(from: 'direct' | 'customer') {

    this.close();

    const options = apiResponseToExportOptions(this.packageListResponse, {
      fileName: 'package-list-example.xlsx',
      companyLogoDataUri: logoBase64,
      showHeaderFooter: from === 'direct'
    });

    this.exportPackageListExcel(options);
  }

  async exportPackageListExcel(options: ExportOptions) {
    const {
      packageListData,

      meta: {
        companyName = '',
        companyAddress = '',
        companyLogoDataUri = '',
        showHeaderFooter = true,
      } = {},

      invoice: {
        invoiceNo = '',
        invoiceDate = '',
      } = {},

      customer: {
        title: customerTitle = '',
        address: customerAddress = '',
      } = {},

      poDetails: {
        poNo = '',
        vehicleNo = '',
      } = {},

      fileName = `package-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    } = options;

    if (!packageListData?.length) return;

    const columns = [
      { key: 'sl', width: 6 },
      { key: 'description', width: 50 },
      { key: 'specification', width: 34 },
      { key: 'moc', width: 20 },
      { key: 'quantity', width: 10 },
      { key: 'uom', width: 8 },
      { key: 'remarks', width: 28 },
    ];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Packing List');
    sheet.columns = columns;

    let currentRow = 1;

    /* ================= LOGO (OPTIONAL) ================= */
    if (showHeaderFooter && companyLogoDataUri) {
      const imageId = workbook.addImage({
        base64: companyLogoDataUri,
        extension: 'png',
      });

      sheet.mergeCells(currentRow, 1, currentRow, columns.length);
      sheet.getRow(currentRow).height = 100;

      sheet.addImage(imageId, {
        tl: { col: 1.8, row: currentRow - 1 },
        ext: { width: 650, height: 90 },
      } as any);

      currentRow++;
    }

    /* ================= TITLE ================= */
    sheet.mergeCells(currentRow, 1, currentRow, columns.length);
    sheet.getCell(currentRow, 1).value = 'PACKING LIST';
    sheet.getCell(currentRow, 1).font = { bold: true, size: 16 };
    sheet.getCell(currentRow, 1).alignment = { horizontal: 'center' };
    sheet.getRow(currentRow).height = 28;
    currentRow++;

    /* ================= COMPANY + INVOICE ================= */
    sheet.mergeCells(currentRow, 1, currentRow + 1, 3);
    sheet.getCell(currentRow, 1).value = {
      richText: [
        { text: companyName + '\n\n', font: { size: 12, bold: true, color: { argb: 'FF008000' } } },
        { text: companyAddress, font: { size: 11 } },
      ],
    };
    sheet.getCell(currentRow, 1).alignment = { wrapText: true, vertical: 'top' };
    sheet.getRow(currentRow).height = 50;
    sheet.getRow(currentRow + 1).height = 50;

    sheet.getCell(currentRow, 4).value = 'Invoice No';
    sheet.getCell(currentRow, 4).font = { bold: true };
    sheet.getCell(currentRow, 4).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.mergeCells(currentRow, 5, currentRow, columns.length);
    sheet.getCell(currentRow, 5).value = invoiceNo;
    sheet.getCell(currentRow, 5).font = { bold: true };
    sheet.getCell(currentRow, 5).alignment = { vertical: 'middle', horizontal: 'center' };


    sheet.getCell(currentRow + 1, 4).value = 'Invoice Date';
    sheet.getCell(currentRow + 1, 4).font = { bold: true };
    sheet.getCell(currentRow + 1, 4).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.mergeCells(currentRow + 1, 5, currentRow + 1, columns.length);
    sheet.getCell(currentRow + 1, 5).value = invoiceDate;
    sheet.getCell(currentRow + 1, 5).font = { bold: true };
    sheet.getCell(currentRow + 1, 5).alignment = { vertical: 'middle', horizontal: 'center' };


    currentRow += 2;

    /* ================= CUSTOMER ================= */
    sheet.mergeCells(currentRow, 1, currentRow, columns.length);
    sheet.getCell(currentRow, 1).value = 'CUSTOMER NAME & ADDRESS';
    sheet.getCell(currentRow, 1).alignment = { vertical: 'middle' };
    sheet.getCell(currentRow, 1).font = { bold: true, size: 10 };
    sheet.getRow(currentRow).height = 30;
    currentRow++;

    sheet.mergeCells(currentRow, 1, currentRow + 1, 3);
    sheet.getCell(currentRow, 1).value = `${customerTitle}\n${customerAddress}`;
    sheet.getCell(currentRow, 1).alignment = { wrapText: true, vertical: 'top' };
    sheet.getRow(currentRow).height = 50;
    sheet.getRow(currentRow + 1).height = 50;

    sheet.getCell(currentRow, 4).value = 'PO No';
    sheet.getCell(currentRow, 4).font = { bold: true };
    sheet.getCell(currentRow, 4).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.mergeCells(currentRow, 5, currentRow, columns.length);
    sheet.getCell(currentRow, 5).value = poNo || 'NA';
    sheet.getCell(currentRow, 5).font = { bold: true };
    sheet.getCell(currentRow, 5).alignment = { vertical: 'middle', horizontal: 'center' };


    sheet.getCell(currentRow + 1, 4).value = 'Vehicle No';
    sheet.getCell(currentRow + 1, 4).font = { bold: true };
    sheet.getCell(currentRow + 1, 4).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.mergeCells(currentRow + 1, 5, currentRow + 1, columns.length);
    sheet.getCell(currentRow + 1, 5).value = vehicleNo;
    sheet.getCell(currentRow + 1, 5).font = { bold: true };
    sheet.getCell(currentRow + 1, 5).alignment = { vertical: 'middle', horizontal: 'center' };


    currentRow += 2;

    /* ================= TABLE HEADER ================= */
    currentRow++;
    const headers = ['', 'Description', 'Specification', 'MOC', 'Qty', 'UOM', 'Remarks'];
    headers.forEach((h, i) => {
      const c = sheet.getRow(currentRow).getCell(i + 1);
      c.value = h;
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      c.alignment = { horizontal: 'center' };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF008000' } };
    });
    sheet.getRow(currentRow).height = 24;
    currentRow++;

    /* ================= TABLE BODY ================= */
    packageListData.forEach((row, i) => {
      const r = sheet.getRow(currentRow + i);
      r.values = [
        i + 1,
        row.description,
        row.specification,
        row.moc,
        row.quantity,
        row.uom,
        row.remarks,
      ];
      r.height = 20;
    });

    currentRow += packageListData.length + 1;

    /* ================= SIGNATURE ================= */
    sheet.mergeCells(currentRow, 1, currentRow, columns.length);
    sheet.getCell(currentRow, 1).value = {
      richText: [
        { text: 'For ', font: { bold: true } },
        { text: companyName, font: { bold: true, color: { argb: 'FF008000' } } },
        { text: '\n\nAuthorised Signatory', font: { bold: true } },
      ],
    };
    sheet.getCell(currentRow, 1).alignment = { horizontal: 'right', wrapText: true };
    sheet.getRow(currentRow).height = 96;
    currentRow++;

    /* ================= FOOTER ADDRESS (OPTIONAL) ================= */
    if (showHeaderFooter) {
      sheet.mergeCells(currentRow, 1, currentRow, columns.length);
      sheet.getCell(currentRow, 1).value = companyAddress;
      sheet.getCell(currentRow, 1).font = { size: 8 };
      sheet.getCell(currentRow, 1).alignment = { horizontal: 'center', wrapText: true };
      sheet.getRow(currentRow).height = 40;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
  }


  open = false;

  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  exportDirect() {
    this.close();
    console.log('Export: Direct Package List (Excel)');
    // exportPackageListExcel({ directPackageList: true })
  }

  exportCustomer() {
    this.close();
    console.log('Export: Customer Package List (Excel)');
    // exportPackageListExcel({ directPackageList: false })
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('.export-wrapper')) {
      this.close();
    }
  }

}
