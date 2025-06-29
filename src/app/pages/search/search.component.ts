import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  readonly searchQuery = signal('');
  readonly isLoading = signal(false);

  readonly searchResults = computed(() => {
    // Mock search results
    return [
      {
        id: 1,
        title: 'Search functionality coming soon!',
        description: 'We are working on building an amazing search experience for you.'
      }
    ];
  });
}