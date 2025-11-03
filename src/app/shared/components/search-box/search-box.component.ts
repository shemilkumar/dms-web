import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();
  searchText: string = '';

  searchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onChange.emit(this.searchText.trim());
  }

  clearSearch() {
    this.searchText = ''
    this.onChange.emit(this.searchText);
  }
}
