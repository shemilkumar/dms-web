import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { PPTableConfig, TableState } from 'src/app/modules/base/pp/_models/pp-column.model';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ADD_OR_EDIT_MODAL_WIDTH } from 'src/environments/constants';
import * as XLSX from 'xlsx'; // 👈 from `xlsx` package
import { SnackbarService } from 'src/app/core/services/snackbar.service';


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


  fetchPackageList(searchText: string = '') {
    this.isLoading = true;

    this.config.tableState = TableState.LOADING;

    let url = `stickers/package/${this.box.boxId}/package-list`;

    this.packageList$ = this.api.get(url).pipe(map((res: any) => {
      const items = res.data || [];

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
  async exportToExcel() {

    if (!this.packageListData.length) {
      this.snackbar.openSnackbar('No data to export', 'warn');
      return;
    }

    this.isExporting = true;

    try {
      await new Promise(res => setTimeout(res, 50));

      const excelData = this.packageListData.map((row) => ({
        Description: row.description ?? '',
        Specification: row.specification ?? '',
        MOC: row.moc ?? '',
        Section: row.section ?? '',
        Quantity: row.quantity ?? '',
        'Dispatched Stickers': row.dispatchedStickers ?? '',
        'Pending Stickers': row.pendingStickers ?? '',
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

      const range = XLSX.utils.decode_range(worksheet['!ref']!);

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        const cell = worksheet[cellAddress];

        if (!cell) continue;

        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '008000' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }

      worksheet['!cols'] = Object.keys(excelData[0]).map(() => ({ wch: 20 }));

      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Package List');

      const fileName = `package-list-${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error('Excel export failed', err);
      this.snackbar?.openSnackbar?.('Failed to export Excel', 'error');
    } finally {
      // give a tiny delay so the browser can complete the save trigger before hiding spinner
      await new Promise(res => setTimeout(res, 120));
      this.isExporting = false;
    }
  }


}
