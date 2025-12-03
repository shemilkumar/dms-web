import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProjectComponent } from './add-edit-project/add-edit-project.component';
import { Router } from '@angular/router';
import { ADD_OR_EDIT_MODAL_WIDTH, SMALL_MODAL_WIDTH } from 'src/environments/constants';
import { ApiService } from 'src/app/core/services/api.service';
import { finalize, map, Observable, of } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

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

  projects$: Observable<any> = of([]);

  ngOnInit() {
    this.fetchProjects();
  }


  fetchProjects(searchText: string = '') {
    this.isLoading = true;
    let url;

    console.log(searchText);

    if (this.selectedStatus && this.selectedStatus !== 'ALL') url = `projects?search=${searchText}&status_filter=${this.selectedStatus}`;
    else url = `projects?search=${searchText}`;

    this.api.get(url).subscribe({
      next: (projects: any) => {
        this.projects$ = of(projects.data?.items?.map((project: any) => ({
          projectName: project.name,
          clientName: project.client_name,
          startDate: project.start_date,
          endDate: project.end_date,
          description: project.description,
          status: project.status,
          projectId: project.project_id
        })));
        this.isLoading = false;
      },
    })


    // .pipe(
    // map((projects: any) => projects.data?.items?.map((project: any) => ({
    //   projectName: project.name,
    //   clientName: project.client_name,
    //   startDate: project.start_date,
    //   endDate: project.end_date,
    //   description: project.description,
    //   status: project.status,
    //   projectId: project.project_id
    // })))
    // );
  }

  createProject() {
    this.dialog.open(AddEditProjectComponent, {
      width: SMALL_MODAL_WIDTH
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchProjects();
    });
  }

  updateProject(project: any) {
    this.dialog.open(AddEditProjectComponent, {
      width: ADD_OR_EDIT_MODAL_WIDTH,
      data: { action: 'update', project }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) this.fetchProjects();
    });
  }

  deleteProject(project: any) {
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
