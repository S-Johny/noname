import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { map } from 'rxjs';
import { ConfigService } from 'src/app/shared/config.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { emptyTask } from 'src/app/shared/utils';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
  taskData = this.database.tasks$.pipe(
    map(tasks => {
      tasks = tasks.filter(task => {
        const now = Date.now();
        return task.startAt > now && task.endAt < now;
      });
      tasks.sort((a, b) => {
        if (a.required && !b.required) {
          return -1;
        } else if (!a.required && b.required) {
          return 1;
        } else if (a.startAt < b.startAt) {
          return -1;
        } else if (a.startAt > b.startAt) {
          return 1;
        } else {
          return 0;
        }
      });
      return tasks;
    })
  );
  private configService: ConfigService = inject(ConfigService);
  showTaskEnd = this.configService.getBoolean("showTaskEnd");
  emptyTask = {
    name: '',
    required: false,
    description: `
  <div class="task-body">

  </div>
`,
    startAt: 1746590400000,
    endAt: 1746964800000,
    reward: '',
    shown: true,
  };

  constructor(private readonly database: DatabaseService) {}

  ngOnDestroy(): void {
    this.database.unsubscribeToTasksdb();
  }

  ngOnInit(): void {
    this.database.subscribeToTasksdb();
  }

  uploadTask(): void {
    this.database.uploadTask(this.emptyTask);
  }
}
