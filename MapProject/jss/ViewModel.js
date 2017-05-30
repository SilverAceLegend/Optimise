function initMap() {
  var input = document.getElementById("home");
  var autocomplete = new google.maps.places.Autocomplete(input);
};

var myViewModel = function() {
  this.markerslist = ko.observableArray();
  this.headingList = ko.observable(false);
  this.selectedPlace = ko.observable();
  this.filterlist = ko.observableArray();

  var info="";
  var self = this;
  var map;
  var markers = [];
  var clickedmarker = [];
  var labels="123456789";
  var labelindex = 0;



  this.sethome = function () {
    var home = document.getElementById("home").value;
    var geocoder = new google.maps.Geocoder();
    if (home == "") {
      alert("No location selected!");
    } else {
      self.markerslist.removeAll();
      self.filterlist.removeAll();
      self.headingList(true);
      geocodeAddress(geocoder);
      }
  };

  function geocodeAddress(geocoder) {
    var address = document.getElementById("home").value;
    geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
    var baselatlong =(results[0].geometry.location);
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15
    });
    map.setCenter(results[0].geometry.location);
    searchplaces(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }})
  };

  function searchplaces(base) {
    hidemarkers(markers);
    var bounds = map.getBounds();
    var places = new google.maps.places.PlacesService(map);
    places.nearbySearch({
      location: base,
      radius: 500
    }, function(results, status) {
      console.log(results);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
      }else {
        alert('Markers was not successful for the following reason: ' + status);
      }});
  };

  function hidemarkers(marker) {
    for (i=0; i<marker.length; i++) {
      markers[i].setMap(null);}
  }

  function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var points = places.length;
    if (points < 6) {
      alert("Only "+(points-1)+" points of interest found");
      labelindex=0;
    }else {
      points = 6;
    };
    for (var i = 1; i < points; i++) {
      var place = places[i];
      self.markerslist.push({title:place.name,id:i});
      self.filterlist.push({title:place.name,id:i});
      var icon = {
        url: 'http://maps.google.com/mapfiles/ms/micons/red-pushpin.png',
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      var marker = new google.maps.Marker({
        icon:icon,
        map: map,
        title: place.name,
        position: place.geometry.location,
        id: place.id,
        animation: google.maps.Animation.DROP,
        label: labels[labelindex++]
      });
      // create infowindow
    //  var infowindow = new google.maps.InfoWindow({
    //    content: "<div>"+place.name+"</div>"
    //  });
      // If a marker is clicked, do a place details search on it in the next function.
      marker.addListener('click', function(holder) {
        self.animateicons(this);
      //  infowindow.open(map,this);
    }
);

      markers.push(marker);
    }
      labelindex=0;
  }

this.filter = function () {
  var filterChoice = self.selectedPlace();
  self.markerslist.removeAll();
  for (var i = 0 ; i < markers.length ; i++) {
    if (filterChoice == markers[i].title) {
      markers[i].setVisible(true);
      self.markerslist.push({title:markers[i].title,id:i});
    }else {
      if (filterChoice == null) {
        self.markerslist.push({title:markers[i].title,id:i});
        markers[i].setVisible(true);
      }else {
      markers[i].setVisible(false);
    }}
  };
};

function toggleAnimation() {
  if(markers[i].getAnimation() !== null) {
    markers[i].setAnimation(null);} else {
      markers[i].setAnimation(google.maps.Animation.BOUNCE);
    }
}

this.animateicons = function (clickedPlace) {
  // create infowindow
  var infowindow = new google.maps.InfoWindow({
    content: "<div>"+clickedPlace.title+"</div>"
  });
      for (i=0; i<markers.length; i++) {
        if (markers[i].title == clickedPlace.title) {
          toggleAnimation();
          infowindow.open(map,markers[i]);
          //detailsWeather(clickedPlace.title);
        } else {
          markers[i].setAnimation(null);
      }
}

};

function detailsWeather(title) {
  $.ajax({
    url:"http://autocomplete.wunderground.com/aq?",
    data: {
      query: title
    },
    type: "get",
    dataType: "jsonp"
  })
  .done(function(result){
    // add function for info window
    console.log(result);
      })
  .fail(function( xhr, status, errorThrown ) {
    alert(errorThrown);
  });
}

function detailsWiki(title) {
  $.ajax({
    url:"https://en.wikipedia.org/w/api.php?action=query",
    data: {
      titles: title,
      prop: "info",
      rvprop: "content",
      format: "json"
    },
    type: "get",
    dataType: "jsonp"
  })
  .done(function(result){
    // add function for info window
    console.log(result);
      })
  .fail(function( xhr, status, errorThrown ) {
    alert(errorThrown);
  });
}
}
