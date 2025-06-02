// Select DOM elements
const manualInput = document.getElementById('parking-location');
const saveButton = document.getElementById('save-location');
const gpsButton = document.getElementById('use-location');
const locationInfo = document.getElementById('location-info');
const savedSection = document.querySelector('.location-display');
const displayText = document.getElementById('location-display-text');
const displayMap = document.getElementById('location-display-map');
const displayTimestamp = document.getElementById('timestamp');
const clearButton = document.getElementById('clear-location');

// Function to update the UI based on saved location
// localStorage.getItem() is a method that retrieves data from the browser's local storage.
// localStorage.setItem() expects two arguments:
// The first argument is the key ('parkingSpot').
// The second argument is the value (which is stored in the local storage).
function updateUI() {
    const parkingSpot = localStorage.getItem('parkingSpot');
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');
    const savedTime = localStorage.getItem('savedTime');

    if (parkingSpot || (latitude && longitude)) {
        savedSection.style.display = 'block';

        if (parkingSpot) {
            displayText.innerHTML = `You parked at: ${parkingSpot}`;
            manualInput.value = parkingSpot; // Keep it inside the input field too
        } else {
            displayText.innerHTML = "No manual parking spot saved.";
            manualInput.value = ""; // Clear input if no manual saved
        }

        if (latitude && longitude) {
            displayMap.style.display = 'inline-block';
            displayMap.href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        } else {
            displayMap.style.display = 'none';
        }

        if (savedTime) {
            displayTimestamp.textContent = `Last saved on: ${new Date(parseInt(savedTime)).toLocaleString()}`;
        }
    } else {
        savedSection.style.display = 'none';
        manualInput.value = ""; // No saved data = clear input
    }
}

// Save manual parking spot (without removing GPS data)
saveButton.addEventListener('click', () => {
    const input = manualInput.value.trim();
    if (input === "") {
        alert("Please enter parking details.");
        return;
    }

    // Save manual input separately
    localStorage.setItem('parkingSpot', input);
    localStorage.setItem('savedTime', Date.now());

    updateUI();
    // Note: We don't clear the input because user might want to edit it later.
});

// Save GPS parking spot (without touching manual input)
gpsButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        locationInfo.textContent = "Geolocation is not supported by your browser.";
        return;
    }

    locationInfo.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Save GPS separately
            localStorage.setItem('latitude', latitude);
            localStorage.setItem('longitude', longitude);
            localStorage.setItem('savedTime', Date.now());

            locationInfo.textContent = "Location saved!";
            updateUI();
        },
        (error) => {
            locationInfo.textContent = "Unable to retrieve your location.";
            console.error(error);
        }
    );
});

// Clear saved location
clearButton.addEventListener('click', () => {
    localStorage.removeItem('parkingSpot');
    localStorage.removeItem('latitude');
    localStorage.removeItem('longitude');
    localStorage.removeItem('savedTime');

    updateUI();

    // Show success message
    locationInfo.textContent = "Location cleared!";
    locationInfo.style.color = "green"; // make it green for positive feedback

    setTimeout(() => {
        locationInfo.textContent = "";
        locationInfo.style.color = ""; // Reset to default
    }, 3000)
});
