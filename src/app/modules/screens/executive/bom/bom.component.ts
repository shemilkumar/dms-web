import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { PPTableConfig, TableState } from 'src/app/modules/base/pp/_models/pp-column.model';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProductComponent } from './modals/add-edit-product/add-edit-product.component';
import { ADD_OR_EDIT_MODAL_WIDTH, CONFIRM_MODAL_WIDTH } from 'src/environments/constants';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PageEvent } from 'src/app/modules/base/pp/_components/pp-paginator/pp-paginator.component';


@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent {

  project: any = {};
  isLoading: boolean = false;
  products$: Observable<any> = of([]);

  selectedBOMs: SelectionModel<any> = new SelectionModel<any>(true);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(public location: Location, private router: Router, private api: ApiService, private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.project = state?.['project'];
  }

  config: PPTableConfig = {
    id: 'product-table',
    rowSelectEnabled: true,
    actions: {
      header: {
        class: ['flex', 'items-center', 'justify-end'],
      },
      show: true,
      headerLabel: 'gg',
      class: ['flex', 'items-center', 'justify-end'],
    },
    page: {
      pageSize: 50,
      pageIndex: 0,
      length: 0,
    },
    paginator: {
      hide: false,
      offline: false,
    },
    sort: {
      active: 'name',
      direction: 'asc',
    },
    translateKey: 'product-table',
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
      id: 'drawingNo',
      label: 'Drawing No',
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
      id: 'pageNo',
      label: 'Page No',
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
      id: 'dispatchedQuantity',
      label: 'Dispatched',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'remainingQuantity',
      label: 'Remaining',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    // {
    //   id: 'remarks',
    //   label: 'Remarks',
    //   headerClass: ['text-start'],
    //   sortable: true,
    //   cellClass: ['fw-bold', 'font-size-16'],
    // },
    // {
    //   id: 'createdOn',
    //   label: 'Created On',
    //   headerClass: ['text-start'],
    //   sortable: true,
    //   cellClass: ['fw-bold', 'font-size-16'],
    // },
    {
      id: 'action-buttons',
      label: '',
      headerClass: ['text-start'],
      sortable: false,
      cellClass: ['fw-bold', 'font-size-16'],
      style: "width: 120px",
    },
  ];


  headerData: any = {};
  role: string = '';

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';

    if (!this.project) {
      const project = localStorage.getItem('project');
      if (project) this.project = JSON.parse(project);
      else return;
    }

    this.headerData = {
      title: this.project.projectName,
      showBackButton: true,
      backButtonLink: 'home'
    }
    this.fetchSections();
    this.fetchProducts();
  }

  sections: any[] = [];

  fetchSections() {
    this.api.get(`boms/dropdown/sections?project_id=${this.project.projectId}`).subscribe({
      next: (response: any) => {
        this.sections = response.data;
      }
    })
  }
  currentSearchText: string = '';

  fetchProducts(searchText: string = '') {
    this.isLoading = true;

    const page = this.config?.page?.pageIndex;
    const limit = this.config?.page?.pageSize;

    if (searchText === '') this.currentSearchText = '';
    else this.currentSearchText = searchText;


    this.config.tableState = TableState.LOADING;

    let url = `boms/project/${this.project.projectId}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchText)}`;

    if (this.selectedSection && this.selectedSection !== 'ALL') url += `&section_filter=${encodeURIComponent(this.selectedSection)}`;

    this.products$ = this.api.get(url).pipe(
      tap((products: any) => this.config.page!.length = products.data.total),
      map((products: any) => products.data?.items?.map((product: any) => ({
        description: product.description,
        specification: product.specification,
        moc: product.moc,
        quantity: product.quantity,
        uom: product.uom,
        etchingMark: product.etching_mark,
        pageNo: product.page_no,
        remarks: product.remarks,
        remainingQuantity: product.remaining_quantity,
        dispatchedQuantity: product.dispatched_quantity,
        bomId: product.bom_id,
        section: product.section,
        status: product.status,
        slNo: product.sl_no
      }))),
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
      }),
    );
  }

  deleteProduct(product: any) {

    const confirmModalData = {
      title: `Confirm Delete Product`,
      message: `Are you sure you want to Delete this Product?`
    }

    this.dialog.open(ConfirmDialogComponent, { data: confirmModalData, width: CONFIRM_MODAL_WIDTH })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.api.put(`boms/${product.bomId}/status`, { status: 'DELETED' }).pipe()
            .subscribe({
              next: (response: any) => {
                this.snackbar.openSnackbar('Product Deleted successfully', 'success');
                this.fetchProducts();
              },
              error: (error) => {
                console.log(error);
                this.snackbar.openSnackbar(error.message, 'error');
              }
            })
        }
        else { }
      });
  }

  deleteAllProducts() {
    const confirmModalData = {
      title: `Confirm Delete All Product`,
      message: `Are you sure you want to Delete All Product?`
    }

    this.dialog.open(ConfirmDialogComponent, { data: confirmModalData, width: CONFIRM_MODAL_WIDTH })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.api.put(`boms/bom/project/${this.project.projectId}/status`, {}).pipe()
            .subscribe({
              next: (response: any) => {
                this.snackbar.openSnackbar('Products Deleted successfully', 'success');
                this.fetchProducts();
              },
              error: (error) => {
                console.log(error);
                this.snackbar.openSnackbar(error.message, 'error');
              }
            })
        }
        else { }
      });
  }

  createProduct() {
    this.dialog.open(AddEditProductComponent, {
      width: ADD_OR_EDIT_MODAL_WIDTH,
      data: { action: 'add', project: this.project }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchProducts();
    });
  }

  updateProduct(product: any) {
    this.dialog.open(AddEditProductComponent, {
      width: ADD_OR_EDIT_MODAL_WIDTH,
      data: { action: 'update', project: this.project, product }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchProducts();
    });
  }

  printProduct(product: any = null) {
    let products;
    if (product) products = [product];
    else products = this.selectedBOMs.selected;

    this.router.navigate(['home/sticker'], { state: { project: this.project, products } });
  }

  onUsersSelected(event: any) {
    this.selectedBOMs = event;
  }

  isSelected(row: any, selection: SelectionModel<any>) {
    return selection.selected.map(bom => bom.bomId).includes(row.bomId);
  }

  fileUploadLoading: boolean = false;

  uploadProducts(file: File) {

    const formData = new FormData();
    formData.append('file', file);
    this.fileUploadLoading = true;

    this.api.post(`boms/project/${this.project.projectId}/upload`, formData).pipe(finalize(() => this.fileUploadLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('Products imported successfully', 'success');
          this.fetchProducts();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      })
  }

  triggerFileSelect(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // ✅ validate file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid Excel file (.xls or .xlsx)');
      input.value = '';
      return;
    }

    console.log('Selected file:', file);

    this.uploadProducts(file);
    input.value = '';
  }


  selectedSection: string = ''
  sectionChange(event: any) {
    this.config.page!.pageIndex = 0;
    this.fetchProducts();
  }

  onSearchChange(searchText: string) {
    this.config.page!.pageIndex = 0;
    this.fetchProducts(searchText);
  }


  onPageChange(event: PageEvent) {
    this.config = {
      ...this.config,
      page: {
        ...this.config.page,
        pageIndex: event.pageIndex,
        pageSize: event.pageSize
      }
    }
    // this.fetchProducts();
    this.fetchProducts(this.currentSearchText);
  }

}
