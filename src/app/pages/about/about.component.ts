import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule]
})
export class AboutComponent {}