directory.SearchView = Backbone.View.extend({
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        $('#search', this.el).html(new directory.SearchFormView({model:this.model}).render().el);
        var searchResults=new directory.JobPostingCollection();
        $('#results', this.el).append(new directory.SearchListView({model: searchResults}).render().el);
        return this;
    }
});
directory.SearchFormView = Backbone.View.extend({
    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

directory.SearchListView = Backbone.View.extend({

    tagName:'ul',

    className:'nav nav-list',

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (jobPosting) {
            self.$el.append(new directory.SearchListItemView({model:jobPosting}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (jobPosting) {
            this.$el.append(new directory.SearchListItemView({model:jobPosting}).render().el);
        }, this);
        return this;
    }
});

directory.SearchListItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        // The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
        // layers, you can directly pass model.attributes to the template function
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        return this;
    }

});
directory.NewJobPostView = Backbone.View.extend({
	initialize: function () {
	        this.render();
    },
    events: {
	        "change" : "change",
	        "click .save" : "beforeSave",
	        "click .delete" : "cancelAdd"
    },
    render:function () {
	  console.log(this.model);
	  $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    change: function (event) {
        // Remove any existing alert message
        directory.utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            directory.utils.addValidationError(target.id, check.message);
        } else {
            directory.utils.removeValidationError(target.id);
        }
    },
    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            directory.utils.displayValidationErrors(check.messages);
            return false;
        }
        // Upload picture file if a new file was dropped in the drop area
        /*if (this.pictureFile) {
            this.model.set("picture", this.pictureFile.name);
            utils.uploadFile(this.pictureFile,
                function () {
                    self.saveWine();
                }
            );
        } else {*/
            this.saveJob();
        //}
        return false;
    },
    saveJob: function () {
        var self = this;
        var eid=this.model.attributes.postedBy.id;
        this.model.save(null, {
			url: "http://frozen-reaches-5015.herokuapp.com/employees"+eid+"/postJob",
            success: function (model) {
                self.render();
                console.log(model);
                //app.navigate('employees/' + model.postedBy.id, false);
                directory.utils.showAlert('Success!', 'Job posted successfully', 'alert-success');
            },
            error: function () {
                directory.utils.showAlert('Error', 'An error occurred while trying to save this job', 'alert-error');
            }
        });
    },

    cancelAdd: function () {
        this.model.destroy({
            success: function () {
                window.history.back();
            }
        });
        return false;
    }
});