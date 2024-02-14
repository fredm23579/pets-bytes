var map;
var markers = [];
var modal, btn, span, service;
var userLocation = { lat: 40.7128, lng: -74.0060 }; // Default location (New York City)

document.addEventListener('DOMContentLoaded', function () {
    Window.initMap = initMap;
    setYearAndLoadMaps();
    setupEventListeners();
    setupModalElements();
    loadGoogleMapsScript();
});

function setupEventListeners() {
    var mapButton = document.getElementById('mapButton');
    mapButton.addEventListener('click', openMapModal);
}

function setupModalElements() {
    modal = document.getElementById("myModal");
    btn = document.getElementById("myBtn");
    span = document.getElementsByClassName("close")[0];

    btn.onclick = function () {
        modal.style.display = "block";
        initMap();
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function loadGoogleMapsScript() {
    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) return;
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCBPvVB1Aj1_iy_Zs1s3lsZq9E2Ky9eMjc&loading=async&libraries=places&callback=initMap&v=weekly';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function setYearAndLoadMaps() {
    var currentYearElement = document.getElementById('current-year');
    if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();
}

function openMapModal() {
    modal.style.display = "block";
}

// Rest of the functions (findNearbyServices, processResults, createMarkers, etc.) remain the same

function clearPlacesList() {
    var placesList = document.getElementById('places');
    placesList.innerHTML = '';
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function clearList() {
    var list = document.getElementById('servicesList');
    if (list) {
        // Clear the list's contents
        list.innerHTML = '';
    } else {
        console.error('List element not found');
        // Handle the absence of the list element appropriately
    }
}
function userLocationSuccess(position) {
    userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    map.setCenter(userLocation);
    searchNearby(userLocation);
}
function userLocationError(error) {
    console.error('Geolocation error:', error);
    map.setCenter(userLocation); // Fallback to default location
}
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userLocationSuccess, userLocationError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5000,
        center: userLocation
    });

    // Only create the Places service after the map is initialized and user location is set
    service = new google.maps.places.PlacesService(map);
}

petString = ['veterinary care' || 'pet store' || 'animal hospital' || 'veterinarian' || 'petsmart' || 'animal' || 'pet' || 'cat' || 'animal shelter' || 'Tractor Supply' || 'Walmart pet' || 'pet food' || 'pet supplies', 'pet grooming' || 'dog walking' || 'dog grooming' || 'pet park' || 'park'];
function searchNearby(location) {
    service.nearbySearch({
        location: location,
        radius: 10000, // Increase radius for more results
        type: petString, 
        keyword: petString,
        query: petString,
        types: petString,
        language: 'en',
    }, processResults);
}

function processResults(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        addPlaces(results, map);
        setupPagination(pagination);
    } else {
        console.error('Google Places API returned status:', status);
    }
}

function addPlaces(places, map) {
    const placesList = document.getElementById("places");
    places.forEach(place => {
        if (place.geometry && place.geometry.location) {
            const marker = new google.maps.Marker({
                map,
                position: place.geometry.location,
                title: place.name
            });

            // Store marker for later use
            place.marker = marker;
            markers.push(marker);

            const li = document.createElement("li");
            li.textContent = place.name;
            li.onclick = function() {
                showInfoWindow(place);
            };
            placesList.appendChild(li);
        }
    });
}

function showInfoWindow(place) {
    if (place.marker) {
        map.setCenter(place.marker.getPosition());

        // Open an info window if it doesn't exist
        if (!place.infoWindow) {
            place.infoWindow = new google.maps.InfoWindow({
                content: '<div><strong>' + place.name + '</strong><br>' +
                         (place.vicinity || 'No address available') + '</div>'
            });
        }
        place.infoWindow.open(map, place.marker);

        // Make the marker bounce
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            place.marker.setAnimation(null);
        }, 2000);
    }
}
// Clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Setup pagination for additional search results
function setupPagination(pagination) {
    var moreButton = document.getElementById('more');
    if (pagination && pagination.hasNextPage) {
        moreButton.style.display = 'block';
        moreButton.disabled = false;
        moreButton.onclick = function() {
            moreButton.disabled = true;
            pagination.nextPage();
        };
    } else {
        moreButton.style.display = 'none';
    }
}

// Clear the list of places
function clearPlacesList() {
    var placesList = document.getElementById('places');
    placesList.innerHTML = '';
}

// Add a selected place to the services list
function addToList(place) {
    var list = document.getElementById('servicesList');
    if (!list) {
        console.error('List element not found');
        return;
    }

    var entry = document.createElement('div');
    entry.classList.add('list-entry');
    entry.innerHTML = `<strong>${place.name}</strong><br><span>${place.vicinity || 'Address not available'}</span>`;
    list.appendChild(entry);
}


