var native = true;

if(!isPhoneGap()) {
	native = false;
	setTimeout(function() { onDeviceReady(); }, 500); //this is the browser
	// load FB SDK and proceed when loaded
	$.getScript( "http://connect.facebook.net/en_US/all.js", function( data, textStatus, jqxhr ) {
		facebookSDKLoaded();
	});
	alert = function(param) { console.log('!!! ALERT'); console.log(param); console.log('ALERT !!!'); }
} else {
	document.addEventListener("deviceready", onDeviceReady, false);
	//proceed immediately, FB SDK is loaded locally via PhoneGap
	facebookSDKLoaded();
}

 <!-- These are the notifications that are displayed to the user through pop-ups if the above JS files does not exist in the same directory-->
if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

function facebookSDKLoaded(){
	FB.Event.subscribe('auth.login', function(response) {
					   alert('auth.login event');
					   });

	FB.Event.subscribe('auth.logout', function(response) {
					   alert('auth.logout event');
					   });

	FB.Event.subscribe('auth.sessionChange', function(response) {
					   alert('auth.sessionChange event');
					   });

	FB.Event.subscribe('auth.statusChange', function(response) {
					   alert('auth.statusChange event');
					   });
}
	/*function getSession() {
		alert("session: " + JSON.stringify(FB.getSession()));
	}
	*/
	function getLoginStatus() {
		FB.getLoginStatus(function(response) {
						  if (response.status == 'connected') {
						  alert('logged in');
						  } else {
						  alert('not logged in');
						  }
						  });
	}
	var friendIDs = [];
	var fdata;
	var data = document.getElementById('data');
	function friends() {
		FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
			if (response.error) {
				alert(JSON.stringify(response.error));
			} else {
				data.innerHTML = '';
				fdata=response.data;
				console.log("fdata: ");
				console.log(fdata);
				response.data.forEach(function(item) {
					var d = document.createElement('div');
					d.innerHTML = '<img src="'+item.picture.data.url+'"/>'+item.name;
					data.appendChild(d);
				});
			}
			var friends = response.data;
			console.log(friends.length); 
			for (var k = 0; k < friends.length && k < 200; k++) {
			var friend = friends[k];
			var index = 1;

			friendIDs[k] = friend.id;
			//friendsInfo[k] = friend;
			}
			console.log("friendId's: "+friendIDs);
		});
	}
	
	function me() {
		data.innerHTML = '';
		FB.api('/me/picture',
			{
				"redirect": false,
				"height": "200",
				"type": "normal",
				"width": "200"
			},
			function(response) {
			if (response.error) {
				alert(JSON.stringify(response.error));
			} else {
				console.log(response);
				var i=0;
				
				var d = document.createElement('div');
				d.innerHTML = '<img src="'+response.data.url+'"/>';
				data.appendChild(d);
			}
		});
		FB.api('/me', function(response) {
			if (response.error) {
				alert(JSON.stringify(response.error));
			} else {
				console.log(response);
				var i=0;
				for(var key in response)
				{	if(response.hasOwnProperty(key)) {
						 var d = document.createElement('div');
						 d.innerHTML = key+":"+response[key];
						 data.appendChild(d);
					}
				}
			}
		});
	}

	function logout() {
		FB.logout(function(response) {
				  alert('logged out');
				  });
	}

	function login() {
		FB.login(
				 function(response) {
				 if (response.session) {
				 alert('logged in');
				 } else {
				 alert('not logged in');
				 }
				 },
				 { scope: "email" }
				 );
	}
				
				
	function facebookWallPost() {
		console.log('Debug 1');
			var params = {
				method: 'feed',
				name: 'Facebook Dialogs',
				link: 'https://developers.facebook.com/docs/reference/dialogs/',
				picture: 'http://fbrell.com/f8.jpg',
				caption: 'Reference Documentation',
				description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
			  };
			console.log(params);
		FB.ui(params, function(obj) { console.log(obj);});
	}

	function publishStoryFriend() {
			randNum = Math.floor ( Math.random() * friendIDs.length ); 

			var friendID = friendIDs[randNum];
			if (friendID == undefined){
					alert('please click the me button to get a list of friends first');
			}else{
				console.log("friend id: " + friendID );
			console.log('Opening a dialog for friendID: ', friendID);
			var params = {
					method: 'feed',
				to: friendID.toString(),
				name: 'Facebook Dialogs',
				link: 'https://developers.facebook.com/docs/reference/dialogs/',
				picture: 'http://fbrell.com/f8.jpg',
				caption: 'Reference Documentation',
				description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
				 };
					FB.ui(params, function(obj) { console.log(obj);});
		}
	}
			
/**
 * Determine whether the file loaded from PhoneGap or not
 */
function isPhoneGap() {
    /*return (PhoneGap || phonegap)*/ 
    return /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function isAndroid() {
    /*return (PhoneGap || phonegap)*/ 
    return /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /android/i.test(navigator.userAgent);
}

function isIOS() {
    /*return (PhoneGap || phonegap)*/ 
    return /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /iphone /i.test(navigator.userAgent);
}

function onDeviceReady() {
	try {
		alert('Device is ready! Make sure you set your app_id below this alert. Splash hide');
		if(native) FB.init({ appId: "483801201662020", nativeInterface: CDV.FB, useCachedDialogs: false });
		else FB.init({ appId: "483801201662020", useCachedDialogs: false });
		document.getElementById('data').innerHTML = "";
	} catch (e) {
		alert(e);
	}
	if(native) navigator.splashscreen.hide();
}
