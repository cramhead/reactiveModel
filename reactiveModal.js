var todos = new Meteor.Collection('todo');
var categories = new Meteor.Collection('category');

if (Meteor.isClient) {

    Template.todos.todoList = function() {
        return todos.find();
    }

    Template.todoDetails.categories = function() {
        return categories.find();
    }
    Template.todoDetails.currentCategory = function(context, test) {
        if(!test || !context) return "";
        if (test.toLowerCase() == context.toLowerCase()) {
            return ' selected="selected"';
        }
      }

    Template.todos.events({
        'click .save': function(event, template) {
          event.preventDefault();
            var chk = $("#todoCompleteCheckbox:checked").val();
            var checked = false;
            if (chk == 'on') {
                checked = true;
            }

            var noneCategory = categories.findOne({
                categoryName: "None"
            });
            todos.insert({
                "title": template.find("#todoName").value,
                "checked": checked,
                "categoryId": noneCategory._id
            });
            $("#todoName").val("");
            $('#todoCompleteCheckbox').val("");
            $("#addtodoModal").modal("hide");

        },
        'click .remove': function(event, template) {
          event.preventDefault();
            todos.remove({
                _id: this._id
            });
        }

    });

    Template.todoDetails.events({
        'click input:checkbox': function(event, template) {
          event.preventDefault();
            this.checked = !this.checked;
            todos.update({
                _id: this._id
            }, {
                $set: {
                    checked: this.checked
                }
            });
        },
        'change select': function(event, template) {
            event.preventDefault();
            console.log(EJSON.stringify(this.categoryId));
            var newValue = event.currentTarget.value;
            console.log(newValue);
            todos.update({
                _id: this._id
            }, {
                $set: {
                    categoryId: newValue
                }
            });
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        if (categories.find().count() === 0) {
            var listOfCategories = ["None", "Work", "Play", "Misc"];
            for (var i = listOfCategories.length - 1; i >= 0; i--) {
                categories.insert({
                    "categoryName": listOfCategories[i],
                    "order": i
                });

            };
        }

        if (todos.find().count() === 0) {
            var listOfTodos = ["Take out garbage", "Get modal working", "drink champagne"];
            var noneCategory = categories.findOne({
                categoryName: "None"
            });
            for (var i = listOfTodos.length - 1; i >= 0; i--) {
                todos.insert({
                    "title": listOfTodos[i],
                    "checked": false,
                    "order": i,
                    "categoryId": noneCategory._id
                });
            };
        }


    });
}
