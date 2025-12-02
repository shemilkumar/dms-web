import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PPTableConfig, TableState } from 'src/app/modules/base/pp/_models/pp-column.model';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ADD_OR_EDIT_MODAL_WIDTH } from 'src/environments/constants';


@Component({
  selector: 'app-box-products',
  templateUrl: './box-products.component.html',
  styleUrls: ['./box-products.component.scss']
})
export class BoxProductsComponent {

  box: any = {};
  isLoading: boolean = false;
  packageList$: Observable<any> = of([]);

  constructor(public location: Location, private router: Router, private api: ApiService, private dialog: MatDialog) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.box = state?.['box'];
    if (!this.box) router.navigate(['projects/box']);
  }

  config: PPTableConfig = {
    id: 'product-table',
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
      id: 'uom',
      label: 'UOM',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
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
      backButtonLink: 'projects/box'
    }
    this.fetchPackageList();
  }


  fetchPackageList(searchText: string = '') {
    this.isLoading = true;

    let url = `stickers/package/${this.box.boxId}/package-list`;

    this.packageList$ = this.api.get(url).pipe(
      map((products: any) => products.data?.map((product: any) => ({
        description: product.description,
        specification: product.specification,
        moc: product.moc,
        quantity: product.quantity,
        uom: product.uom,
        section: product.section,
        dispatchedStickers: product.dispatched_stickers,
        pendingStickers: product.pending_stickers,
        bomId: product.bom_id,
      })))
    );
  }


}
