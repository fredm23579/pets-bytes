document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        // Geolocation is not supported by this browser
        setDefaultLocation();
    }

// Function to toggle the popup modal
function togglePopup() {
    var popup = document.getElementById("popup-1");
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}
// Google Maps Modal Code ******************************************************

function showPosition(position) {
    // Use position.coords.latitude & position.coords.longitude
    initMap(position.coords.latitude, position.coords.longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            // User denied the request for Geolocation
            setDefaultLocation();
            break;
        // Handle other error cases
    }
}

function setDefaultLocation() {
    // Default location - UCR in Riverside, CA
    initMap(33.9737, -117.3281); // Latitude and Longitude of UCR
}

function setLocationManually() {
    var userInput = document.getElementById('locationInput').value;
    // Code to geocode user input and set location
}

function initMap(lat, lng) {
    var location = { lat: lat, lng: lng };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

// Function to open the modal and display the map
function openMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "block";
    initMap(); // Initialize the map when the modal opens
}

// Function to close the modal
function closeMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "none";
}

// Load the Google Maps script 
function loadGoogleMaps() {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB4YKm_hLUi2yFsXf4i3XwS8kOKgp-wInY&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadGoogleMaps);
// *****************************************************************************

// Dog API for Code // 
function loadDogAPI() {
    var script = document.createElement ('script');
    script.src = `https://dogapi.dog/api/v2/breeds`;
    document.head.appendChild(script);
}

});
