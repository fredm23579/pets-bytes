document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
});

// Function to toggle the popup modal
function togglePopup() {
    var popup = document.getElementById("popup-1");
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}
// Google Maps Modal Code ******************************************************
function initMap() {
    var location = { lat: -34.397, lng: 150.644 }; // Default location
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadGoogleMaps);
// *****************************************************************************


