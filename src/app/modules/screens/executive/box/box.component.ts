import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { AddEditBoxComponent } from './modals/add-edit-box/add-edit-box.component';
import { CONFIRM_MODAL_WIDTH, SMALL_MODAL_WIDTH, SMALL_SINGLE_COL_MODAL_WIDTH } from 'src/environments/constants';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

interface Box {
  id?: string;
  name: string;
  description?: string;
  created?: Date;
  itemsCount?: number;
}

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent {

  constructor(public location: Location, private router: Router,
    private api: ApiService, private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.project = state?.['project'];
  }

  isLoading: boolean = false;
  headerData = {}
  project: any;
  boxes$: Observable<any> = of([]);
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

    this.fetchBoxes();
  }

  searchQuery: string = '';

  fetchBoxes(searchText: string = '') {
    this.isLoading = true;

    if (searchText === '') this.searchQuery = '';
    else this.searchQuery = searchText;

    let url = `boxes/project/${this.project.projectId}?search=${searchText}`;

    this.boxes$ = this.api.get(url).pipe(
      map((boxes: any) => boxes.data?.items?.map((box: any) => ({
        boxName: box.name,
        description: box.description,
        boxId: box.box_id,
        createdAt: box?.audit_log[0]?.created_at,
        status: box.status
      }))),
      tap(items => {
        console.log(items);

      })
    );
  }

  createBox() {
    this.dialog.open(AddEditBoxComponent, {
      width: SMALL_MODAL_WIDTH,
      data: { action: 'add', project: this.project }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchBoxes();
    });
  }

  updateBox(box: any) {
    this.dialog.open(AddEditBoxComponent, {
      width: SMALL_MODAL_WIDTH,
      data: { action: 'update', project: this.project, box }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchBoxes();
    });
  }

  changeBoxStatus(box: any, status: string) {

    const target = (status || '').toString().toUpperCase();

    // Determine action label + confirmation copy
    let actionLabel = target === 'ACTIVE' ? 'Re-open' : target === 'CLOSED' ? 'Close' : target === 'DELETED' ? 'Delete' : target;
    let confirmMessage = `Are you sure you want to ${actionLabel.toLowerCase()} this box?`;

    // Stronger warning for delete
    if (target === 'DELETED') {
      confirmMessage = `This action will permanently delete the box. Are you sure you want to delete it?`;
    }

    const confirmModalData = {
      title: `${actionLabel} Box`,
      message: confirmMessage
    };

    this.dialog.open(ConfirmDialogComponent, { data: confirmModalData, width: CONFIRM_MODAL_WIDTH })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.api.put(`boxes/${box.boxId}`, { status: target }).pipe()
            .subscribe({
              next: (response: any) => {

                const successMsg = target === 'ACTIVE' ? 'Box re-opened successfully'
                  : target === 'CLOSED' ? 'Box closed successfully'
                    : target === 'DELETED' ? 'Box deleted successfully'
                      : 'Status updated successfully';

                this.snackbar.openSnackbar(successMsg, 'success');
                this.fetchBoxes();
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

  goToProjects() {
    this.router.navigateByUrl('home');
  }

  openBox(box: any) {
    this.router.navigate(['home/package-list'], { state: { box } });
  }
}

