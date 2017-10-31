import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@rucken/core';
import { AccountService } from '@rucken/core';
import { AppService } from '@rucken/core';
import { ShortTodoProject } from '@rucken/todo-core';
import { TodoChangesService } from '@rucken/todo-core';
import { TodoChange } from '@rucken/todo-core';
import { BaseResourcesGridComponent } from '@rucken/web';
import { ConfirmModalComponent } from '@rucken/web';

import { TodoChangeModalComponent } from './todo-change-modal/todo-change-modal.component';

@Component({
  selector: 'todo-changes-grid',
  templateUrl: './todo-changes-grid.component.html',
  styleUrls: ['./todo-changes-grid.component.scss'],
  entryComponents: [TodoChangeModalComponent, ConfirmModalComponent]
})
export class TodoChangesGridComponent extends BaseResourcesGridComponent {

  @Input()
  project?: ShortTodoProject;
  @Output()
  onSelectItems: EventEmitter<TodoChange[] | any>;
  @ViewChild('focusElement')
  focusElement: ElementRef;

  modelMeta: any = TodoChange.meta();
  items: TodoChange[];
  selectedItems: TodoChange[];
  cachedResourcesService: TodoChangesService;

  constructor(
    public todoChangesService: TodoChangesService,
    public accountService: AccountService,
    public app: AppService,
    public resolver: ComponentFactoryResolver,
    public translateService: TranslateService
  ) {
    super();
    this.cachedResourcesService = this.todoChangesService.createCache();
  }
  get readonly() {
    return this.hardReadonly || !(this.accessToAdd || this.accessToChange || this.accessToDelete);
  }
  showCreateModal() {
    if (this.modalIsOpened) {
      return;
    }
    this.modalIsOpened = true;
    const itemModal: TodoChangeModalComponent = this.app.modals(this.resolver).create(TodoChangeModalComponent);
    itemModal.account = this.accountService.account;
    itemModal.readonly = this.hardReadonly || !this.accessToAdd;
    itemModal.text = this.translateService.instant('Create');
    itemModal.title = this.translateService.instant('Create new todo change');
    itemModal.onOk.subscribe(($event: any) => this.save($event));
    itemModal.onClose.subscribe(() => this.focus());
    itemModal.item = new TodoChange();
    itemModal.item.project = this.project;
    itemModal.modal.show();
    this.selectedItems = [itemModal.item];
  }
  showEditModal(item: TodoChange) {
    if (this.modalIsOpened) {
      return;
    }
    this.modalIsOpened = true;
    const itemModal: TodoChangeModalComponent = this.app.modals(this.resolver).create(TodoChangeModalComponent);
    itemModal.account = this.accountService.account;
    itemModal.readonly = this.hardReadonly || !this.accessToChange;
    itemModal.text = this.translateService.instant('Save');
    itemModal.title = this.translateService.instant('Edit todo change');
    if (itemModal.readonly) {
      itemModal.title = this.translateService.instant('Todo change info');
    }
    itemModal.onOk.subscribe(($event: any) => this.save($event));
    itemModal.onClose.subscribe(() => this.focus());
    itemModal.item = new TodoChange(item);
    itemModal.modal.show();
    this.selectedItems = [itemModal.item];
  }
  showRemoveModal(item: TodoChange) {
    if (this.modalIsOpened) {
      return;
    }
    this.modalIsOpened = true;
    const confirm: ConfirmModalComponent = this.app.modals(this.resolver).create(ConfirmModalComponent);
    confirm.size = 'md';
    confirm.title = this.translateService.instant('Remove');
    confirm.message = this.translateService.instant('Are you sure you want to remove a todo change?');
    confirm.onOk.subscribe(($event: any) => this.remove($event));
    confirm.onClose.subscribe(() => this.focus());
    this.selectedItems = [item];
    confirm.modal.show();
  }
  save(itemModal: TodoChangeModalComponent) {
    this.cachedResourcesService.save(itemModal.item).subscribe(
      (todoChange: TodoChange) => {
        itemModal.modal.hide();
      }, (errors: any) => {
        if (errors.message) {
          this.app.component.showErrorModal(errors.message.join(', ')).subscribe(
            () => {
              itemModal.info.emit({ name: '' });
            });
        } else {
          itemModal.errors.emit(errors);
        }
      });
  }
  remove(itemModal: ConfirmModalComponent) {
    this.cachedResourcesService.remove(this.selectedItems).subscribe(
      () => {
        itemModal.modal.hide();
      },
      (errors: any) => {
        if (errors.message) {
          this.app.component.showErrorModal(errors.message.join(', ')).subscribe(
            () => {
              this.focus();
            });
        } else {
          itemModal.errors.emit(errors);
        }
      });
  }
  search(ignoreCache?: boolean) {
    const filter: any = {};
    filter.project = this.project && this.project.pk ? this.project.pk : null;
    this.cachedResourcesService.ignoreCache = ignoreCache;
    this.searchWithMockedItems(filter);
  }
}