// Convert city name to latitude & longitude using Google Maps Geocoding API
async function getCoordinates(city) {
    const apiKey = "AIzaSyDkBL-z3h16AxHRkgAMEjti95S8dCi2JNE"; // your API key
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`);
    const data = await response.json();
    if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } else {
        return null;
    }
}

// Save donor data
function saveDonor(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const blood = document.getElementById("blood").value;
    const city = document.getElementById("city").value;
    const contact = document.getElementById("contact").value;

    if (!name || !blood || !city || !contact) {
        alert("Please fill all fields");
        return;
    }

    let donors = JSON.parse(localStorage.getItem("donors")) || [];

    donors.push({
        name: name,
        blood: blood,
        city: city,
        contact: contact
    });

    localStorage.setItem("donors", JSON.stringify(donors));
    alert("Donor added successfully!");
    document.getElementById("donorForm").reset();
}

// Search donor by blood group & city
async function searchDonor() {
    const searchBlood = document.getElementById("searchBlood").value;
    const searchCity = document.getElementById("searchCity").value;

    let donors = JSON.parse(localStorage.getItem("donors")) || [];

    // Get coordinates of the searched city
    const searchCoords = await getCoordinates(searchCity);
    
    let filtered = donors.filter(d =>
        d.blood === searchBlood && d.city.toLowerCase() === searchCity.toLowerCase()
    );

    let resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    if (filtered.length === 0) {
        resultDiv.innerHTML = "<p>No matching donor found.</p>";
        return;
    }

    filtered.forEach(donor => {
        resultDiv.innerHTML += `
            <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
                <strong>Name:</strong> ${donor.name}<br>
                <strong>Blood Group:</strong> ${donor.blood}<br>
                <strong>City:</strong> ${donor.city}<br>
                <strong>Contact:</strong> ${donor.contact}
            </div>
        `;
    });
}

