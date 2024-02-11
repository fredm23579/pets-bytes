document.addEventListener('DOMContentLoaded', function() {
    setYearAndLoadMaps();

    document.getElementById('mapButton').addEventListener('click', openMapModal);
    var closeButtons = document.querySelectorAll('close');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', closeMapModal);
    });

    // Event listener for opening the map modal
    var mapButton = document.getElementById('mapButton');
    if (mapButton) {
        mapButton.addEventListener('click', openMapModal);
    }

    // Event listener for toggling the popup
    var toggleButton = document.getElementById('toggleButton');
    if (toggleButton) {
        toggleButton.addEventListener('click', togglePopup);
    }
    
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

    var closeButtons = document.querySelectorAll('.close'); // Use .close for class
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', closeMapModal);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        informUserGeolocationUnsupported();
        setDefaultLocation();
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
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyCBPvVB1Aj1_iy_Zs1s3lsZq9E2Ky9eMjc`)
        .then(response => response.json())
        .then(data => {
            const { lat, lng } = data.results[0].geometry.location;
            initMap(lat, lng);
        })
        .catch(error => {
            console.error('Error geocoding location:', error);
            setDefaultLocation();
        });
}

function setYearAndLoadMaps() {
    var currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

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

function openMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "block";
    showPosition(getUserLocation());
}

function closeMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "none";
}

function loadGoogleMaps() {
    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
        return; // Already loaded
    }

    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCBPvVB1Aj1_iy_Zs1s3lsZq9E2Ky9eMjc&callback=initMap&libraries=places`;
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

    displayNearbyPetServices(map, userLocation);
}

function findNearbyServices() {
    var selectedType = document.getElementById('serviceType').value;
    var request = {
        location: userLocation, // Define userLocation globally after geolocation
        radius: '5000', // Adjust radius as needed
        type: [selectedType]
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            clearList();
            results.forEach(function(place) {
                createMarker(place);
                addToList(place);
            });
        }
    });
}
//var markers = [];
function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    markers.push(marker);
}

function addToList(place) {
    var list = document.getElementById('servicesList');
    var entry = document.createElement('div');
    entry.innerHTML = `<strong>${place.name}</strong><br>${place.vicinity}`;
    list.appendChild(entry);
}
function clearList() {
    var list = document.getElementById('servicesList');
    list.innerHTML = '';
}
//*****************************************************************************
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
const url = `https://api.thecatapi.com/v1/breeds`;
const api_key = "live_jagmaJUduCuXhbOEdM3zaXvwF23VZhrs6cA5u9KoZaPhBmXvnZEmRgu5VV31fAkE"
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
});
