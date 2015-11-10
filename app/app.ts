/// <reference path="../typings/tsd.d.ts" />

import {Component, View, bootstrap, NgIf, NgFor, provide} from 'angular2/angular2';
import {
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  Location,
  LocationStrategy,
  HashLocationStrategy
} from 'angular2/router';
import {TodoStore, Todo} from './services/store';

const ESC_KEY = 27;
const ENTER_KEY = 13;

@Component({
  selector: 'todo-app'
})
@View({
  directives: [NgIf, NgFor, ROUTER_DIRECTIVES],
  template: `
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" type="text" placeholder="What needs to be done?" autofocus
          #newtodo
          (keyup)="addTodo($event, newtodo)">
      </header>
      <section class="main" *ng-if="todoStore.todos.length > 0">
        <input class="toggle-all" type="checkbox"
          *ng-if="todoStore.todos.length"
          #toggleall
          [checked]="todoStore.allCompleted()"
          (click)="todoStore.setAllTo(toggleall)">
        <ul class="todo-list">
          <li *ng-for="#todo of todoStore.todos" [class.completed]="todo.completed" [class.editing]="todo.editing">
            <div class="view">
              <input class="toggle" type="checkbox"
                (click)="toggleCompletion(todo.uid)"
                [checked]="todo.completed">
              <label (dbclick)="editTodo(todo)">{{todo.title}}</label>
              <button class="destroy" (click)="remove(todo.uid)"></button>
            </div>
            <input class="edit" type="text"
              *ng-if="todo.editing"
              [value]="todo.title"
              #editedtodo
              (blur)="stopEditing(todo, editedtodo)"
              (keyup.enter)="updateEditingTodo(editedtodo, todo)"
              (keyup.escape)="cancelEditingTodo(todo)">
          </li>
        </ul>
      </section>
      <footer class="footer" *ng-if="location.path() !== '' || todoStore.todos.length > 0">
        <span class="todo-count"><strong>{{todoStore.getRemaining().length}}</strong>{{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left</span>
        <ul class="filters">
          <li>
            <a [class.selected]="location.path() === ''" href="/#/">All</a>
          </li>
          <li>
            <a [class.selected]="location.path() === '/active'" href="/#/active">Active</a>
          </li>
          <li>
            <a [class.selected]="location.path() === '/completed'" href="/#/completed">Completed</a>
          </li>
        </ul>
        <button class="clear-completed" *ng-if="todoStore.getCompleted().length > 0" (click)="removeCompleted()">Clear completed</button>
      </footer>
    </section>
  `
})

class TodoApp {
  todoStore: TodoStore;
  location: Location;
  constructor(location: Location) {
    this.todoStore = new TodoStore(location.path());
    this.location = location;
  }
  stopEditing(todo: Todo, editedTitle) {
    todo.setTitle(editedTitle.value);
    todo.editing = false;
  }
  cancelEditingTodo(todo: Todo) { todo.editing = false; }
  updateEditingTodo(editedTitle, todo: Todo) {
    editedTitle = editedTitle.value.trim();
    todo.editing = false;
    if (editedTitle.length === 0) {
      return this.todoStore.remove(todo.uid);
    }
    todo.setTitle(editedTitle);
    // TODO todoupdate storage
  }
  editTodo(todo: Todo) {
    todo.editing = true;
  }
  removeCompleted() {
    this.todoStore.removeCompleted();
  }
  toggleCompletion(uid: String) {
    this.todoStore.toggleCompletion(uid);
  }
  remove(uid: String) {
    this.todoStore.remove(uid);
  }
  addTodo($event, newtodo) {
    if ($event.which === ENTER_KEY && newtodo.value.trim().length) {
      this.todoStore.add(newtodo.value);
      newtodo.value = '';
    }
  }
}

bootstrap(TodoApp, [ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
