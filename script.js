// ---------- Helper functions ----------
const uid = ()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

// Save donor data
function saveDonor(event) {
    event.preventDefault();

    const name = document.getElementById("donorName").value;
    const blood = document.getElementById("donorBlood").value;
    const city = document.getElementById("donorCity").value;
    const contact = document.getElementById("donorContact").value;
    const avail = document.getElementById("donorAvail").value;

    if (!name || !blood || !city || !contact) {
        alert("Please fill all fields");
        return;
    }

    let donors = JSON.parse(localStorage.getItem("donors")) || [];
    donors.push({
        id: uid(),
        name: name,
        blood: blood,
        city: city,
        contact: contact,
        avail: avail
    });

    localStorage.setItem("donors", JSON.stringify(donors));
    alert("Donor added successfully!");
    document.getElementById("donorForm").reset();
    refresh();
}

// Get coordinates using Google Maps API
async function getCoordinates(city) {
    const apiKey = "YOUR_API_KEY_HERE"; // <-- replace with your key
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`);
    const data = await response.json();
    if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } else {
        return null;
    }
}

// Haversine formula to calculate distance between two lat/lng
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Search donors by blood group & city, sorted by distance
async function searchDonor() {
    const searchBlood = document.getElementById("reqBlood").value;
    const searchCity = document.getElementById("reqCity").value.trim();
    if (!searchBlood || !searchCity) return;

    let donors = JSON.parse(localStorage.getItem("donors")) || [];

    // Get coordinates of searched city
    const searchCoords = await getCoordinates(searchCity);
    if (!searchCoords) {
        alert("Invalid city. Try again.");
        return;
    }

    // Filter and calculate distance
    let filtered = donors
        .filter(d => d.blood === searchBlood && d.avail === "available")
        .map(d => ({ 
            ...d,
            distance: searchCoords && getDistance(
                searchCoords.lat, searchCoords.lng,
                d.coords?.lat || 0,
                d.coords?.lng || 0
            )
        }));

    // Sort by distance
    filtered.sort((a,b) => a.distance - b.distance);

    // Display results
    const resultDiv = document.getElementById("matches");
    resultDiv.innerHTML = "";
    if (filtered.length === 0) {
        resultDiv.innerHTML = "<p>No matching donor found.</p>";
        return;
    }

    filtered.forEach(donor => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.innerHTML = `
            <strong>Name:</strong> ${donor.name}<br>
            <strong>Blood Group:</strong> ${donor.blood}<br>
            <strong>City:</strong> ${donor.city}<br>
            <strong>Contact:</strong> ${donor.contact}<br>
            <strong>Distance:</strong> ${donor.distance.toFixed(2)} km
        `;
        resultDiv.appendChild(div);
    });
}

// Refresh donor count
function refresh() {
    const donors = JSON.parse(localStorage.getItem("donors")) || [];
    document.getElementById("messages").innerText = "Donors registered: " + donors.length;
}

// ---------- Event listeners ----------
document.getElementById("donorForm").addEventListener("submit", saveDonor);
document.getElementById("requestForm").addEventListener("submit", async e => {
    e.preventDefault();
    await searchDonor();
});

// Initialize
(function init() {
    if (!localStorage.getItem("donors")) {
        localStorage.setItem("donors", JSON.stringify([
            { id: uid(), name: "Amit Sharma", blood: "A+", city: "Delhi", contact: "9876500001", avail: "available" },
            { id: uid(), name: "Priya Mehta", blood: "B+", city: "Mumbai", contact: "9876500002", avail: "available" }
        ]));
    }
    refresh();
})();
