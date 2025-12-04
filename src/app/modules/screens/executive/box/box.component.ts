import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { AddEditBoxComponent } from './modals/add-edit-box/add-edit-box.component';
import { SMALL_MODAL_WIDTH, SMALL_SINGLE_COL_MODAL_WIDTH } from 'src/environments/constants';

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
    private api: ApiService, private dialog: MatDialog
  ) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.project = state?.['project'];
  }

  isLoading: boolean = false;
  headerData = {}
  project: any;
  boxes$: Observable<any> = of([]);

  ngOnInit() {

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
        boxId: box.box_id
      })))
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

  goToProjects() {
    this.router.navigateByUrl('home');
  }

  openBox(box: any) {
    this.router.navigate(['home/package-list'], { state: { box } });
  }
}

