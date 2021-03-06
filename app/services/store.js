/// <reference path="../../typings/tsd.d.ts" />
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
var STORAGE_KEY = 'angular2-todos';
var angular2_1 = require('angular2/angular2');
var storage = {
    getItem: function () {
        var data = localStorage.getItem(STORAGE_KEY) || '[]';
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            data = [];
        }
        return data;
    },
    setItem: function (data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
};
var Todo = (function () {
    function Todo(title) {
        this.uid = Date.now().toString();
        this.title = title.trim();
        this.completed = false;
        this.editing = false;
    }
    Todo.prototype.setTitle = function (title) {
        this.title = title.trim();
    };
    return Todo;
})();
exports.Todo = Todo;
var TodoStore = (function () {
    function TodoStore(filter) {
        this.todos = this.importData();
        this.todos = this.filterList(filter);
    }
    TodoStore.prototype._updateStore = function () {
        storage.setItem(this.todos);
    };
    TodoStore.prototype.importData = function () {
        var persistedTodos = storage.getItem();
        return persistedTodos.map(function (todo) {
            var ret = new Todo(todo.title);
            ret.completed = todo.completed;
            ret.uid = todo.uid;
            return ret;
        });
    };
    TodoStore.prototype.filterList = function (filter) {
        if (filter === '/active') {
            return this.get({ completed: false });
        }
        else if (filter === '/completed') {
            return this.get({ completed: true });
        }
        else {
            return this.importData();
        }
    };
    TodoStore.prototype.get = function (state) {
        return this.todos.filter(function (todo) { return todo.completed === state.completed; });
    };
    TodoStore.prototype.add = function (title) {
        this.todos.push(new Todo(title));
        this._updateStore();
    };
    TodoStore.prototype.remove = function (uid) {
        for (var _i = 0, _a = this.todos; _i < _a.length; _i++) {
            var todo = _a[_i];
            if (todo.uid === uid) {
                this.todos.splice(this.todos.indexOf(todo), 1);
                break;
            }
        }
        this._updateStore();
    };
    TodoStore.prototype.allCompleted = function () {
        return this.todos.length === this.getCompleted().length;
    };
    TodoStore.prototype.setAllTo = function (toggler) {
        this.todos.forEach(function (todo) { return todo.completed = toggler.checked; });
        this._updateStore();
    };
    TodoStore.prototype.removeCompleted = function () {
        this.todos = this.get({ completed: false });
        this._updateStore();
    };
    TodoStore.prototype.getRemaining = function () {
        return this.get({ completed: false });
    };
    TodoStore.prototype.getCompleted = function () {
        return this.get({ completed: true });
    };
    TodoStore.prototype.toggleCompletion = function (uid) {
        for (var _i = 0, _a = this.todos; _i < _a.length; _i++) {
            var todo = _a[_i];
            if (todo.uid === uid) {
                todo.completed = !todo.completed;
                break;
            }
        }
        this._updateStore();
    };
    TodoStore = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [String])
    ], TodoStore);
    return TodoStore;
})();
exports.TodoStore = TodoStore;

//# sourceMappingURL=store.js.map
