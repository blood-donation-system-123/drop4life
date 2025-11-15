const DONOR_KEY = 'drop4life_donors';
const REQ_KEY = 'drop4life_requests';

// Unique ID generator
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);

// LocalStorage helpers
const load = (k) => JSON.parse(localStorage.getItem(k) || '[]');
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Refresh donor count & request history
function refresh() {
    const donors = load(DONOR_KEY);
    document.getElementById('messages').innerText = 'Donors registered: ' + donors.length;

    const reqs = load(REQ_KEY);
    const h = document.getElementById('historyList');
    h.innerHTML = '';
    if (reqs.length === 0) h.innerHTML = '<li>No requests yet</li>';

    reqs.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.blood} in ${r.city} — ${r.urgency || 'normal'} [${new Date(r.time).toLocaleString()}]`;
        if (r.urgency === 'urgent') li.style.color = 'red';
        h.appendChild(li);
    });
}

// Donor form submission
document.getElementById('donorForm').addEventListener('submit', e => {
    e.preventDefault();
    const d = {
        id: uid(),
        name: document.getElementById('donorName').value.trim(),
        blood: document.getElementById('donorBlood').value,
        city: document.getElementById('donorCity').value.trim().toLowerCase(),
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

// Request form submission
document.getElementById('requestForm').addEventListener('submit', e => {
    e.preventDefault();
    const r = {
        id: uid(),
        blood: document.getElementById('reqBlood').value,
        city: document.getElementById('reqCity').value.trim().toLowerCase(),
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

// Function to search and display donors (merging your old logic + availability + localStorage)
function searchDonors() {
    const bloodGroup = document.getElementById("bloodGroup").value;
    const location = document.getElementById("location").value.trim().toLowerCase();
    const resultsBox = document.getElementById("results");

    resultsBox.innerHTML = ""; /
