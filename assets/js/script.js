document.addEventListener('DOMContentLoaded', function() {
       setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    var toggleButton = document.getElementById('toggleButton');
    if (toggleButton) toggleButton.addEventListener('click', togglePopup);

}

function togglePopup() {
    var popup = document.getElementById("popup-1");
    if (popup) {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    } else {
        console.error("Popup element not found");
    }
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
//***************************************************************************************

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


