import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TodoTask } from '@rucken/todo-core';
import { BaseResourceModalComponent } from '@rucken/web';
import { TextInputComponent } from '@rucken/web';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'todo-task-modal',
  templateUrl: './todo-task-modal.component.html',
  styleUrls: ['./todo-task-modal.component.scss']
})

export class TodoTaskModalComponent extends BaseResourceModalComponent {

  @ViewChild('modal')
  modal: ModalDirective;
  @ViewChild('focusElement')
  focusElement: TextInputComponent;

  @Input()
  item: TodoTask = new TodoTask();
  @Input()
  modelMeta: any = TodoTask.meta();
  @Output()
  onClose: EventEmitter<TodoTaskModalComponent> = new EventEmitter<TodoTaskModalComponent>();
  @Output()
  onOk: EventEmitter<TodoTaskModalComponent> = new EventEmitter<TodoTaskModalComponent>();
}
