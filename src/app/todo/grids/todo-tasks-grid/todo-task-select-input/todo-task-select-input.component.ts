import { SelectInputComponent } from 'rucken';
import { TodoTask } from '../../../shared/models/todo-task.model';
import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { TodoTasksListModalComponent } from '../todo-tasks-list-modal/todo-tasks-list-modal.component';
import { AppService } from 'rucken';
import { AccountService } from 'rucken';
import { TodoTasksService } from '../../../shared/todo-tasks.service';
import { User } from 'rucken';
import { BaseResourceSelectInputConfig } from 'rucken';
import { BaseResourceSelectInputComponent } from 'rucken';
import { TranslateService } from '@ngx-translate/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { ShortTodoProject } from '../../../shared/models/short-todo-project.model';

@Component({
  selector: 'todo-task-select-input',
  templateUrl: './todo-task-select-input.component.html',
  styleUrls: ['./todo-task-select-input.component.scss'],
  entryComponents: [TodoTasksListModalComponent]
})
export class TodoTaskSelectInputComponent extends BaseResourceSelectInputComponent {

  @ViewChild('inputElement')
  inputElement: any;
  @ViewChild('tooltip')
  tooltip: TooltipDirective;

  @Input()
  project?: ShortTodoProject;
  @Input()
  name = 'todoTask';
  @Input()
  model: TodoTask = new TodoTask();
  @Output()
  modelChange: EventEmitter<TodoTask> = new EventEmitter<TodoTask>();

  items: TodoTask[];
  cachedResourcesService: TodoTasksService;

  constructor(
    public app: AppService,
    public accountService: AccountService,
    public todoTasksService: TodoTasksService,
    public resolver: ComponentFactoryResolver,
    public translateService: TranslateService,
    public config: BaseResourceSelectInputConfig
  ) {
    super(translateService, config);
    this.cachedResourcesService = todoTasksService.createCache();
  }
  get account(): User {
    return this.accountService.account;
  }
  onLookup() {
    const itemModal: TodoTasksListModalComponent =
      this.app.modals(this.resolver).create(TodoTasksListModalComponent);
    itemModal.hardReadonly = this.hardReadonly;
    itemModal.account = this.account;
    itemModal.project = this.project;
    itemModal.text = this.translateService.instant('Select');
    itemModal.title = this.translateService.instant('Todo tasks');
    itemModal.onOk.subscribe(($event: any) => {
      this.value = itemModal.item;
      if (this.inputElement) {
        this.inputElement.value = this.value.pk;
      }
      if (this.inputReadonly === false) {
        this.valueAsString = '';
      }
      itemModal.modal.hide();
    });
    itemModal.onClose.subscribe(() => this.focus());
    itemModal.item = this.value;
    itemModal.modal.show();
  }
}
