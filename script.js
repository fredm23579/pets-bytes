document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
    
    // Load the Google Maps API asynchronously only once
    if (!window.google || !window.google.maps) {
        loadGoogleMaps();
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        // Geolocation is not supported by this browser
        setDefaultLocation();
    }
});

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

function initMap() {
    var ucrLocation = { lat: 33.9737, lng: -117.3281 }; // UCR location
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: ucrLocation
    });
    var marker = new google.maps.Marker({
        position: ucrLocation,
        map: map
    });
}

function openMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "block";
}

function closeMapModal() {
    var modal = document.getElementById("mapModal");
    modal.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mapButton').addEventListener('click', openMapModal);
    var closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', closeMapModal);
    });
});

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

