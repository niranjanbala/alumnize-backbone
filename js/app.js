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
        "employees/:id/searchJobs":    "searchJobs",
        "employees/:id/postJob":    "postJob"
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
    },
    postJob: function (id) {
        var employee = new directory.Employee({id: id});

        var self = this;
        employee.fetch({
            success: function (data) {
				var post = new directory.JobPosting({id: null, postedBy:data.attributes});
                self.$content.html(new directory.NewJobPostView({model: post}).el);
            }
        });
        directory.shellView.selectMenuItem();
    }
});
directory.utils = {

    uploadFile: function (file, callbackSuccess) {
        var self = this;
        var data = new FormData();
        data.append('file', file);
        $.ajax({
            url: 'api/upload.php',
            type: 'POST',
            data: data,
            processData: false,
            cache: false,
            contentType: false
        })
        .done(function () {
            console.log(file.name + " uploaded successfully");
            callbackSuccess();
        })
        .fail(function () {
            self.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
        });
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },

    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    }

};
$(document).on("ready", function () {
    directory.loadTemplates(["ShellView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView","SearchView","SearchFormView","SearchListItemView","NewJobPostView"],
        function () {
            directory.router = new directory.Router();
            Backbone.history.start();
        });
});
