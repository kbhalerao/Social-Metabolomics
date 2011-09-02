// javascript functions when not logged in

index_helper = function() {
	$("a#signup").live('click', (function(e) {  
		$('form#signupform').remove();
		
		html = '<form id="signupform">' + 	
		'<p><label for="name">Name (required)</label><br />' +
		'<input id="name" name="name" value="" type="text" tabindex="1" /></p>'+
		'<p> <label for="email">Email Address (required)</label><br /> '+
		'<input id="email" name="email" value="" type="text" tabindex="2" /></p>' +
		'<p><label for="website">Website</label><br />' +
		'<input id="website" name="website" value="" type="text" tabindex="3" />' +
		'<p class="no-border">' +
		'<input class="button" value="Register" tabindex="4" />' +
		'&nbsp; &nbsp; <input class="button cancel" value="Not right now" tabindex="5" /></p>' + 
		'</form>';	
		
		$(e.target).parent().append(html);
	
	}));
	
	$("input.cancel").live('click', function(event) {  
		$("form#signupform").remove();  
		return false;  
	}); 
	
	$("a#login").click(function(e) {
		$('form#loginform').remove();
		
		html = '<form id="loginform">' + 	
		'<p><label for="name">Username</label><br />' +
		'<input id="username" name="username" value="" type="text" tabindex="1" /></p>'+
		'<p><label for="password">Password</label><br />' +
		'<input id="password" name="password" value="" type="password" tabindex="2" />' +
		'<p class="no-border">' +
		'<input class="button" value="Login" tabindex="3" />' +
		'</form>';	
		
		$(e.target).parent().append(html);
	});
	
	$('input[value="Register"]').live('click', function(e) {
			var user_doc = {};
			user_doc['name'] = $('input#name').val();
			user_doc['email'] = $('input#email').val();
			user_doc['web'] = $('input#website').val();
			
			if(validate(user_doc)) {
				//$.couch.signup
			}
			else {
				alert("inputs invalid");
			}
		});
	
	$('input[value="Login"]').live('click', function(e) {
		$.couch.login({
			name : $('input#username').val(),
			password : $('input#password').val(),
			success: function(data) {
				location.reload();
				},
			error: function(data) {
				alert("unable to log in");
				}
		});
	
	});
		
	$('a#logout').live('click', function(e) {
		 
		 $.couch.logout({
			success: function(data) {
				location.reload();
				},
			error: function(data) {
				console.log(data);
				}
			});
	
	});
			
}