/**
 * Created by MiguelElias on 02/01/2016.
 */
Websites = new Mongo.Collection("websites");

Websites.allow({
	update:function(userId, doc){
		console.log("testing security on website update");
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update  (rate) the image. 
			return false;
		}
	},

	insert:function(userId, doc){
		console.log("testing security on website insert");
		if (Meteor.user()){
			return true;	
		}
		else {
			return false;
		}
	}, 
	remove:function(userId, doc){
		return true;
	}
})