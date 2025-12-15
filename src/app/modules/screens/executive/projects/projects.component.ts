import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProjectComponent } from './add-edit-project/add-edit-project.component';
import { Router } from '@angular/router';
import { ADD_OR_EDIT_MODAL_WIDTH, CONFIRM_MODAL_WIDTH, LONG_MODAL_WIDTH, MEDIUM_MODAL_WIDTH, SMALL_MODAL_WIDTH } from 'src/environments/constants';
import { ApiService } from 'src/app/core/services/api.service';
import { finalize, map, Observable, of } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  constructor(private dialog: MatDialog, private router: Router,
    private api: ApiService,
    private snackbar: SnackbarService,
  ) { }

  isLoading = false;
  isError: boolean = false;
  role: string = '';
  projects$: Observable<any> = of([]);
  isProjectsLoading: boolean = false;

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    this.fetchProjects();
  }

  fetchProjects(searchText: string = '') {
    this.isLoading = true;
    this.isProjectsLoading = true;
    let url;

    console.log(searchText);

    if (this.selectedStatus && this.selectedStatus !== 'ALL') url = `projects?search=${searchText}&status_filter=${this.selectedStatus}`;
    else url = `projects?search=${searchText}`;

    this.api.get(url).pipe((finalize(() => this.isProjectsLoading = false)))
      .subscribe({
        next: (projects: any) => {
          this.isError = false
          this.projects$ = of(projects.data?.items?.map((project: any) => ({
            projectName: project.name,
            clientName: project.client_name,
            startDate: project.start_date,
            endDate: project.end_date,
            description: project.description,
            status: project.status,
            projectId: project.project_id,
            createdAt: project.created_at,

            supplierName: project.supplier_name,
            supplierGSTNo: project.supplier_gst_number,
            // supplierCINNo: project.supplier_cin_number,
            // supplierIECNo: project.supplier_iec_number,
            supplierAddress: project.supplier_address,

            customerName: project.customer_name,
            customerGSTNo: project.customer_gst_number,
            // customerCINNo: project.customer_cin_number,
            // customerIECNo: project.customer_iec_number,
            customerAddress: project.customer_address
          })));
          this.isLoading = false;
        },
        error: (error) => {
          this.isError = true;
        }
      })

  }

  createProject() {
    this.dialog.open(AddEditProjectComponent, {
      width: LONG_MODAL_WIDTH
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchProjects();
    });
  }

  updateProject(project: any) {
    this.dialog.open(AddEditProjectComponent, {
      width: LONG_MODAL_WIDTH,
      data: { action: 'update', project }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchProjects();
    });
  }

  changeProjectStatus(project: any, status: 'ACTIVE' | 'CLOSED' | 'DRAFT') {

    const config = this.projectStatusConfig[status];

    if (!config) {
      console.warn('Unhandled project status:', status);
      return;
    }

    const confirmModalData = {
      title: `Confirm ${config.action} Project`,
      message: `Are you sure you want to ${config.action.toLowerCase()} this project?`
    };

    this.dialog
      .open(ConfirmDialogComponent, {
        data: confirmModalData,
        width: CONFIRM_MODAL_WIDTH
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;

        this.api.put(`projects/${project.projectId}`, { status })
          .subscribe({
            next: () => {
              this.snackbar.openSnackbar(config.successMessage, 'success');
              this.fetchProjects();
            },
            error: (error) => {
              console.error(error);
              this.snackbar.openSnackbar(
                error?.error?.message || 'Failed to update project status',
                'error'
              );
            }
          });
      });
  }


  private projectStatusConfig: Record<string, {
    action: string;
    successMessage: string;
  }> = {
      CLOSED: {
        action: 'Close',
        successMessage: 'Project closed successfully',
      },
      ACTIVE: {
        action: 'Re-open',
        successMessage: 'Project re-opened successfully',
      },
      DRAFT: {
        action: 'Put on hold',
        successMessage: 'Project put on hold successfully',
      },
    };


  deleteProject(project: any) {

    const confirmModalData = {
      title: "Confirm Delete Project",
      message: `Are you sure you want to delete this project?`
    }

    this.dialog.open(ConfirmDialogComponent, { data: confirmModalData, width: CONFIRM_MODAL_WIDTH })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.api.put(`projects/${project.projectId}`, { status: "DELETED" }).pipe(finalize(() => this.isLoading = false))
            .subscribe({
              next: (response: any) => {
                this.snackbar.openSnackbar('Project Deleted successfully', 'success');
                this.fetchProjects();
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

  goToBOM(project: any) {
    localStorage.setItem('project', JSON.stringify(project));
    this.router.navigateByUrl('/home/bom', { state: { project } });
  }

  shortId(id: string): string {
    if (!id) return '';
    return `${id.slice(0, 3)}…${id.slice(-4)}`;
  }

  selectedStatus = '';
  statusChange(event: any) {
    console.log(event);
    this.fetchProjects();
  }

}
