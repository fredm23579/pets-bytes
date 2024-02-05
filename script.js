document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
});

// Function to toggle the popup modal
function togglePopup() {
    var popup = document.getElementById("popup-1");
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}


