import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { finalize, map, Observable, of } from 'rxjs';
import { PPTableConfig, TableState } from 'src/app/modules/base/pp/_models/pp-column.model';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProductComponent } from './modals/add-edit-product/add-edit-product.component';
import { ADD_OR_EDIT_MODAL_WIDTH } from 'src/environments/constants';
import { StickersComponent } from './modals/stickers/stickers.component';


@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent {

  project: any = {};
  isLoading: boolean = false;
  products$: Observable<any> = of([]);

  constructor(public location: Location, private router: Router, private api: ApiService, private dialog: MatDialog) {
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
      id: 'moc',
      label: 'MOC',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'etchingMark',
      label: 'Etching Mark',
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
      id: 'quantity',
      label: 'Quantity',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'dispatchedQuantity',
      label: 'Dispatched Quantity',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'remainingQuantity',
      label: 'Remaining Quantity',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'remarks',
      label: 'Remarks',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
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
      // style: "width: 25%",
    },
  ];


  qrData = "{\"sticker_id\":\"STK-400ca817-9c17-4acb-a043-8c9046badddd\",\"project_id\":\"PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a\",\"bom_id\":\"BOM-191802a4-8119-4ab5-bee2-58b82295d746\",\"seq\":2,\"total\":2}";

  // qrData = "https://hianime.do";

  headerData: any = {};

  ngOnInit(): void {
    if (!this.project) {
      const project = localStorage.getItem('project');
      if (project) this.project = JSON.parse(project);
      else return;
    }

    this.headerData = {
      title: this.project.projectName,
      showBackButton: true,
      backButtonLink: 'projects'
    }
    this.fetchProducts();
  }



  fetchProducts(searchText: string = '') {
    this.isLoading = true;

    let url = `boms/project/${this.project.projectId}?search=${searchText}`;

    this.products$ = this.api.get(url).pipe(
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
        bomId: product.bom_id
      })))
    );
  }

  deleteProduct(product: any) {

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

  printProduct(product: any) {
    // this.isLoading = false
    // this.api.post(`stickers/bom/${product.bomId}/generate`, {}).pipe(finalize(() => { }))
    //   .subscribe({
    //     next: (response: any) => {
    //       // this.snackbar.openSnackbar('Product created successfully', 'success');
    //     },
    //     error: (error) => {
    //       console.log(error);
    //       // this.snackbar.openSnackbar(error.message, 'error');
    //     }
    //   });

    this.dialog.open(StickersComponent, {
      height: '90vh',
      data: { project: this.project, product }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchProducts();
    });
  }

  importProducts() {

  }

  logout() {

  }

}
