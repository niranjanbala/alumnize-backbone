directory.JobPosting = Backbone.Model.extend({

    urlRoot:"http://frozen-reaches-5015.herokuapp.com/employees",

    initialize:function () {
        this.reports = new directory.JobPostingCollection();
        this.reports.url = this.urlRoot + "/" + this.id + "/searchJobs";
    }

});

directory.JobPostingCollection = Backbone.Collection.extend({
    model: directory.JobPosting
});