var foodApp = {};
// this is the function to get the whole app running 

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var userLat,
    userLng;

// this is the document ready 
// this is also where the app or the main function is being initialized
$(function() {
	$('#map').hide();
	foodApp.init();
	jQuery("h1").fitText(0.9, { minFontSize: '30px', maxFontSize: '100px'});
	jQuery("h2").fitText(0.9, { minFontSize: '18px', maxFontSize: '80px'});
	jQuery("h3").fitText(1.5, { minFontSize: '18px', maxFontSize: '40'});
	jQuery("h4").fitText(1.5, { minFontSize: '18px', maxFontSize: '27'});
	// $('#map').show();
});

// jQuery("p").fitText(1.5, { minFontSize: '12px', maxFontSize: '17'});
// this is where the foodApp function is declared and set as
foodApp.init = function() {
	foodApp.getTheAddresses();
	// $('#map').show();
};

// variable to set what to search for
var thingToSearchFor = 'Halal';

// the ajax request to the api to get the needed info
// the .then function is also set inside 
foodApp.getVenues = function(query) {
	$.ajax({
		url: 'https://api.foursquare.com/v2/venues/explore',
		method: 'GET',
		dataType: 'json',
		data : {
			// categoryId: '52e81612bcbc57f1066b79ff',
			ll: query	,
			client_id: 'MBSEMBQ3O1LZQFSPDR003FU1UD4PS43FAUOLDOD0CMYW25LR',
			client_secret: 'FEVRA3JSFUTS5T1QFEHJNNVFSM5IRBQ32Z124DLCKO0LEZQE',
			query: thingToSearchFor,
			v: 20160217,
			radius: 5500,
			// limit:150
			}
		}).then(function(data) {
			console.log(data)
			// foodApp.thing = data;
			// console.log(data.response.groups[0].items)
			foodApp.displayVenues(data.response.groups[0].items)
	});
};		

// this is the .each method to loop through the objects
//variables are assigned to the needed info: name, phone number, address, lat , and lng
foodApp.displayVenues = function(pieces){
	console.log(pieces);
	$.each(pieces, function(i, piece) {
		var marker = new google.maps.Marker({
			map: map,
			position: {
				lat: piece.venue.location.lat,
				lng: piece.venue.location.lng
			},
			animation: google.maps.Animation.DROP,
			label: labels[labelIndex++ % labels.length],
		});
		var restaurantName = $('<h2>').text(piece.venue.name);
		var restaurantPhone = $('<h3>').text(piece.venue.contact.formattedPhone);
   	var restaurantAddress = $('<h3>').text(piece.venue.location.formattedAddress);
  	var restaurantLat = piece.venue.location.lat;
  	var restaurantLng = piece.venue.location.lng;
		// console.log(restaurantLng);
		var restaurantChoices = $('<div>').addClass('eateries').append(restaurantName, restaurantPhone, restaurantAddress);

		var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function() {
       infowindow.setContent(piece.venue.name);
       infowindow.open(map, this);
    });

		$('#options').append(restaurantChoices);
	});
};

// var initMap;
	// Here we initial a new google maps.
	// We need to store that object on a variable.
	var map;
	function initMap () {
		// This is where the new map is created
	  	map = new google.maps.Map(document.getElementById('map'), {
	  		//You can set a center
	    	center: {lat: 43.7000, lng: -79.4000},
	    	//0-18
	    	zoom: 12
	  	});
	}

// foodApp.thing.response.groups[0].items[0].venue.name
foodApp.getLocation = function(moreData) {
	var promise = $.ajax({
		url:'https://maps.googleapis.com/maps/api/geocode/json',
		method: 'GET',
		dataType: 'json',
		data: {
			address: moreData // latitude and longitude need to go here 
		}
	}).then(function(pizza) {
		// console.log(pizza)
		userLat = (pizza.results[0].geometry.location.lat);
		userLng = (pizza.results[0].geometry.location.lng);
		
		//We're debugging to see if the api call is correctly translating scarborough into coordinates
		console.log("user latitude: " + userLat + ", user longitude: " + userLng);
		
			var marker = new google.maps.Marker({
				// We need to pass to the position property
				// and object with the keys lat and lng 
				position: {
				lat: userLat,
				lng: userLng,
				},
				// and we need to set which map we want it to live on
				icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
				map: map
			});
			var infowindow = new google.maps.InfoWindow({
			  content:"You are Here!"
			  });

			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
		 	});
	});
	
	return promise;
}


// get user's location from input form
foodApp.getTheAddresses = function (query){

	$('#theForm').on('submit', function(e){
		e.preventDefault();
		var currentLocation = $('#userAddress').val(); 
		// $('<p>').text(currentLocation);
		console.log(currentLocation);
		foodApp.getLocation(currentLocation).done(function(){
			foodApp.getVenues(userLat + ','+ userLng);
			 $('#userAddress').val('');
		});
		$('body').animate( {
			scrollTop: $('.results').offset().top}, 2000);
		$('#map').show();
		google.maps.event.trigger(document.getElementById('map'), 'resize');
		google.maps.event.addListenerOnce(map, 'idle', function() {
       google.maps.event.trigger(map, 'resize');
       map.setCenter({lat:userLat,lng:userLng});
    });
	});
}	


$('.arrow').on('click', function(e) {
	e.preventDefault();
$('body').animate( { 
  scrollTop: $('#selection').offset().top}, 500);
}); 
