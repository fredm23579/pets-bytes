var map;
var markers = [];
var modal, btn, span, service;
var userLocation = {
  lat: 40.7128,
  lng: -74.0060
}; // Default location (New York City)

document.addEventListener('DOMContentLoaded', function() {


  Window.initMap = initMap;
  setYearAndLoadMaps();
  setupEventListeners();
  setupModalElements();
  loadGoogleMapsScript();
});

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
}

function setupModalElements() {
  modal = document.getElementById("myModal");
  btn = document.getElementById("myBtn");
  span = document.getElementsByClassName("close")[0];

  btn.onclick = function() {
    modal.style.display = "block";
    initMap();
  }

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
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
  if (modal) modal.style.display = "block";
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
  //searchNearby(userLocation);
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
    zoom: 11,
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

// Find nearby services based on the selected type from the dropdown
function findNearbyServices(serviceType) {
  var request = {
    location: userLocation,
    radius: 5000,
    type: [serviceType]
  };

  service.nearbySearch(request, processResults);
}

// Toggle the visibility of the pet profile popup
function togglePopup() {
  var popup = document.getElementById("popup-1");
  if (popup) {
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
  }
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

// Open pet profile modal
function openPetProfileModal() {
  var petProfileModal = document.getElementById("toggleButton");
  if (petProfileModal) {
    petProfileModal.style.display = "block";
  } else {
    console.error("Pet profile modal element not found");
  }
}

// Close pet profile modal

function closePetProfileModal() {
  var petProfileModal = document.getElementById("toggleButton");
  if (petProfileModal) {
    petProfileModal.style.display = "none";
  } else {
    console.error("Pet profile modal element not found");
  }
}

function loadPetProfile() {
  // Assuming petId is already stored or can be constructed from other data
  const petId = getPetId(); // Implement getPetId function based on your logic
  const savedPetData = localStorage.getItem(`petProfile-${petId}`);
  if (savedPetData) {
    const petData = JSON.parse(savedPetData);
    document.getElementById('petName').value = petData.name;
    document.getElementById('petAge').value = petData.age;
    document.getElementById('petBreed').value = petData.breed;
  }
}

function openPetProfileModal() {
  const petProfileModal = document.getElementById("petProfileModal");
  if (petProfileModal) {
    loadPetProfile(); // Load any saved data for the pet profile
    petProfileModal.style.display = "block";
  } else {
    console.error("Pet profile modal element not found");
  }
}

function closePetProfileModal() {
  const petProfileModal = document.getElementById("petProfileModal");
  if (petProfileModal) {
    petProfileModal.style.display = "none";
  } else {
    console.error("Pet profile modal element not found");
  }
}

function savePetProfile() {
  document.getElementById('savePetProfileBtn').addEventListener('click', function() {
    const petName = document.getElementById('petName').value;
    const petAge = document.getElementById('petAge').value;
    const petBreed = document.getElementById('petBreed').value;

    // Generate petId by concatenating inputs
    const petId = petName + petAge + petBreed;

    const petData = {
      name: petName,
      age: petAge,
      breed: petBreed
    };

    localStorage.setItem(`petProfile-${petId}`, JSON.stringify(petData));
    document.getElementById('petProfileModal').style.display = 'none'; // Close the modal after saving
  });
}

function openPetProfileModal() {
  document.getElementById('openPetProfileBtn').addEventListener('click', function() {
    document.getElementById('petProfileModal').style.display = 'block';
    const petId = 'uniquePetId'; // Replace with a dynamic pet ID if necessary
    loadPetProfile(petId);
  });
}

function closePetProfileModal() {
  document.getElementById('closePetProfile').addEventListener('click', function() {
    document.getElementById('petProfileModal').style.display = 'none';
  });
}

function savePetProfile() {
  document.getElementById('savePetProfileBtn').addEventListener('click', function() {
    const petId = 'uniquePetId'; // Replace with a dynamic pet ID if necessary
    const petData = {
      name: document.getElementById('petName').value,
      age: document.getElementById('petAge').value,
      breed: document.getElementById('petBreed').value
      // Add more fields as necessary
    };
    localStorage.setItem(`petProfile-${petId}`, JSON.stringify(petData));
    document.getElementById('petProfileModal').style.display = 'none'; // Close the modal after saving
  });
}

function loadPetProfile(petId) {
  const savedPetData = localStorage.getItem(`petProfile-${petId}`);
  if (savedPetData) {
    const petData = JSON.parse(savedPetData);
    document.getElementById('petName').value = petData.name;
    document.getElementById('petAge').value = petData.age;
    document.getElementById('petBreed').value = petData.breed;
    // Populate more fields as necessary
  }
}
document.addEventListener('DOMContentLoaded', function() {
  openPetProfileModal();
  closePetProfileModal();
  savePetProfile();
  // Other initializations...
});



