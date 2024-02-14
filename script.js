document.addEventListener('DOMContentLoaded', function() {
    
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    var mapButton = document.getElementById('mapButton');
    if (mapButton) mapButton.addEventListener('click', openMapModal);
}

    var toggleButton = document.getElementById('toggleButton');
    if (toggleButton) toggleButton.addEventListener('click', togglePopup);

    var closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', closeMapModal);
    });
}

function togglePopup() {
    var popup = document.getElementById("popup-1");
    if (popup) {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    } else {
        console.error("Popup element not found");
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


