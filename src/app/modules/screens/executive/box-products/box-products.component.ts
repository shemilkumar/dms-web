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
      invoice: { invoiceNo = '', invoiceDate = '' } = {},
      customer: { title: customerTitle = '', address: customerAddress = '' } = {},
      poDetails: { poNo = '', vehicleNo = '' } = {},
      fileName = `package-list-${new Date().toISOString().slice(0, 10)}.xlsx`,
    } = options;

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    function applyBorder(
      sheet: ExcelJS.Worksheet,
      startRow: number,
      startCol: number,
      endRow: number,
      endCol: number,
      border: Partial<ExcelJS.Borders>
    ) {
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          sheet.getCell(r, c).border = border;
        }
      }
    }


    if (!packageListData?.length) return;

    const columns = [
      { key: 'sl', width: 6 },
      { key: 'description', width: 30 },
      { key: 'spec', width: 20 },
      { key: 'moc', width: 7.5 },
      { key: 'quantity', width: 5 },
      { key: 'uom', width: 9.5 },
      { key: 'remarks', width: 17 },
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
    applyBorder(sheet, currentRow, 1, currentRow, columns.length, thinBorder);
    sheet.getCell(currentRow, 1).value = 'PACKING LIST';
    sheet.getCell(currentRow, 1).font = { bold: true, size: 16 };
    sheet.getCell(currentRow, 1).alignment = { horizontal: 'center' };
    sheet.getRow(currentRow).height = 28;
    currentRow++;

    /* ================= COMPANY + INVOICE ================= */

    // -------- COMPANY NAME & ADDRESS (COL 1 → 4, TWO ROWS) --------
    sheet.mergeCells(currentRow, 1, currentRow + 1, 4);
    applyBorder(sheet, currentRow, 1, currentRow + 1, 4, thinBorder);

    sheet.getCell(currentRow, 1).value = {
      richText: [
        {
          text: companyName + '\n\n',
          font: { bold: true, size: 12, color: { argb: 'FF008000' } }
        },
        {
          text: companyAddress,
          font: { size: 11 }
        }
      ],
    };

    sheet.getCell(currentRow, 1).alignment = {
      wrapText: true,
      vertical: 'top',
      horizontal: 'left'
    };

    sheet.getRow(currentRow).height = 40;
    sheet.getRow(currentRow + 1).height = 40;

    // -------- INVOICE NO (ROW 1) --------
    sheet.mergeCells(currentRow, 5, currentRow, 6);
    applyBorder(sheet, currentRow, 5, currentRow, 6, thinBorder);

    sheet.getCell(currentRow, 5).value = 'Invoice No';
    sheet.getCell(currentRow, 5).font = { bold: true };
    sheet.getCell(currentRow, 5).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    // Label (LAST COLUMN)
    sheet.getCell(currentRow, 7).value = invoiceNo || 'NA';
    sheet.getCell(currentRow, 7).font = { bold: true };
    sheet.getCell(currentRow, 7).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    applyBorder(sheet, currentRow, 7, currentRow, 7, thinBorder);

    // -------- INVOICE DATE (ROW 2) --------
    sheet.mergeCells(currentRow + 1, 5, currentRow + 1, 6);
    applyBorder(sheet, currentRow + 1, 5, currentRow + 1, 6, thinBorder);

    sheet.getCell(currentRow + 1, 5).value = 'Invoice Date';
    sheet.getCell(currentRow + 1, 5).font = { bold: true };
    sheet.getCell(currentRow + 1, 5).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    // Label (LAST COLUMN)
    sheet.getCell(currentRow + 1, 7).value = invoiceDate || 'NA';
    sheet.getCell(currentRow + 1, 7).font = { bold: true };
    sheet.getCell(currentRow + 1, 7).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    applyBorder(sheet, currentRow + 1, 7, currentRow + 1, 7, thinBorder);

    // Move cursor
    currentRow += 2;

    /* ================= CUSTOMER ================= */

    // Title row
    sheet.mergeCells(currentRow, 1, currentRow, columns.length);
    sheet.getCell(currentRow, 1).value = 'CUSTOMER NAME & ADDRESS';
    sheet.getCell(currentRow, 1).alignment = { vertical: 'middle' };
    sheet.getCell(currentRow, 1).font = { bold: true, size: 10 };
    sheet.getRow(currentRow).height = 20;
    applyBorder(sheet, currentRow, 1, currentRow, columns.length, thinBorder);
    currentRow++;

    // -------- CUSTOMER ADDRESS (COL 1 → 4, TWO ROWS) --------
    sheet.mergeCells(currentRow, 1, currentRow + 1, 4);
    applyBorder(sheet, currentRow, 1, currentRow + 1, 4, thinBorder);

    sheet.getCell(currentRow, 1).value = `${customerTitle}\n${customerAddress}`;
    sheet.getCell(currentRow, 1).alignment = {
      wrapText: true,
      vertical: 'top',
      horizontal: 'left'
    };

    sheet.getRow(currentRow).height = 40;
    sheet.getRow(currentRow + 1).height = 40;

    // -------- PO NO (ROW 1) --------
    sheet.mergeCells(currentRow, 5, currentRow, 6);
    applyBorder(sheet, currentRow, 5, currentRow, 6, thinBorder);

    sheet.getCell(currentRow, 5).value = 'PO No';
    sheet.getCell(currentRow, 5).font = { bold: true };
    sheet.getCell(currentRow, 5).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    // PO label (LAST COLUMN)
    sheet.getCell(currentRow, 7).value = poNo || 'NA';
    sheet.getCell(currentRow, 7).font = { bold: true };
    sheet.getCell(currentRow, 7).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    applyBorder(sheet, currentRow, 7, currentRow, 7, thinBorder);

    // -------- VEHICLE NO (ROW 2) --------
    sheet.mergeCells(currentRow + 1, 5, currentRow + 1, 6);
    applyBorder(sheet, currentRow + 1, 5, currentRow + 1, 6, thinBorder);

    sheet.getCell(currentRow + 1, 5).value = 'Vehicle No';
    sheet.getCell(currentRow + 1, 5).font = { bold: true };
    sheet.getCell(currentRow + 1, 5).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    // Vehicle label (LAST COLUMN)
    sheet.getCell(currentRow + 1, 7).value = vehicleNo || 'NA';
    sheet.getCell(currentRow + 1, 7).font = { bold: true };
    sheet.getCell(currentRow + 1, 7).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    applyBorder(sheet, currentRow + 1, 7, currentRow + 1, 7, thinBorder);

    // Move cursor
    currentRow += 2;

    /* ================= TABLE HEADER ================= */
    currentRow++;

    const headerRowIndex = currentRow;
    const headers = ['', 'Description', 'Specification', 'MOC', 'Qty', 'UOM', 'Remarks'];

    headers.forEach((h, i) => {
      const c = sheet.getRow(headerRowIndex).getCell(i + 1);
      c.value = h;
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      c.alignment = { horizontal: 'center', vertical: 'middle' };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF008000' } };
      c.border = thinBorder;
    });

    sheet.getRow(headerRowIndex).height = 24;
    currentRow++;

    /* ================= TABLE BODY ================= */
    packageListData.forEach((row, i) => {
      const excelRow = sheet.getRow(currentRow + i);

      excelRow.getCell(1).value = i + 1;
      excelRow.getCell(2).value = row.description || '';
      excelRow.getCell(3).value = row.specification || '';
      excelRow.getCell(4).value = row.moc || '';
      excelRow.getCell(5).value = row.quantity ?? '';
      excelRow.getCell(6).value = row.uom || '';
      excelRow.getCell(7).value = row.remarks || '';

      // 🔥 APPLY STYLE TO EACH CELL
      for (let col = 1; col <= columns.length; col++) {
        const cell = excelRow.getCell(col);

        cell.border = thinBorder;
        cell.alignment = {
          wrapText: true,
          vertical: 'top',
          horizontal: col === 2 || col === 3 ? 'left' : 'center',
        };
      }

      // Good print height
      excelRow.height = 22;
    });

    currentRow += packageListData.length + 1;

    /* ================= SIGNATURE ================= */
    sheet.mergeCells(currentRow, 1, currentRow, columns.length);
    applyBorder(sheet, currentRow, 1, currentRow, columns.length, thinBorder);
    sheet.getCell(currentRow, 1).value = {
      richText: [
        { text: 'For ', font: { bold: true } },
        { text: companyName, font: { bold: true, color: { argb: 'FF008000' } } },
        { text: '\n\nAuthorised Signatory', font: { bold: true } },
      ],
    };
    sheet.getCell(currentRow, 1).alignment = { horizontal: 'right', wrapText: true };
    sheet.getRow(currentRow).height = 60;
    currentRow++;

    /* ================= FOOTER ADDRESS (OPTIONAL) ================= */
    if (showHeaderFooter) {
      sheet.mergeCells(currentRow, 1, currentRow, columns.length);
      applyBorder(sheet, currentRow, 1, currentRow, columns.length, thinBorder);

      sheet.getCell(currentRow, 1).value = companyAddress;
      sheet.getCell(currentRow, 1).font = { size: 8 };
      sheet.getCell(currentRow, 1).alignment = { horizontal: 'center', wrapText: true };
      sheet.getRow(currentRow).height = 40;
    }

    /* ================= GLOBAL FONT SIZE (PRINT SAFE) ================= */
    sheet.properties.defaultRowHeight = 18;

    sheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // do not override cells where you explicitly set a different size
        if (!cell.font?.size) {
          cell.font = { ...(cell.font || {}), size: 9 };
        }
      });
    });

    /* ================= PRINT SETUP (CRITICAL) ================= */
    (sheet as any).pageSetup = {
      paperSize: 9,        // A4
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    // (sheet as any).pageSetup = {
    //   paperSize: 9,
    //   orientation: 'landscape',
    //   scale: 90,
    // };

    (sheet as any).pageMargins = {
      left: 0.5,
      right: 0.5,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };

    (sheet as any).printTitlesRow = `${headerRowIndex}:${headerRowIndex}`;

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
