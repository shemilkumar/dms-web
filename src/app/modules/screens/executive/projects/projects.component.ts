import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProjectComponent } from '../modals/add-edit-project/add-edit-project.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  constructor(private dialog: MatDialog, private router: Router) { }

  projects = [
    { id: 1, name: 'Project Alpha', status: 'In Progress' },
    { id: 2, name: 'Project Beta', status: 'Completed' },
    { id: 3, name: 'Project Gamma', status: 'Not Started' },
    { id: 4, name: 'Project Delta', status: 'In Progress' },
    { id: 2, name: 'Project Beta', status: 'Completed' },
    { id: 3, name: 'Project Gamma', status: 'Not Started' },
    { id: 4, name: 'Project Delta', status: 'In Progress' },
    { id: 4, name: 'Project Delta', status: 'In Progress' },
    { id: 4, name: 'Project Delta', status: 'In Progress' },
  ];

  createProject() {
    this.dialog.open(AddEditProjectComponent);
  }

  goToHome(project: any) {
    console.log("hi");
    // this.router.navigate(['projects/home'], { state: { project } });
    this.router.navigateByUrl('projects/home', { state: { project } });
  }
}
