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