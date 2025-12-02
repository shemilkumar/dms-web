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

  deleteProject(project: any) {

  }

  goToHome(project: any) {
    localStorage.setItem('project', JSON.stringify(project));
    this.router.navigateByUrl('/home/bom', { state: { project } });
  }


  projects: any = [
    {
      id: 'PRJ-5f61dbb2-b905-4c17-875f-276c08d5ab5a',
      name: 'Hospital Management System',
      created_at: '2024-12-05T10:15:00Z',
      updated_at: '2025-01-12T09:30:00Z',
      status: 'active',
      owner: 'Dr. Arun Kumar'
    },
    {
      id: 'PRJ-002',
      name: 'Pharmacy Inventory Tracker',
      created_at: '2024-11-18T14:45:00Z',
      updated_at: '2024-12-22T16:10:00Z',
      status: 'active',
      owner: 'Meena Sharma'
    },
    {
      id: 'PRJ-003',
      name: 'ECG Monitoring Dashboard',
      created_at: '2024-10-02T08:00:00Z',
      updated_at: '2024-10-28T11:20:00Z',
      status: 'archived',
      owner: 'Ravi Prasad'
    },
    {
      id: 'PRJ-004',
      name: 'Laboratory Sample Tracking',
      created_at: '2024-09-15T13:25:00Z',
      updated_at: '2024-11-05T10:50:00Z',
      status: 'draft',
      owner: 'Anjali Menon'
    },
    {
      id: 'PRJ-005',
      name: 'Medical Equipment Asset Register',
      created_at: '2024-08-07T17:40:00Z',
      updated_at: '2024-12-01T12:15:00Z',
      status: 'active',
      owner: 'Suresh Iyer'
    },
    {
      id: 'PRJ-006',
      name: 'Patient Admission Workflow',
      created_at: '2024-07-25T09:05:00Z',
      updated_at: '2024-08-14T15:00:00Z',
      status: 'archived',
      owner: 'Neha Gupta'
    },
    // {
    //   id: 'PRJ-007',
    //   name: 'Clinical Report Automation',
    //   created_at: '2024-06-30T11:35:00Z',
    //   updated_at: '2024-07-18T18:45:00Z',
    //   status: 'active',
    //   owner: 'Rahul Verma'
    // },
    // {
    //   id: 'PRJ-008',
    //   name: 'Drug Expiry Alert System',
    //   created_at: '2024-05-10T16:20:00Z',
    //   updated_at: '2024-09-01T08:10:00Z',
    //   status: 'active',
    //   owner: 'Pooja Nair'
    // }
  ];


  search = '';

  get filteredProjects() {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.projects;
    return this.projects.filter((p: any) => p.name.toLowerCase().includes(q));
  }

  shortId(id: string): string {
    if (!id) return '';
    return `${id.slice(0, 3)}…${id.slice(-4)}`;
  }
  // createProject() { /* open modal / navigate */ }
  openProject(p: any) { /* go to detail */ }
  openProjectMenu(p: any) { /* show menu */ }

}
