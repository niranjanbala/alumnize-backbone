var directory = {
    views: {},
    models: {},
    loadTemplates: function(views, callback) {
        var deferreds = [];
        $.each(views, function(index, view) {
            if (directory[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    directory[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });
        $.when.apply(null, deferreds).done(callback);
    }
};

directory.Router = Backbone.Router.extend({
    routes: {
        "":                 "home",
        "employees/:id":    "employeeDetails",
        "employees/:id/searchJobs":    "searchJobs"
    },
    initialize: function () {
        directory.shellView = new directory.ShellView();
        $('body').html(directory.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#content");
    },

    home: function () {

    },
    employeeDetails: function (id) {
        var employee = new directory.Employee({id: id});
        var self = this;
        employee.fetch({
            success: function (data) {
                console.log(data);
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                self.$content.html(new directory.EmployeeView({model: data}).render().el);
            }
        });
        directory.shellView.selectMenuItem();
    },
    searchJobs: function (id) {
        var employee = new directory.Employee({id: id});
        var self = this;
        employee.fetch({
            success: function (data) {
                self.$content.html(new directory.SearchView({model: data}).render().el);
            }
        });
        directory.shellView.selectMenuItem();
    }
});

$(document).on("ready", function () {
    directory.loadTemplates(["ShellView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView","SearchView","SearchFormView","SearchListItemView"],
        function () {
            directory.router = new directory.Router();
            Backbone.history.start();
        });
});
