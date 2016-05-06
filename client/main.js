
/// routing 

Router.configure({
  layoutTemplate: 'ApplicationLayout'
 });

 Router.route('/', function () {
  this.render('navbar', {
    to: "navbar"
  });
  this.render('main_template', {
    to: "main"
  });
});
        
// Add Route to the single website 

Router.route('/:title/:_id', function(){

    this.render('navbar',{
       to: "navbar"
    });

    this.render('single_website',{
    	to: "main",
    	data: function(){   		
    		return Websites.findOne({_id:this.params._id});
		}

    });

});


/// Done in the Lib folder 

/* Websites = new Mongo.Collection("websites"); */ 

if (Meteor.isClient) {

	/* We get the username as well as the email fields during the user signup */

    Accounts.ui.config ({
      passwordSignupFields: "USERNAME_AND_EMAIL"
    });

    /* Configure the bootstrap library for the comments package */
    Comments.ui.config({
   		template: 'bootstrap' // or ionic, semantic-ui
	});


	/////
	// template helpers 
	/////

	

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites: function(){
			if(Session.get('search_entered')){
       console.log('The search text entered is '+Session.get('search_entered'));
     //  return Websites.find({title:'/'+Session.get('search_entered')+'/'});
      var result =  Websites.find({"title":{$regex :'.*'+ Session.get('search_entered') +'.*'}});
      console.log(result.count());
      if(result.count() == 0){
         Session.set('noFound',true);
       }
       else {
         return result;
       }
			}
			else {
			   return Websites.find({},{sort:{upvote_count:-1}});
			}

		},
    search_result:function(){
       if (!Session.get('noFound')){
        return true;
       }
       else {
        return false;
       }
    }
	});


	/////
	// template events 
	/////

	Template.navbar.events({
		"submit .js-search-website":function(event){

			var search_text = event.target.searchbox.value;
			//console.log("This is the search text entrered "+ search_text);
			if(search_text){
        Session.set('noFound',false);
				Session.set('search_entered',search_text);
		    }
        else {
          Session.set('noFound',false);
          Session.set('search_entered',undefined);
        }

			return false;  // stop the form submit from reloading the page

		}
	});

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+ website_id);
			
			// put the code in here to add a vote to a website!			
			
			var upvote_count = this.upvote_count;
			upvote_count += 1;	

			Websites.update({_id:website_id},{$set: {upvote_count: upvote_count}});

      /* If the user is logged in update the upvote content of the site!
      Code for the Website recommender, work later on!  */

      /*
      if(Meteor.user()){
        if(Userprofile.findOne({username:Meteor.user().username})){
             var user_id = Userprofile.findOne({username:Meteor.user().username})._id;
             Userprofile.update({_id:user_id},{$set:{profile:
              {
                title:this.title,
                upvotes:1
              }
            }}
            )
            console.log(user_upvotecount()); 

        } // user already exists
        else { // Insert the user profile in the collection 
            Userprofile.insert({
            username:Meteor.user().username,
            profile: {
                    title:this.title,
                    upvotes:1
                  }
          });
        }
    }
    */
			 
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+ website_id);

			// put the code in here to remove a vote from a website!

			var downvote_count = this.downvote_count;
			downvote_count += 1;	

			Websites.update({_id:website_id},{$set: {downvote_count: downvote_count}});

			return false;// prevent the button from reloading the page
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			
			var url = event.target.url.value;
			var title =  event.target.title.value;
			var description = event.target.description.value; 

		/*
    	console.log("The url they entered is: "+url);
			console.log("The title of they entered is: "+title);
			console.log("The descritption they entered is: "+ description);
    */
			//  put your website saving code in here!	

			 if(Meteor.user()){
          		Websites.insert({
	              title: title,
	              url: url,
	              description: description,
	              createdOn: new Date(),
	              createdBy: Meteor.user()._id, 
	              upvote_count: 0,
    			  downvote_count: 0
          		});
       		 }     

			return false;// stop the form submit from reloading the page

		}
	});


/*
function user_upvotecount(){
   if(Meteor.user){
      var object =  Userprofile.findOne({username:Meteor.user().username});
      return object.profile;
     //return Userprofile.findOne({"profile.title":this.title});
   }
   else {
    return;
   }

}
*/






/*
	Template.http_request.events({

		"submit .js-http-request":function(event){
			var url = event.target.url_1.value;
			if(Meteor.isServer){
				console.log("I am running on the server! ")
				var response = HTTP.call('GET',url,{});
            	console.log(response);
        		}
			}

	});
*/

	
}

/*

if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date(),
    		upvote_count: 0,
    		downvote_count: 0
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date(),
    		upvote_count: 0,
    		downvote_count: 0
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date(),
    		upvote_count: 0,
    		downvote_count: 0
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date(),
    		upvote_count: 0,
    		downvote_count: 0
    	});
    }
  });
}

*/
