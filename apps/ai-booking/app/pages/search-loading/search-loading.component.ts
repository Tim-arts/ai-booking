import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search-loading',
  templateUrl: './search-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, ProgressSpinnerModule, ButtonModule],
})
export class SearchLoadingComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  readonly searchParams = this.searchService.search;
  readonly loadingMessages = signal([
    'Searching for the best flights...',
    'Comparing prices across airlines...',
    'Finding exclusive deals...',
    'Almost ready!',
  ]);
  readonly currentMessageIndex = signal(0);
  readonly currentMessage = signal('Searching for the best flights...');

  private messageInterval?: number;
  private searchTimeout?: number;

  ngOnInit(): void {
    // Redirect if no search params
    if (!this.searchParams()) {
      this.router.navigate(['/']);
      return;
    }

    this.startLoadingMessages();
    this.performSearch();
  }

  ngOnDestroy(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private startLoadingMessages(): void {
    this.messageInterval = window.setInterval(() => {
      const messages = this.loadingMessages();
      const currentIndex = this.currentMessageIndex();
      const nextIndex = (currentIndex + 1) % messages.length;

      this.currentMessageIndex.set(nextIndex);
      this.currentMessage.set(messages[nextIndex]);
    }, 800);
  }

  private performSearch(): void {
    const params = this.searchParams();
    if (!params) return;

    this.searchService.searchFlights(params).subscribe({
      next: (results) => {
        this.searchService.setResults(results);
        this.router.navigate(['/search-results']);
      },
      error: (error) => {
        console.error('Search failed:', error);
        // Handle error - could show error message or redirect
        this.router.navigate(['/']);
      },
    });
  }

  onCancel(): void {
    this.searchService.clearSearch();
    this.router.navigate(['/']);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  getDaysDifference(): number {
    const params = this.searchParams();
    if (!params) return 0;

    const diffTime = params.checkOut.getTime() - params.checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
