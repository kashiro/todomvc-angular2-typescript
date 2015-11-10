/// <reference path="../typings/tsd.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var store_1 = require('./services/store');
var ESC_KEY = 27;
var ENTER_KEY = 13;
var TodoApp = (function () {
    function TodoApp() {
        this.todoStore = new store_1.TodoStore();
    }
    TodoApp.prototype.stopEditing = function (todo, editedTitle) {
        todo.setTitle(editedTitle.value);
        todo.editing = false;
    };
    TodoApp.prototype.cancelEditingTodo = function (todo) { todo.editing = false; };
    TodoApp.prototype.updateEditingTodo = function (editedTitle, todo) {
        editedTitle = editedTitle.value.trim();
        todo.editing = false;
        if (editedTitle.length === 0) {
            return this.todoStore.remove(todo.uid);
        }
        todo.setTitle(editedTitle);
    };
    TodoApp.prototype.editTodo = function (todo) {
        todo.editing = true;
    };
    TodoApp.prototype.removeCompleted = function () {
        this.todoStore.removeCompleted();
    };
    TodoApp.prototype.toggleCompletion = function (uid) {
        this.todoStore.toggleCompletion(uid);
    };
    TodoApp.prototype.remove = function (uid) {
        this.todoStore.remove(uid);
    };
    TodoApp.prototype.addTodo = function ($event, newtodo) {
        if ($event.which === ENTER_KEY && newtodo.value.trim().length) {
            this.todoStore.add(newtodo.value);
            newtodo.value = '';
        }
    };
    TodoApp = __decorate([
        angular2_1.Component({
            selector: 'todo-app'
        }),
        angular2_1.View({
            directives: [angular2_1.NgIf, angular2_1.NgFor],
            template: "\n    <section class=\"todoapp\">\n      <header class=\"header\">\n        <h1>todos</h1>\n        <input class=\"new-todo\" type=\"text\" placeholder=\"What needs to be done?\" autofocus\n          #newtodo\n          (keyup)=\"addTodo($event, newtodo)\">\n      </header>\n      <section class=\"main\" *ng-if=\"todoStore.todos.length > 0\">\n        <input class=\"toggle-all\" type=\"checkbox\"\n          *ng-if=\"todoStore.todos.length\"\n          #toggleall\n          [checked]=\"todoStore.allCompleted()\"\n          (click)=\"todoStore.setAllTo(toggleall)\">\n        <ul class=\"todo-list\">\n          <li *ng-for=\"#todo of todoStore.todos\" [class.completed]=\"todo.completed\" [class.editing]=\"todo.editing\">\n            <div class=\"view\">\n              <input class=\"toggle\" type=\"checkbox\"\n                (click)=\"toggleCompletion(todo.uid)\"\n                [checked]=\"todo.completed\">\n              <label (dbclick)=\"editTodo(todo)\">{{todo.title}}</label>\n              <button class=\"destroy\" (click)=\"remove(todo.uid)\"></button>\n            </div>\n            <input class=\"edit\" type=\"text\"\n              *ng-if=\"todo.editing\"\n              [value]=\"todo.title\"\n              #editedtodo\n              (blur)=\"stopEditing(todo, editedtodo)\"\n              (keyup.enter)=\"updateEditingTodo(editedtodo, todo)\"\n              (keyup.escape)=\"cancelEditingTodo(todo)\">\n          </li>\n        </ul>\n      </section>\n      <footer class=\"footer\" *ng-if=\"todoStore.todos.length > 0\">\n        <span class=\"todo-count\"><strong>{{todoStore.getRemaining().length}}</strong>{{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left</span>\n        <button class=\"clear-completed\" *ng-if=\"todoStore.getCompleted().length > 0\" (click)=\"removeCompleted()\">Clear completed</button>\n      </footer>\n    </section>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TodoApp);
    return TodoApp;
})();
angular2_1.bootstrap(TodoApp);

//# sourceMappingURL=app.js.map
