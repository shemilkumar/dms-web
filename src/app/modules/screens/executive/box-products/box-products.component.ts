import { Location } from '@angular/common';
import { Component } from '@angular/core';
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


  exportToExcel() {

    const options = apiResponseToExportOptions(this.packageListResponse, {
      fileName: 'package-list-example.xlsx',
      companyLogoDataUri: logoBase64,
      showHeaderFooter: true
    });

    console.log(options);


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

    if (!packageListData || !packageListData.length) {
      console.warn('No data to export');
      return;
    }

    // Columns definition (7 columns) - adjusted widths: description/spec expanded, right meta area wider
    const columns = [
      { header: '', key: 'sl', width: 6 },                // keep header blank
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Specification', key: 'specification', width: 34 },
      { header: 'MOC', key: 'moc', width: 20 },
      { header: 'Qty', key: 'quantity', width: 10 },
      { header: 'UOM', key: 'uom', width: 8 },
      { header: 'Remarks', key: 'remarks', width: 28 },
    ];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = companyName || 'Company';
    const sheet = workbook.addWorksheet('Packing List', {
      views: [{ state: 'frozen', ySplit: 0 }],
    });

    sheet.properties.defaultRowHeight = 20;
    sheet.columns = columns;

    // helper to parse image extension
    function imageExtensionFromDataUri(dataUri?: string): 'png' | 'jpeg' | 'gif' {
      if (!dataUri) return 'png';
      try {
        const mime = dataUri.split(';')[0].split(':')[1]; // e.g. image/png
        const ext = (mime?.split('/')?.pop() || '').toLowerCase();
        if (ext === 'png') return 'png';
        if (ext === 'jpg' || ext === 'jpeg') return 'jpeg';
        if (ext === 'gif') return 'gif';
        return 'png';
      } catch {
        return 'png';
      }
    }

    const totalCols = columns.length;
    // const thinBorder = {
    //   top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //   left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //   bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //   right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    // };

    let currentRow = 1;

    // === HEADER ZONE ===
    if (showHeaderFooter) {
      // 1) Logo row (reserve height)
      if (companyLogoDataUri) {

        // const ext = imageExtensionFromDataUri(companyLogoDataUri);
        // const imageId = workbook.addImage({
        //   base64: companyLogoDataUri,
        //   extension: ext,
        // });
        // sheet.mergeCells(currentRow, 1, currentRow, totalCols);
        // sheet.getRow(currentRow).height = 80;
        // sheet.addImage(imageId, {
        //   tl: { col: 0.2, row: currentRow - 1 + 0.05 },
        //   ext: { width: 520, height: 72 },
        // } as any);

        const ext = imageExtensionFromDataUri(companyLogoDataUri);
        const imageId = workbook.addImage({
          base64: companyLogoDataUri,
          extension: ext,
        });

        // Merge A..G row fully
        sheet.mergeCells(currentRow, 1, currentRow, totalCols);
        const row = sheet.getRow(currentRow);
        row.height = 100;  // increase height for bigger logo

        // ==== Calculate centering ====
        const targetWidth = 650;   // increase for a larger logo
        const targetHeight = 90;   // increase height
        const rowStartCol = 0;
        const rowEndCol = totalCols;

        // For horizontal centering: put col offset in middle
        const centerCol = (rowEndCol - rowStartCol) / 2 - (targetWidth / 120) / 2;

        sheet.addImage(imageId, {
          tl: { col: centerCol, row: currentRow - 1 + 0.25 },
          ext: { width: targetWidth, height: targetHeight }
        } as any);


      } else {
        sheet.mergeCells(currentRow, 1, currentRow, totalCols);
        const c = sheet.getCell(currentRow, 1);
        c.value = companyName || '';
        c.alignment = { horizontal: 'center', vertical: 'middle' };
        c.font = { size: 14, bold: true };
        sheet.getRow(currentRow).height = 36;
      }
      currentRow++;

      // 2) Title (Packing List)
      sheet.mergeCells(currentRow, 1, currentRow, totalCols);
      const titleCell = sheet.getCell(currentRow, 1);
      titleCell.value = 'PACKING LIST';
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.font = { size: 16, bold: true };
      sheet.getRow(currentRow).height = 28;
      currentRow++;

      // 3) Company address left (2 rows tall) and Invoice meta on right (invoice & invoice date)
      // We'll give the right meta more horizontal room by making left area narrower (first 3 columns).
      const leftCols = 3;               // company address uses cols 1..3
      const rightStart = leftCols + 1;  // meta area starts at col 4 and spans to col 7 (3 columns to the right)

      // Comapny name & Company address: merge currentRow..currentRow+1, cols 1..leftCols
      sheet.mergeCells(currentRow, 1, currentRow + 1, leftCols);

      const leftAddrCell = sheet.getCell(currentRow, 1);

      // Fallbacks
      const name = companyName || '';
      const address = companyAddress || '';

      // Use rich text so name is green & bold, address is black
      leftAddrCell.value = {
        richText: [
          {
            text: name + '\n\n',
            font: { bold: true, color: { argb: 'FF008000' }, size: 12 } // green
          },
          {
            text: address,
            font: { color: { argb: 'FF000000' }, size: 11 } // black normal text
          }
        ]
      };

      leftAddrCell.alignment = {
        wrapText: true,
        vertical: 'top',
        horizontal: 'left'
      };

      // Increase height for both merged rows
      sheet.getRow(currentRow).height = 50;
      sheet.getRow(currentRow + 1).height = 50;


      // Invoice No: label + merged value (top right)
      const invLabelCell = sheet.getCell(currentRow, rightStart);
      invLabelCell.value = 'Invoice No';
      invLabelCell.font = { size: 11, bold: true };
      invLabelCell.alignment = { horizontal: 'center', vertical: 'middle', };

      // Merge columns rightStart+1 .. totalCols for invoice value (gives more width)
      sheet.mergeCells(currentRow, rightStart + 1, currentRow, totalCols);
      const invValueCell = sheet.getCell(currentRow, rightStart + 1);
      invValueCell.value = invoiceNo || '';
      invValueCell.font = { size: 11, bold: true };
      invValueCell.alignment = { horizontal: 'center', vertical: 'middle', };

      // Invoice Date: same layout on next row
      const invDateLabel = sheet.getCell(currentRow + 1, rightStart);
      invDateLabel.value = 'Invoice Date';
      invDateLabel.font = { size: 11, bold: true };
      invDateLabel.alignment = { horizontal: 'center', vertical: 'middle', };

      sheet.mergeCells(currentRow + 1, rightStart + 1, currentRow + 1, totalCols);
      const invDateValue = sheet.getCell(currentRow + 1, rightStart + 1);
      invDateValue.value = invoiceDate || '';
      invDateValue.font = { size: 11, bold: true };
      invDateValue.alignment = { horizontal: 'center', vertical: 'middle', };

      // Move down two rows (we consumed currentRow and currentRow+1)
      currentRow += 2;

      // 4) Customer title (full width)
      sheet.mergeCells(currentRow, 1, currentRow, totalCols);
      const custTitleCell = sheet.getCell(currentRow, 1);
      custTitleCell.value = customerTitle || '';
      custTitleCell.font = { bold: true, size: 12 };
      custTitleCell.alignment = { horizontal: 'left', vertical: 'middle' };
      sheet.getRow(currentRow).height = 30;
      currentRow++;

      // 5) Customer address (left) vertically merged two rows; PO No and Vehicle No each have their own row/format on the right
      const leftColsCustomer = 3; // wider area for customer address
      // Customer address spans currentRow..currentRow+1 columns 1..leftColsCustomer
      sheet.mergeCells(currentRow, 1, currentRow + 1, leftColsCustomer);
      const custAddrCell = sheet.getCell(currentRow, 1);
      custAddrCell.value = customerAddress || '';
      custAddrCell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
      sheet.getRow(currentRow).height = 50;
      sheet.getRow(currentRow + 1).height = 50;

      // Right side: we will place PO No (label + merged value) at currentRow
      // and Vehicle No (label + merged value) at currentRow + 1, mirroring invoice format.
      const metaStart = leftColsCustomer + 1; // e.g., 5
      // PO No label
      const poLabelCell = sheet.getCell(currentRow, metaStart);
      poLabelCell.value = 'PO No';
      poLabelCell.font = { bold: true, size: 11 };
      poLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // PO value merged across remaining right columns for width
      sheet.mergeCells(currentRow, metaStart + 1, currentRow, totalCols);
      const poValueCell = sheet.getCell(currentRow, metaStart + 1);
      poValueCell.value = poNo || 'NA';
      poValueCell.font = { bold: true, size: 11 };
      poValueCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // Vehicle No on next row: label + merged val
      const vehLabelCell = sheet.getCell(currentRow + 1, metaStart);
      vehLabelCell.value = 'Vehicle No';
      vehLabelCell.font = { bold: true, size: 11 };
      vehLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };

      sheet.mergeCells(currentRow + 1, metaStart + 1, currentRow + 1, totalCols);
      const vehValueCell = sheet.getCell(currentRow + 1, metaStart + 1);
      vehValueCell.value = vehicleNo || '';
      vehValueCell.font = { bold: true, size: 11 };
      vehValueCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // Advance past the two lines we used for customer address
      currentRow += 2;

      // one blank row before table header
      currentRow++;
    } else {
      // directPackageList - start lower
      sheet.getRow(currentRow).height = 8;
      currentRow = 2;
    }

    // === TABLE HEADER ===
    const headerRowIndex = currentRow;
    const headerRow = sheet.getRow(headerRowIndex);

    // Explicitly write each header cell
    for (let i = 0; i < columns.length; i++) {
      const colIndex = i + 1;
      const cell = headerRow.getCell(colIndex);
      cell.value = columns[i].header;
      if (colIndex === 1) {
        // intentionally blank first header so it doesn't visually clash with logo
        cell.value = '';
      }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF008000' },
      };
      // cell.border = thinBorder;
    }
    sheet.getRow(headerRowIndex).height = 24;
    currentRow++;

    // === TABLE BODY ===
    for (let i = 0; i < packageListData.length; i++) {
      const row = packageListData[i];
      const excelRow = sheet.getRow(currentRow + i);
      excelRow.getCell(1).value = i + 1;
      excelRow.getCell(2).value = row.description || '';
      excelRow.getCell(3).value = row.specification || '';
      excelRow.getCell(4).value = row.moc || '';
      excelRow.getCell(5).value = row.quantity != null ? row.quantity : '';
      excelRow.getCell(6).value = row.uom || '';
      excelRow.getCell(7).value = row.remarks || '';

      for (let c = 1; c <= totalCols; c++) {
        const cell = excelRow.getCell(c);
        cell.alignment = {
          vertical: 'top',
          horizontal: c === 2 || c === 3 ? 'left' : 'center',
          wrapText: true,
        };
        // cell.border = thinBorder;
      }
      excelRow.height = Math.max(18, excelRow.height || 18);
    }

    currentRow += packageListData.length;

    // spacer
    currentRow++;
    sheet.getRow(currentRow).height = 12;
    // currentRow++;

    // === FOOTER ===
    if (showHeaderFooter) {
      // Signature area - tall
      sheet.mergeCells(currentRow, 1, currentRow, totalCols);
      const signCell = sheet.getCell(currentRow, 1);

      signCell.value = {
        richText: [
          // Line 1: "For <company>" in GREEN
          {
            text: 'For ',
            font: { bold: true, color: { argb: 'FF000000' }, size: 12 }
          },
          {
            text: companyName || '',
            font: { bold: true, color: { argb: 'FF008000' }, size: 12 } // green
          },
          // New line spacer
          { text: '\n\n' },
          // Line 3: Authorised Signatory (black)
          {
            text: 'Authorised Signatory',
            font: { bold: true, color: { argb: 'FF000000' }, size: 12 }
          }
        ]
      };

      signCell.alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: true
      };

      // Give proper height for signature space
      sheet.getRow(currentRow).height = 96;

      currentRow++;


      // Footer address small centered text in 2 lines
      sheet.mergeCells(currentRow, 1, currentRow, totalCols);
      const companyAddrFooter = sheet.getCell(currentRow, 1);
      companyAddrFooter.value = companyAddress || '';
      companyAddrFooter.alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
      companyAddrFooter.font = { size: 8 };
      sheet.getRow(currentRow).height = 40;
      currentRow++;
    }

    // Ensure wrapped rows have minimum height
    sheet.eachRow((r) => {
      r.eachCell((cell) => {
        if (cell.alignment?.wrapText) {
          r.height = Math.max(r.height || 15, 20);
        }
      });
    });

    // write file and save
    const buf = await workbook.xlsx.writeBuffer();
    const outFileName = fileName || `package-list-${new Date().toISOString().slice(0, 10)}.xlsx`;
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(blob, outFileName);
  }



}
