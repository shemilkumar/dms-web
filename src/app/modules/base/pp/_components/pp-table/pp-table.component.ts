import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PPTableConfig } from '../../_models/pp-column.model';
import { MatTableDataSource } from '@angular/material/table';
import { PpWidgetNameDirective } from '../../_directives/pp-widget-name.directive';
import { PageEvent } from '../pp-paginator/pp-paginator.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';

export interface Column {
  label: string;
  id: string;
}

@Component({
  selector: 'pp-table',
  templateUrl: './pp-table.component.html',
  styleUrls: ['./pp-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpTableComponent {
  dataSource = new MatTableDataSource<any>([]);
  @Input() config: any; // PPTableConfig
  @Input() columns: any[] = [];
  @Input() data: any[] | null = [];
  @Input() tableHeight: string = ''; // Table height in px
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  
  @Input() selection = new SelectionModel<any>(true, []);
  @Input() isSelected!: any;
  @Input() selectOnlyActive = false;
  @Input() tableSort = false;

  @Output() sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() selected: EventEmitter<SelectionModel<any>> = new EventEmitter();
  @ViewChild(MatSort) sort!: MatSort;

  disableMasterSelect = false;
  pageIndex: any;
  allSelected = false;

  @ContentChildren(PpWidgetNameDirective)
  widgets!: QueryList<PpWidgetNameDirective>;
  widgetTemplates: any = {};
  DEFAULT_TABLE_HEIGHT: string = '700px';

  // getDisplayedColumns() {
  //   return this.columns?.map((column) => column.id);
  // }

  getDataLength() {
    const length = this.data?.length;
    return length;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['data']?.currentValue) {
      if (this.config?.paginator?.offline) {
        this.data = changes['data']?.currentValue;
      } else {
        this.dataSource.data = changes['data']?.currentValue || [];
        this.allSelected = this.isAllSelected();
      }
    }
  }

  onPage(event: PageEvent) {
    this.config = {
      ...this.config,
      page: {
        ...this.config.page,
        pageSize: event.pageSize,
        pageIndex: event.pageIndex,
      },
    };
    if (this.config?.paginator?.offline) {
      this.sliceData(event);
    } else {
      this.page.emit(event);
    }
  }

  sliceData(event: PageEvent) {
    const data = this.data;
    const startIndex = event.pageIndex * event.pageSize;
    this.dataSource.data = data ? data?.slice(
      startIndex,
      startIndex + this.config?.page?.pageSize > event?.length
        ? this.config?.page?.length
        : startIndex + this.config?.page?.pageSize
    ) : []
  }

  ngAfterContentInit() {
    this.widgets.forEach((widget) => {
      this.widgetTemplates[widget.getName()] = widget.template;
    });
  }

  getTableContainerStyle() {

    return {
      height: this.tableHeight ? `${this.tableHeight}px` : this.DEFAULT_TABLE_HEIGHT,
      overflow: 'auto',
      marginBottom: '1rem',
    };
  }

  masterToggle() {
    if (this.allSelected) {
      this.selection.clear();
      return;
    }
    if (this.selectOnlyActive) { }
    else {
      this.selection.select(...this.dataSource.data);
      this.allSelected = true;
    }
  }

  ngAfterViewInit(): void {
    // this.makeResponsiveTable();

    if (this.tableSort) {
      this.dataSource.sort = this.sort;
    }
    this.sort.sortChange.subscribe((change) => {
      this.config = {
        ...this.config,
        sort: { ...change }
      };
      this.sortChange.emit(change);
    })
    this.selection.changed.subscribe((change) => {
      this.selected.emit(this.selection);
      this.allSelected = this.isAllSelected();
    });
    this.pageIndex = this.config.page?.pageIndex
  }

  checkboxChange(event: any, row: any) {
    if (event.checked) {
      this.selection?.select(row);
    } else {
      this.selection?.deselect(row);
    }
  }

  isAllSelected(): boolean {
    let filteredData;

    // Apply filtering logic if `selectOnlyActive` is true
    if (this.selectOnlyActive) {
      filteredData = this.dataSource.data.filter((item) => this.isRowSelectable(item));
      this.disableMasterSelect = filteredData.length === 0;
      if (!filteredData.length) {
        return false;
      }
    } else {
      filteredData = this.dataSource.data;
    }

    // Check if all rows in `filteredData` are selected
    for (const row of filteredData) {
      if (!this.selection.isSelected(row)) {
        return false;
      }
    }

    return true;
  }

  // Helper function to determine if a row is selectable
  isRowSelectable(row: any): boolean {
    // Customize this logic based on what makes a row selectable
    // For example, check if specific fields are non-empty or valid
    return row && Object.keys(row).length > 0; // Example: row should not be empty
  }


  checkboxLabel(row?: any): string {
    if (!row) return `${this.allSelected ? "deselect" : "select"} all`;
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1}`;
  }

  getDisplayedColumns() {
    let columns: string[] = [];

    // Add "select" column if rowSelectEnabled is true
    if (this.config?.rowSelectEnabled) {
      columns.push("select");
    }

    // Flatten and concatenate the mapped column IDs
    const mappedColumns = this.columns?.map((column) => column.id) || [];
    return [...columns, ...mappedColumns];
  }

  // checkboxDisable(row) {
  //   let role = (this.authService.getRoles().indexOf(UserRoles.SA) > -1);
  //   return row.prescriptionstatus === 'Report Interpreted and ready for printing!' || row.biosensorstatus === 'ABORTED' || row.patchStatus === 'ABORTED' || row.patchStatus === 'ASSIGNED' || row.status === 'Assigned' || row.status === 'ASSIGNED' || row.prescriptionstatus === 'Amended report ready' || row.prescriptionstatus === 'Requested For Amend' || row.status === 'Waiting in data retrieval queue' || row.status === 'Data retrieved successfully' || row.status === 'Waiting for data retrieval' || row.status === 'Data retrieval pending' || row.status === 'Unused but expired' || (row.status === 'AtFacility' && role) || row.request_amend || (this.noAccess(row.fk_prescriber) && this.noAccess(row.final_approver_id) && this.noAccess(row.pri_approver_id) && this.isClinician() && this.isReferral());
  // }
}
