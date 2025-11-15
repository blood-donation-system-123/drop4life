// -------------------------------
// Google Places Autocomplete Setup
// -------------------------------
function initAutocomplete() {
    const donorInput = document.getElementById('donorCity');
    const reqInput = document.getElementById('reqCity');

    new google.maps.places.Autocomplete(donorInput, { types: ['(cities)'] });
    new google.maps.places.Autocomplete(reqInput, { types: ['(cities)'] });
}

// -------------------------------
// Local Storage Keys & Utils
// -------------------------------
const DONOR_KEY = 'drop4life_donors';
const REQ_KEY = 'drop4life_requests';
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const load = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// -------------------------------
// Refresh Donors & Requests Display
// -------------------------------
function refresh() {
    const donors = load(DONOR_KEY);
    document.getElementById('messages').innerText = 'Donors registered: ' + donors.length;

    const reqs = load(REQ_KEY);
    const h = document.getElementById('historyList');
    h.innerHTML = '';
    if (reqs.length === 0) h.innerHTML = '<li>No requests yet</li>';
    reqs.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.blood} in ${r.city} — ${r.urgency || 'normal'}`;
        h.appendChild(li);
    });
}

// -------------------------------
// Donor Form Submission
// -------------------------------
document.getElementById('donorForm').addEventListener('submit', e => {
    e.preventDefault();

    const d = {
        id: uid(),
        name: document.getElementById('donorName').value.trim(),
        blood: document.getElementById('donorBlood').value,
        city: document.getElementById('donorCity').value.trim(),
        contact: document.getElementById('donorContact').value.trim(),
        avail: document.getElementById('donorAvail').value
    };

    const arr = load(DONOR_KEY);
    arr.push(d);
    save(DONOR_KEY, arr);

    alert('Donor saved (demo)');
    e.target.reset();
    refresh();
});

// -------------------------------
// Request Form Submission
// -------------------------------
document.getElementById('requestForm').addEventListener('submit', e => {
    e.preventDefault();

    const r = {
        id: uid(),
        blood: document.getElementById('reqBlood').value,
        city: document.getElementById('reqCity').value.trim(),
        urgency: document.getElementById('reqUrgency').value,
        contact: document.getElementById('reqContact').value,
        time: new Date().toISOString()
    };

    const arr = load(REQ_KEY);
    arr.unshift(r);
    save(REQ_KEY, arr);

    alert('Search started (demo)');
    findAndShow(r);
    e.target.reset();
    refresh();
});

// -------------------------------
// Search & Display Matching Donors
// -------------------------------
function findAndShow(request) {
    const donors = load(DONOR_KEY);
    let matches = donors.filter(d => d.blood === request.blood && d.city.toLowerCase() === request.city.toLowerCase() && d.avail === 'available');

    // fallback to any donor with same blood
    if (matches.length === 0) matches = donors.filter(d => d.blood === request.blood && d.avail === 'available');

    const mdiv = document.getElementById('matches');
    mdiv.innerHTML = '';

    if (matches.length === 0) {
        mdiv.innerHTML = '<p>No matches found.</p>';
        return;
    }

    matches.forEach(m => {
        const el = document.createElement('div');
        el.style.border = '1px solid #eee';
        el.style.padding = '8px';
        el.style.margin = '8px 0';
        el.innerHTML = `
            <strong>${m.name} (${m.blood})</strong>
            <div>City: ${m.city}</div>
            <div>Contact: ${m.contact}</div>
            <button data-id="${m.id}">Mark Contacted</button>
        `;
        mdiv.appendChild(el);
    });

    // mark donor as unavailable
    Array.from(document.querySelectorAll('[data-id]')).forEach(btn => btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const arr = load(DONOR_KEY);
        const d = arr.find(x => x.id === id);
        if (d) {
            d.avail = 'unavailable';
            save(DONOR_KEY, arr);
            alert('Marked as unavailable (demo)');
            refresh();
        }
    }));
}

// -------------------------------
// Initialize Demo Donors if None Exist
// -------------------------------
(function init() {
    if (!localStorage.getItem(DONOR_KEY)) {
        save(DONOR_KEY, [
            { id: uid(), name: 'Asha', blood: 'O+', city: 'Delhi', contact: '9876500001', avail: 'available' },
            { id: uid(), name: 'Ravi', blood: 'B-', city: 'Delhi', contact: '9876500002', avail: 'available' }
        ]);
    }
    refresh();
})();
