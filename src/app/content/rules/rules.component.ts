import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoutePaths } from 'src/app/app-routing.module';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
  routesPaths: typeof RoutePaths = RoutePaths;
}
