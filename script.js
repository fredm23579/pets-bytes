document.addEventListener('DOMContentLoaded', function() {
    setYearAndLoadMaps();

    // Event listener for map button and close buttons
    document.getElementById('mapButton').addEventListener('click', openMapModal);
    var closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', closeMapModal);
    });

    // Additional event listeners for closing modal
    window.addEventListener('click', function(event) {
        var modal = document.getElementById('mapModal');
        if (event.target === modal) {
            closeMapModal();
        }
    });

    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMapModal();
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        informUserGeolocationUnsupported();
        setDefaultLocation();
    }

});

function informUserGeolocationUnsupported() {
    // Inform the user that their browser does not support Geolocation
    alert("Geolocation is not supported by this browser. Please enter your location manually.");

}

function setDefaultLocation() {
    // Default to New York City as an example
    initMap(40.7128, -74.0060);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            // User denied the Geolocation request
            ipLookupOrManualEntry();
            break;
        case error.POSITION_UNAVAILABLE:
            // Location information is unavailable
            ipLookupOrManualEntry();
            break;
        case error.TIMEOUT:
            // The request to get user location timed out
            ipLookupOrManualEntry();
            break;
        case error.UNKNOWN_ERROR:
            // An unknown error occurred
            ipLookupOrManualEntry();
            break;
    }
}

function ipLookupOrManualEntry() {
    // Placeholder for IP address lookup integration
    // Implement IP address lookup using a service like ipinfo.io

    // For actual implementation, integrate with a service like IPinfo
    // and use the response to set the default location
    // Example: initMap(ipinfoResponse.latitude, ipinfoResponse.longitude);

    alert("We are unable to access your location. Please enter your location manually.");

    // Show a prompt to allow manual location entry
    var manualLocation = prompt("Please enter your city or postal code:");
    if (manualLocation) {
        // Use geocoding to convert the manual location to coordinates
        geocodeLocation(manualLocation);
    } else {
        // Fallback to default location if no input is given
        setDefaultLocation();
    }
}

function geocodeLocation(location) {
    // Placeholder for geocoding implementation
    // Implement geocoding using a service like Google Geocoding API
    // and use the response to set the default location
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyB4YKm_hLUi2yFsXf4i3XwS8kOKgp-wInY`)
        .then(response => response.json())
        .then(data => {
            // Extract the latitude and longitude from the response
            const { lat, lng } = data.results[0].geometry.location;

            // Call the initMap function with the obtained coordinates
            initMap(lat, lng);
        })
        .catch(error => {
            console.error('Error geocoding location:', error);
            // Fallback to default location if geocoding fails
            setDefaultLocation();
        });
    }

    console.log("Geocoding the location: " + location);
    // After geocoding, call initMap with the obtained coordinates
    // Example: initMap(geocodedLatitude, geocodedLongitude);
    // Example: initMap(latitude, longitude);
    // Example: initMap(latitude, longitude, mapOptions);

function setYearAndLoadMaps() {
    // Set current year
    var currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    // Load Google Maps only once
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        loadGoogleMaps();
    } else {
        getUserLocation();
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
    } else {
        // Geolocation is not supported by this browser
        setDefaultLocation();
    }
}

function showPosition(position) {
    initMap(position.coords.latitude, position.coords.longitude);
}

function handleLocationError(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
    setDefaultLocation();
}

function setDefaultLocation() {
    // Default location - Update with your default coordinates
    initMap(33.9737, -117.3281);
}

function openMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "block";
}

function closeMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "none";
}

function loadGoogleMaps() {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB4YKm_hLUi2yFsXf4i3XwS8kOKgp-wInY&callback=getUserLocation&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function initMap(latitude, longitude) {
    var userLocation = { lat: latitude, lng: longitude };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: userLocation
    });

    // Code for displaying nearby pet-related services...
    var request = {
        location: userLocation,
        radius: '5000',
        type: ['veterinary_care', 'pet_store', 'store']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(function(place) {
                new google.maps.Marker({
                    position: place.geometry.location,
                    map: map
                });
            });
        }
    });
}
// Toggle Popup
function togglePopup() {
    var popup = document.getElementById("popup-1");
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}
// *****************************************************************************

// Dog API for Code // 
function loadDogAPI() {
    var script = document.createElement ('script');
    script.src = `https://dogapi.dog/api/v2/breeds`;
    document.head.appendChild(script);
}

// Cat API Code // 
function loadCatAPI() {
    var script = document.createElement ('script');
    script.src = `https://api.thecatapi.com/v1/breeds`
    document.head.appendChild(script);
}

