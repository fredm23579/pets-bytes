document.addEventListener('DOMContentLoaded', function() {
    setYearAndLoadMaps();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    var mapButton = document.getElementById('mapButton');
    if (mapButton) mapButton.addEventListener('click', openMapModal);

    var findServicesButton = document.getElementById('findServicesButton');
    if (findServicesButton) {
        findServicesButton.addEventListener('click', function() {
            var selectedType = document.getElementById('serviceType').value;
            findNearbyServices(selectedType);
        });
    }

    var toggleButton = document.getElementById('toggleButton');
    if (toggleButton) toggleButton.addEventListener('click', togglePopup);

    var closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', closeMapModal);
    });
}

function openMapModal() {
    var modal = document.getElementById("mapModal");
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error("Map modal not found");
    }
}

function closeMapModal() {
    var modal = document.getElementById("mapModal");
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Modal element not found");
    }
}

function togglePopup() {
    var popup = document.getElementById("popup-1");
    if (popup) {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    } else {
        console.error("Popup element not found");
    }
}
// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    var modal = document.getElementById('mapModal'); // Ensure mapModal exists
    if (event.target === modal) {
        closeMapModal(); // Ensure closeMapModal is defined
    }
});

// Close modal with Escape key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMapModal(); // Ensure closeMapModal is defined
    }
});

// Close buttons event listeners
var closeButtons = document.querySelectorAll('.close'); // Selects elements with class 'close'
closeButtons.forEach(function(btn) {
    btn.addEventListener('click', closeMapModal); // Ensure closeMapModal is defined
});

// Geolocation handling
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError); // Ensure these functions are defined
} else {
    informUserGeolocationUnsupported(); // Ensure this function is defined
    setDefaultLocation(); // Ensure this function is defined
}

function informUserGeolocationUnsupported() {
    alert("Geolocation is not supported by this browser. Please enter your location manually.");
}

function setDefaultLocation() {
    initMap(40.7128, -74.0060);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            ipLookupOrManualEntry();
            break;
        case error.POSITION_UNAVAILABLE:
            ipLookupOrManualEntry();
            break;
        case error.TIMEOUT:
            ipLookupOrManualEntry();
            break;
        case error.UNKNOWN_ERROR:
            ipLookupOrManualEntry();
            break;
    }
}

function ipLookupOrManualEntry() {
    alert("We are unable to access your location. Please enter your location manually.");
    var manualLocation = prompt("Please enter your city or postal code:");
    if (manualLocation) {
        geocodeLocation(manualLocation);
    } else {
        setDefaultLocation();
    }
}

function geocodeLocation(location) {
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyCBPvVB1Aj1_iy_Zs1s3lsZq9E2Ky9eMjc`;

    fetch(geocodeApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                initMap(lat, lng);
            } else {
                alert("No results found for the entered location. Showing default location.");
                setDefaultLocation();
            }
        })
        .catch(error => {
            console.error('Error geocoding location:', error);
            alert("An error occurred while geocoding. Showing default location.");
            setDefaultLocation();
        });
}

function setYearAndLoadMaps() {
    var currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        loadGoogleMaps();
    } else {
        getUserLocation();
    }
}


function loadGoogleMaps() {
    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
        console.log("Google Maps API script already loaded.");
        return; // Already loaded
    }

    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCBPvVB1Aj1_iy_Zs1s3lsZq9E2Ky9eMjc&callback=initMap&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = function() {
        alert("Failed to load Google Maps API.");
    };
    document.head.appendChild(script);
}

function initMap(latitude, longitude) {
    var mapElement = document.getElementById('map');
    if (mapElement) {
        userLocation = { lat: latitude, lng: longitude };
        map = new google.maps.Map(mapElement, {
            zoom: 15,
            center: userLocation
        });

        displayNearbyPetServices(map, userLocation);
    } else {
        console.error("Map element not found");
        // Handle the absence of the map element appropriately
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
        setDefaultLocation();
    }
}
var mapButton = document.getElementById('mapButton');
if (mapButton) {
    mapButton.addEventListener('click', openMapModal);
} else {
    console.error("Map button not found");
}
function openMapModal() {
    var modal = document.getElementById("mapModal");
    if (modal) {
        modal.style.display = "block";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleLocationError, {
                timeout: 10000 // Optional: Set a timeout for geolocation
            });
        } else {
            alert("Geolocation is not supported by this browser.");
            setDefaultLocation();
        }
    } else {
        console.error("Modal element not found");
    }
}
function showPosition(position) {
    if (position && position.coords) {
        userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        initMap(userLocation.lat, userLocation.lng);
    } else {
        console.error('Invalid position object received');
        // Optionally, handle this error case, e.g., by showing a default location
        setDefaultLocation(); // Assuming setDefaultLocation is defined
    }
}
function handleLocationError(error) {
    let errorMessage = "An error occurred while retrieving your location.";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Location access has been denied. Please allow location access and try again.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is currently unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
        default:
            errorMessage = "An unknown error occurred while retrieving your location.";
            break;
    }

    console.warn(`Geolocation Error (${error.code}): ${error.message}`);
    alert(errorMessage);
    setDefaultLocation();
}

function closeMapModal() {
    var modal = document.getElementById("mapModal");
    if (modal) {
        modal.style.display = "none";
        // Optional: Reset modal state or content if necessary
        // resetModalState(); // Define this function if needed
    } else {
        console.error("Modal element not found");
    }
}
function resetModalState() {
    // Example: Clear dynamically added content
    var dynamicContent = document.getElementById("dynamicContent");
    if (dynamicContent) {
        dynamicContent.innerHTML = '';
    }

    // Example: Reset a form within the modal
    var form = document.getElementById("modalForm");
    if (form) {
        form.reset();
    }

    // Example: Reset scroll position of the modal content
    var modalContent = document.getElementById("modalContent");
    if (modalContent) {
        modalContent.scrollTop = 0;
    }

    // Add other reset actions as necessary
}

function displayNearbyPetServices(map, userLocation) {
    var request = {
        location: userLocation,
        radius: '5000',
        type: ['veterinary_care', 'pet_store', 'animal_hospital']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results.length === 0) {
                alert("No nearby pet services found.");
                return;
            }

            clearMarkers(); // Assuming this function clears the global markers array
            results.forEach(function(place) {
                createMarker(place, map);
            });
        } else {
            console.error("Places Service error:", status);
            alert("Failed to retrieve nearby pet services.");
        }
    });
}

function findNearbyServices(serviceType) {
    if (!map) {
        console.error('Map is not initialized');
        return;
    }

    if (!serviceType) {
        console.error('Invalid service type');
        return;
    }

    var request = {
        location: map.getCenter(),
        radius: '5000', // Adjust the radius as needed
        type: [serviceType]
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results.length === 0) {
                alert("No services found for the selected type.");
                return;
            }

            clearMarkers();
            clearList();
            results.forEach(function(place) {
                createMarker(place);
                addToList(place);
            });
        } else {
            console.error("Places Service error:", status);
            alert("Failed to retrieve services.");
        }
    });
}

function createMarker(place) {
    // Check if the place has the necessary data
    if (!place || !place.geometry || !place.geometry.location) {
        console.error('Invalid place data:', place);
        return; // Skip this place and return early
    }

    try {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name // Optionally, add the place name as a tooltip
        });

        // Adding an info window to each marker
        var infoWindow = new google.maps.InfoWindow({
            content: '<div><strong>' + (place.name || 'No name available') + '</strong><br>' +
                     'Address: ' + (place.vicinity || 'No address available') + '</div>'
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    } catch (error) {
        console.error('Error creating marker:', error);
        // Handle the error appropriately
        // For example, you might want to log this error to a server for analysis
    }
}

function addToList(place) {
    var list = document.getElementById('servicesList');
    if (!list) {
        console.error('List element not found');
        return;
    }

    var entry = document.createElement('div');
    entry.classList.add('list-entry'); // Optional: Add a class for styling

    // Check if place properties are defined
    var name = place.name || 'Name not available';
    var vicinity = place.vicinity || 'Address not available';

    // Creating the HTML structure for the entry
    entry.innerHTML = `<strong>${name}</strong><br><span>${vicinity}</span>`;

    list.appendChild(entry);
}


function clearMarkers() {
    // Iterate through all markers in the array
    for (var i = 0; i < markers.length; i++) {
        // Remove the marker from the map
        markers[i].setMap(null);
    }
    // Reset the markers array to clear all stored markers
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

//*****************************************************************************
function openPetProfileModal() {
    var petProfileModal = document.getElementById("toggleButton"); // Replace with the actual ID
    if (petProfileModal) {
        petProfileModal.style.display = "block";
    } else {
        console.error("Pet profile modal element not found");
    }
}
var petProfileButton = document.getElementById('toggleButton'); // Replace with the actual ID
if (petProfileButton) {
    petProfileButton.addEventListener('click', openPetProfileModal);
} else {
    console.error("Pet profile button not found");
}

function togglePopup() {
    var popup = document.getElementById("popup-1");
    if (popup) {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';

        // Update accessibility attributes
        popup.setAttribute('aria-hidden', popup.style.display === 'none');
    } else {
        console.error("Popup element not found");
    }
}


// Dog API Code // 
const url = `https://api.thedogapi.com/v1/breeds`;
const api_key = "live_lbUtmVrpjwLAoF4TTJuGlO7uGg9pNeaGaT3DcxOcHtR429cE9cxWVr7GdGiXauI6"
let storedBreeds = []

 fetch(url,{headers: {
      'x-api-key': api_key
    }})
 .then((response) => {
   return response.json();
 })
.then((data) => {
   
   //filter to only include those with an `image` object
   data = data.filter(img=> img.image?.url!=null)
   
  storedBreeds = data;
   
   for (let i = 0; i < storedBreeds.length; i++) {
    const breed = storedBreeds[i];
    let option = document.createElement('option');
     
     //skip any breeds that don't have an image
     if(!breed.image)continue
     
    //use the current array index
    option.value = i;
    option.innerHTML = `${breed.name}`;
document.getElementById('breed_selector').appendChild(option);
    
    }
   //show the first breed by default
   showBreedImage(0)
})
.catch(function(error) {
   console.log(error);
});

function showBreedImage(index)
{ 
  document.getElementById("breed_image").src= storedBreeds[index].image.url;
  
  document.getElementById("breed_json").textContent= storedBreeds[index].temperament
  
  
  document.getElementById("wiki_link").href= storedBreeds[index].wikipedia_url
  document.getElementById("wiki_link").innerHTML= storedBreeds[index].wikipedia_url
}


