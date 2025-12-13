import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { PPTableConfig, TableState } from 'src/app/modules/base/pp/_models/pp-column.model';
import { ADD_OR_EDIT_MODAL_WIDTH, CONFIRM_MODAL_WIDTH } from 'src/environments/constants';
import { AddEditUserComponent } from './modals/add-edit-user/add-edit-user.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) { }

  config: PPTableConfig = {
    id: 'user-management-table',
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
    translateKey: 'user-management-table',
    translate: true,
    tableState: TableState.DEFAULT,
  };

  columns = [
    {
      id: 'status',
      label: 'Status',
      headerClass: ['text-start'],
      sortable: false,
      cellClass: [],
    },
    {
      id: 'username',
      label: 'Username',
      headerClass: ['text-start'],
      sortable: false,
      cellClass: [],
    },

    {
      id: 'email',
      label: 'Email',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      headerClass: ['text-start'],
      sortable: true,
      cellClass: ['fw-bold', 'font-size-16'],
    },
    {
      id: 'role',
      label: 'Role',
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

  users$: Observable<any> = of([]);
  role: string = '';

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    this.fetchUsers();
  }

  fetchUsers(searchText: string = '') {

    this.config.tableState = TableState.LOADING

    let url = `users/all?search=${searchText}`;

    this.users$ = this.api.get(url).pipe(
      tap((users: any) => this.config.tableState = TableState.SUCCESS),
      map((users: any) => users.data?.items.map((user: any) => ({
        id: user.user_id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phone_number,
        role: this.getRole(user.role),
        status: user.status,
        userId: user.user_id
      })))
    ),
      catchError(error => {
        this.config.tableState = TableState.FAILURE
        return of([]);
      });
  }

  addUser() {
    this.dialog.open(AddEditUserComponent, {
      width: ADD_OR_EDIT_MODAL_WIDTH
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchUsers();
    });
  }

  updateUser(user: any) {
    this.dialog.open(AddEditUserComponent, {
      width: ADD_OR_EDIT_MODAL_WIDTH,
      data: { action: 'update', user }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchUsers();
    });
  }

  deleteUser(user: any) {

    const confirmModalData = {
      title: `Confirm Delete User`,
      message: `Are you sure you want to Delete this User?`
    }

    this.dialog.open(ConfirmDialogComponent, { data: confirmModalData, width: CONFIRM_MODAL_WIDTH })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.api.put(`users/status_update/${user.userId}`, { status: 'DELETED' }).pipe()
            .subscribe({
              next: (response: any) => {
                this.snackbar.openSnackbar('User Deleted successfully', 'success');
                this.fetchUsers();
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

  changeStatusToggle(event: any, user: any, toggle?: any) {
    const prevStatus = user.status;
    const newStatus = event.checked ? 'ACTIVE' : 'INACTIVE';

    user.status = newStatus;

    this.api.put(`users/status_update/${user.id}`, { status: newStatus }).subscribe({
      next: () => {
        this.snackbar.openSnackbar('User Status updated successfully', 'success');
        this.fetchUsers();
      }, error: (err) => {
        console.log(err);
        user.status = prevStatus;
        toggle.checked = prevStatus === 'ACTIVE';
        this.snackbar.openSnackbar('Unable to update user status', 'error');
      }
    });
  }


  getRole(role: string) {
    if (role === 'EX') return 'Executive'
    else if (role === 'ADM') return 'Admin'
    else if (role === 'SC') return 'Scanner'
    else return 'User'
  }

}
