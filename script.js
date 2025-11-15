const DONOR_KEY = 'drop4life_donors';
const REQ_KEY = 'drop4life_requests';
const uid = ()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const load = (k)=> JSON.parse(localStorage.getItem(k)||'[]');
const save = (k,v)=> localStorage.setItem(k, JSON.stringify(v));

function refresh() {
  const donors = load(DONOR_KEY);
  document.getElementById('messages').innerText = 'Donors registered: '+donors.length;
  const reqs = load(REQ_KEY);
  const h = document.getElementById('historyList'); 
  h.innerHTML='';
  if(reqs.length===0) h.innerHTML='<li>No requests yet</li>';
  reqs.forEach(r=>{
    const li=document.createElement('li'); 
    li.textContent = r.blood+' in '+r.city+' — '+(r.urgency||'normal'); 
    h.appendChild(li);
  });
}

// Register Donor
document.getElementById('donorForm').addEventListener('submit', e=>{
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
  save(DONOR_KEY,arr); 
  alert('Donor saved (demo)'); 
  e.target.reset(); 
  refresh();
});

// Validate city using Google Maps
function validateCity(cityName, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: cityName }, function(results, status) {
        if (status === 'OK' && results[0]) {
            callback(true, results[0].formatted_address);
        } else {
            callback(false);
        }
    });
}

// Request Blood
document.getElementById('requestForm').addEventListener('submit', e => {
    e.preventDefault();
    const cityInput = document.getElementById('reqCity').value.trim();
    validateCity(cityInput, function(isValid, formattedName) {
        if(!isValid) {
            alert('Invalid city! Please enter a real city.');
            return;
        }

        const r = {
            id: uid(),
            blood: document.getElementById('reqBlood').value,
            city: formattedName.toLowerCase(),
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
});

// Find donors
function findAndShow(request){
  const donors = load(DONOR_KEY);
  let matches = donors.filter(d=>d.blood===request.blood && d.city===request.city && d.avail==='available');
  if(matches.length===0) matches = donors.filter(d=>d.blood===request.blood && d.avail==='available');
  const mdiv = document.getElementById('matches'); 
  mdiv.innerHTML='';
  if(matches.length===0){ mdiv.innerHTML='<p>No matches found.</p>'; return;}
  matches.forEach(m=>{
    const el=document.createElement('div'); 
    el.style.border='1px solid #eee'; 
    el.style.padding='8px'; 
    el.style.margin='8px 0';
    el.innerHTML = `<strong>${m.name} (${m.blood})</strong><div>City: ${m.city}</div><div>Contact: ${m.contact}</div><button data-id="${m.id}">Mark Contacted</button>`;
    mdiv.appendChild(el);
  });
  Array.from(document.querySelectorAll('[data-id]')).forEach(btn=>btn.addEventListener('click', ()=>{
    const id=btn.getAttribute('data-id'); 
    const arr=load(DONOR_KEY); 
    const d=arr.find(x=>x.id===id); 
    if(d){ d.avail='unavailable'; save(DONOR_KEY,arr); alert('Marked as unavailable (demo)'); refresh();}
  }));
}

// Initialize demo data
(function init(){ 
  if(!localStorage.getItem(DONOR_KEY)){ 
    save(DONOR_KEY, [
      { id:uid(), name:'Asha', blood:'O+', city:'delhi', contact:'9876500001', avail:'available' },
      { id:uid(), name:'Ravi', blood:'B-', city:'delhi', contact:'9876500002', avail:'available' }
    ]);
  } 
  refresh(); 
})();
