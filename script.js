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
function searchDonor() {
    const searchBlood = document.getElementById("searchBlood").value;
    const searchCity = document.getElementById("searchCity").value;

    let donors = JSON.parse(localStorage.getItem("donors")) || [];

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
