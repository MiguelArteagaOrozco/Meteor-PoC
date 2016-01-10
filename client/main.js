/**
 * Created by MiguelElias on 02/01/2016.
 */

    /////
    // Routing
    /////

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('principal', {
    to:"main"
  });
});

Router.route('/details/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('website_detail', {
    to:"main", 
    data:function(){
      return Websites.findOne({_id:this.params._id});
    }
  });
});

    /////
    // template helpers
    /////

    // helper function that returns all available websites
Template.website_list.helpers({
    websites:function(){
        if(Session.get("filtertext")){
                return  Websites.find({title:{$in:[Session.get("filtertext")]}
                                      }, {sort: {votes: -1}});
                //return  Websites.find({$text:{$search:Session.get("filtertext")}}, {sort: {votes: -1}});
            }
        else
            return Websites.find({}, {sort: {votes: -1}});
    }
});
Template.website_list.events({
    'click .js-addFilter':function(event){
        if ($(".js-filtertext").val()) {
            if ($(".js-filtertext").val().length > 0) {
                Session.set("filtertext", $(".js-filtertext").val());
            }
        }
        else
            Session.set("filtertext", undefined);
    }
});

/// accounts config

Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

/////
// template events
/////

Template.website_item.events({
    "click .js-upvote":function(event){
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Up voting website with id "+website_id);
        // put the code in here to add a vote to a website!
        var website = Websites.findOne({_id:website_id});
        if(isNaN(website.votes)) website.votes = 0;

        Websites.update({_id:website_id}, 
                {$set: {votes:website.votes+1}});


        return false;// prevent the button from reloading the page
    },
    "click .js-downvote":function(event){

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Down voting website with id "+website_id);

        // put the code in here to remove a vote from a website!

        var website = Websites.findOne({_id:website_id});
        if(isNaN(website.votes)) website.votes = 0;

        Websites.update({_id:website_id}, 
                {$set: {votes:website.votes-1}});

        return false;// prevent the button from reloading the page
    }
})

Template.website_form.events({
    "click .js-toggle-website-form":function(event){
        $("#website_form").toggle('slow');
    },
    "submit .js-save-website-form":function(event){

        // here is an example of how to get the url out of the form:
        var url = event.target.url.value;
        var title = event.target.title.value;
        var desc = event.target.description.value;
        console.log("The url they entered is: "+url);

        //  put your website saving code in here!
        Websites.insert({
            title:title,
            url:url,
            description:desc,
            createdOn:new Date()
        });


        return false;// stop the form submit from reloading the page

    }
});

Template.website_detail.events({
    "click .js-addComment":function(event){
        var website_id = this._id;
        console.log("Up commenting website with id "+website_id);

        var website = Websites.findOne({_id:website_id});
        if(!website.comments) website.comments = [];

        var newComent = {
            user:  Meteor.user().username,
            comment: $(".js-newcomment").val()
        }

        website.comments.push(newComent)

        Websites.update({_id:website_id}, 
                {$set: {comments:website.comments}});


        return false;
    }
})