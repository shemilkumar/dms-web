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
    // private snackbar: SnackbarService,
  ) { }

  isLoading = false;

  projects$: Observable<any> = of([]);

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects(searchText: string = '') {
    this.isLoading = true;

    let url = `projects?search=${searchText}`;

    this.projects$ = this.api.get(url).pipe(
      map((projects: any) => projects.data?.items?.map((project: any) => ({
        projectName: project.name,
        clientName: project.client_name,
        startDate: project.start_date,
        endDate: project.end_date,
        description: project.description,
        status: project.status,
        projectId: project.project_id
      })))
    );
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

  goToHome(project: any) {
    localStorage.setItem('project', JSON.stringify(project));
    this.router.navigateByUrl('projects/bom', { state: { project } });
  }
}
