var map;
var markers = [];
var infoWindow;
function initMap() {
    var budapest = {
        lat: 47.497913,
        lng: 19.040236
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: budapest,
        zoom: 12,
        // silver map style
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#b2ced6"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dadada"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#b2ced6"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            }
        ],
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        }
    });


    // marker
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: budapest
    });
    marker.addListener('click', toggleBounce);
    infoWindow = new google.maps.InfoWindow();
    
   searchFriends();
    
}

// marker animation
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    
}

function searchFriends(){
    var foundFriends = [];
    var friendName = document.getElementById('search-field').value;
    if(friendName){
        friends.forEach(function(friend){
            var fName = friend.name.substring(0);
            if(fName == friendName){
                foundFriends.push(friend);
            }
        });
    } else {
        foundFriends = friends;
    }
    clearLocations();
    displayFriends(foundFriends);
    showFriendsMarkers(foundFriends);
    setOnClickListener();
}


function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener() {
    var friendsElements = document.querySelectorAll('.friends-container');
    friendsElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

// go through the friends with a loop
function displayFriends(friends) {
    var friendsHtml = "";
    friends.forEach(function(friend, index){
        var address = friend.addressLines;
        var phone = friend.phoneNumber;
        var friendsName = friend.name;
        friendsHtml += `
            <div class="friends-container">
                <div class="friends-container-background">
                    <div class="friends-info-container">
                        <div class="friends-adress">
                            <span class="bold">${friendsName}</span>
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="friends-phone">${phone}</div>
                    </div>
                    <div class="friends-number-container">
                        <div class="friends-number">
                            ${index+1}
                        </div>
                     </div>
                </div>
            </div>
        `
    });
    document.querySelector('.friends-list').innerHTML = friendsHtml;
}

function showFriendsMarkers(friends) {
    var bounds = new google.maps.LatLngBounds();
    friends.forEach(function(friend, index){
        var latlng = new google.maps.LatLng(
            friend.coordinates.latitude,
            friend.coordinates.longitude);
        var name = friend.name;
        var address = friend.addressLines;
        var profilePicture = friend.profpic;
        var phone = friend.phoneNumber;
        bounds.extend(latlng);
        createMarker(latlng, name, address, profilePicture, phone, index);
    })
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, profilePicture, phone, index) {
    var html = `
        <div class="friends-info-window">
            <div class="profile">    
                <div class="prof-pic">
                    <img  src="${profilePicture}" alt="${name}" />
                </div>
                <div class="friends-info-name">
                    ${name}
                </div>
            </div>
            <div class="friends-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${address[0]}, ${address[1]}
            </div>
            <div class="friends-info-phone">
                <div class="circle">
                    <i class="fas fa-phone"></i>
                </div>
                ${phone}
            </div>
            <a href="https://www.google.com/maps/dir//${latlng}" target="_blank"><button class="direction">Get direction</button></a>
        </div>
    `;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: `${index+1}`
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}