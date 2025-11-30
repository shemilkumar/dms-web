import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { PPTableConfig, TableState } from 'src/app/modules/base/pp/_models/pp-column.model';
import { AddEditUserComponent } from '../modals/add-edit-user/add-edit-user.component';
import { ADD_OR_EDIT_MODAL_WIDTH } from 'src/environments/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent {

  constructor(private api: ApiService, private dialog: MatDialog, private router: Router) { }

  config: PPTableConfig = {
    id: 'site-management-table',
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
    translateKey: 'site-management-table',
    translate: true,
    tableState: TableState.DEFAULT,
  };

  columns = [
    {
      id: 'id',
      label: 'User ID',
      headerClass: ['text-start'],
      sortable: false,
      cellClass: [],
      // style: "max-width: 450px; width: 450px;",
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

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers(searchText: string = '') {

    let url = `users/all?search=${searchText}`;

    this.users$ = this.api.get(url).pipe(
      map((users: any) => users.data?.items.map((user: any) => ({
        id: user.user_id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phone_number,
        role: this.getRole(user.role),
        status: user.status === 'active' ? 'Active' : 'Inactive'
      })))
    );
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
    console.log('Update user clicked', user);
  }


  getRole(role: string) {
    if (role === 'EX') return 'Executive'
    else if (role === 'ADM') return 'Admin'
    else return 'User'
  }


  logout() {

    const token = localStorage.getItem('refresh_token') || '';

    if (token) {
      this.api.post('auth/logout', { refresh_token: token }).subscribe({
        next: (data: any) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigateByUrl('/login');
        },
      });
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.router.navigateByUrl('/login');
    }
  }
}
