import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
  taskData = this.database.tasks$;

  constructor(private readonly database: DatabaseService) {}

  ngOnDestroy(): void {
    this.database.unsubscribeToTasksdb();
  }

  ngOnInit(): void {
    this.database.subscribeToTasksdb();
  }

  uploadTask(): void {
    //this.database.uploadTask(this.emptyTask);
  }
}
