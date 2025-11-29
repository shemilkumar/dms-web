import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(public location: Location, private router: Router) { }


  logout() {

  }

  createBox() { }


  boxes: Box[] = []; // load from API
  filtered: Box[] = [];
  pagedBoxes: Box[] = [];
  query = '';
  sortBy = 'createdDesc';
  page = 0;
  pageSize = 12;
  editing: Box | null = null;

  get start() { return this.page * this.pageSize; }
  get end() { return Math.min((this.page + 1) * this.pageSize, this.filtered.length); }

  headerData = {

  }

  project: any;

  ngOnInit() {


    if (!this.project) {
      const project = localStorage.getItem('project');
      if (project) this.project = JSON.parse(project);
      else return;

      console.log(project, this.project);

    }

    this.headerData = {
      title: this.project.projectName,
      showBackButton: true,
      backButtonLink: 'projects'
    }


    // demo seed, replace with API call
    this.boxes = Array.from({ length: 10 }).map((_, i) => ({
      id: String(i + 1),
      name: `Box ${i + 1}`,
      description: i % 2 ? `Description ${i + 1}` : '',
      created: new Date(Date.now() - i * 86400000),
      itemsCount: Math.floor(Math.random() * 10)
    }));
    this.filter();



    console.log(this.boxes);

  }

  filter() {
    const q = this.query.trim().toLowerCase();
    this.filtered = this.boxes
      .filter(b => !q || b.name.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q))
      .sort(this.getSorter());
    this.page = 0;
    this.updatePaged();
  }

  getSorter() {
    switch (this.sortBy) {
      case 'createdAsc': return (a: Box, b: Box) => +(a.created! > b.created!) - 0.5;
      case 'nameAsc': return (a: Box, b: Box) => a.name.localeCompare(b.name);
      default: // createdDesc
        return (a: Box, b: Box) => +(b.created! > a.created!) - 0.5;
    }
  }

  updatePaged() {
    this.pagedBoxes = this.filtered.slice(this.start, this.end);
  }

  prevPage() { if (this.page > 0) { this.page--; this.updatePaged(); } }
  nextPage() { if (this.end < this.filtered.length) { this.page++; this.updatePaged(); } }

  openCreate() { this.editing = { name: '', description: '', created: new Date(), itemsCount: 0 }; }
  openEdit(b: Box) { this.editing = { ...b }; }
  closeEdit() { this.editing = null; }

  save() {
    if (!this.editing) return;
    if (this.editing.id) {
      // update
      const idx = this.boxes.findIndex(x => x.id === this.editing!.id);
      if (idx >= 0) this.boxes[idx] = { ...this.editing };
    } else {
      // create
      this.editing.id = Date.now().toString();
      this.boxes.unshift({ ...this.editing });
    }
    this.closeEdit();
    this.filter();
  }

  confirmDelete(b: Box) {
    if (!confirm(`Delete "${b.name}"?`)) return;
    this.boxes = this.boxes.filter(x => x.id !== b.id);
    this.filter();
  }

  goToProjects() {
    this.router.navigateByUrl('projects');
  }
}

