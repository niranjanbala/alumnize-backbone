directory.JobPosting = Backbone.Model.extend({

    urlRoot:"http://frozen-reaches-5015.herokuapp.com/employees",
    defaults: {
	        id: null,
	        title: "",
	        description: "",
	        company: "",
	        lastDate: "",
	        postedBy: null
	},
    initialize:function () {
 		this.validators = {};
    },
    validateItem: function (key) {
	        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
	},
    validateAll: function () {
        var messages = {};
	        for (var key in this.validators) {
	            if(this.validators.hasOwnProperty(key)) {
	                var check = this.validators[key](this.get(key));
	                if (check.isValid === false) {
	                    messages[key] = check.message;
	                }
	            }
	        }

	        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

});

directory.JobPostingCollection = Backbone.Collection.extend({
    model: directory.JobPosting
});