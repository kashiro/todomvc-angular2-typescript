/// <reference path="../../typings/tsd.d.ts" />

const STORAGE_KEY = 'angular2-todos';

import {Injectable} from 'angular2/angular2';

let storage = {
  getItem() {
    let data = localStorage.getItem(STORAGE_KEY) || '[]';
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = [];
    }
    return data;
  },
  setItem(data: Array<Todo>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export class Todo {
  completed: Boolean;
  editing: Boolean;
  title: String;
  uid: String;

  constructor(title: String) {
    this.uid = Date.now().toString();
    this.title = title.trim();
    this.completed = false;
    this.editing = false;
  }

  setTitle(title: String) {
    this.title = title.trim();
  }
}

@Injectable()
export class TodoStore {
  todos: Array<Todo>;
  constructor(filter: String) {
    this.todos = this.importData();
    this.todos = this.filterList(filter);
  }
  _updateStore() {
    storage.setItem(this.todos);
  }
  importData() {
    let persistedTodos = storage.getItem();
    return persistedTodos.map((todo: {title: String, completed: Boolean, uid: String}) => {
      let ret = new Todo(todo.title);
      ret.completed = todo.completed;
      ret.uid = todo.uid;
      return ret;
    });
  }
  filterList(filter: String) {
    if (filter === '/active') {
      return this.get({completed: false});
    } else if (filter === '/completed') {
      return this.get({completed: true});
    } else {
      return this.importData();
    }
  }
  get(state: {completed: Boolean}) {
    return this.todos.filter((todo: Todo) => todo.completed === state.completed);
  }
  add(title: String) {
    this.todos.push(new Todo(title));
    this._updateStore();
  }
  remove(uid: String) {
    for (let todo of this.todos) {
      if (todo.uid === uid) {
        this.todos.splice(this.todos.indexOf(todo), 1);
        break;
      }
    }
    this._updateStore();
  }
  allCompleted() {
    return this.todos.length === this.getCompleted().length;
  }
  setAllTo(toggler: {checked: Boolean}) {
    this.todos.forEach((todo: Todo) => todo.completed = toggler.checked);
    this._updateStore();
  }
  removeCompleted() {
    this.todos = this.get({completed: false});
    this._updateStore();
  }
  getRemaining() {
    return this.get({completed: false});
  }
  getCompleted() {
    return this.get({completed: true});
  }
  toggleCompletion(uid: String) {
    for (let todo of this.todos) {
      if (todo.uid === uid) {
        todo.completed = !todo.completed;
        break;
      }
    }
    this._updateStore();
  }
}
