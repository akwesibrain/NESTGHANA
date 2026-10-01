const IC={home:'<path d="M3 11 12 3l9 8v10H3zM9 21v-6h6v6"/>',shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>',user:'<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6"/>',clock:'<path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',pin:'<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>',search:'<path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',mail:'<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',tag:'<path d="M3 12V4h8l10 10-8 8zM7.5 8.5h.01"/>'};
const ico=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const REGIONS=["Ahafo","Ashanti","Bono","Bono East","Central","Eastern","Greater Accra","North East","Northern","Oti","Savannah","Upper East","Upper West","Volta","Western","Western North"];
const TYPE={single:"Single room",chamber:"Chamber and hall",self:"Self-contained",hostel:"Hostel"};
const NB={"Tema|Community 20":[["Community 18","Tema",2,8,15],["Community 25","Tema",3,10,20],["Adjei Kojo","Tema",4,15,25],["Sakumono","Tema",5,15,30],["Ashaiman","Tema",6,20,35]],
"Tema|Community 18":[["Community 20","Tema",2,8,15],["Community 25","Tema",4,12,22],["Ashaiman","Tema",5,15,30]],
"Tema|Community 25":[["Community 20","Tema",3,10,20],["Sakumono","Tema",4,12,25],["Adjei Kojo","Tema",5,15,30]],
"Tema|Adjei Kojo":[["Community 20","Tema",4,15,25],["Ashaiman","Tema",5,15,25],["Community 25","Tema",5,15,30]],
"Tema|Ashaiman":[["Adjei Kojo","Tema",5,15,25],["Community 20","Tema",6,20,35],["Sakumono","Tema",6,20,35]],
"Tema|Sakumono":[["Community 25","Tema",4,12,25],["Community 20","Tema",5,15,30],["Ashaiman","Tema",6,20,35]],
"Accra|Madina":[["Kwabenya","Accra",5,15,30]],"Accra|Kwabenya":[["Madina","Accra",5,15,30]],
"Kumasi|Ayeduase":[["Bomso","Kumasi",3,10,20]],"Kumasi|Bomso":[["Ayeduase","Kumasi",3,10,20]]};
let ROOMS=[];
let TOWN_RECORDS=[];
let CAMPUS={};
let locationCatalogPromise=null;
const LISTING_PAGE_SIZE=24;
let listingOffset=0,hasMoreListings=true,isLoadingListings=false;
const DEF={single:{bath:"Shared",kit:"Shared",size:"about 12 m²"},chamber:{bath:"Private",kit:"Private",size:"about 30 m²"},self:{bath:"Private",kit:"Private",size:"about 20 m²"},hostel:{bath:"Shared",kit:"Shared",size:"shared room"}};
const $=id=>document.getElementById(id),town=$("town"),region=$("region"),area=$("area"),ty=$("ty"),max=$("max"),camp=$("camp"),stu=$("stu"),saved=new Set(),must=new Set(),townSuggestions=$("town-suggestions");
let selectedTown=null,currentTownSuggestions=[];
let savedOnly=false;
let listingFeePesewas=null;
const supabaseClient=window.supabase?.createClient&&window.NESTGH_SUPABASE_CONFIG?.publishableKey
  ?window.supabase.createClient(window.NESTGH_SUPABASE_CONFIG.url,window.NESTGH_SUPABASE_CONFIG.publishableKey)
  :null;
let listingLoadFailed=false;
function updateModalScroll(){document.body.classList.toggle("modal-open",["sheet","lf","pol","psheet"].some(id=>$(id).classList.contains("on")))}
try{
  const stored=JSON.parse(localStorage.getItem("nestgh_saved_rooms_v1")||"[]");
  if(Array.isArray(stored))stored.filter(id=>typeof id==="string").forEach(id=>saved.add(id));
}catch(error){console.error("Could not read saved rooms:",error)}
document.querySelectorAll("i[data-ic]").forEach(e=>{e.outerHTML=ico(e.dataset.ic)});
const ghs=n=>"GH₵ "+Number(n||0).toLocaleString("en-GH"),total=r=>(r.rentAmount??r.p)*r.adv+r.dep+r.fee;
const formatFeePesewas=value=>"GH₵ "+(value/100).toLocaleString("en-GH",{minimumFractionDigits:2,maximumFractionDigits:2});
const htmlEsc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const locationKey=value=>String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLocaleLowerCase();
function hideTownSuggestions(){townSuggestions.hidden=true;town.setAttribute("aria-expanded","false");currentTownSuggestions=[]}
function showTownSuggestions(query){
  const prefix=locationKey(query);
  if(!prefix){hideTownSuggestions();return}
  currentTownSuggestions=TOWN_RECORDS
    .filter(place=>(!region.value||place.region===region.value)&&place.key.startsWith(prefix))
    .slice(0,12);
  townSuggestions.innerHTML=currentTownSuggestions.map((place,index)=>`<button type="button" role="option" aria-selected="false" data-town-index="${index}"><span>${htmlEsc(place.name)}</span><small>${htmlEsc(place.region)} Region</small></button>`).join("");
  townSuggestions.hidden=currentTownSuggestions.length===0;
  town.setAttribute("aria-expanded",String(currentTownSuggestions.length>0));
}
function chooseTown(place){
  town.value=place.name;
  region.value=place.region;
  area.value="";
  selectedTown=place;
  hideTownSuggestions();
  fillAreas();
  render();
}
function populateOwnerTownOptions(query="",regionName=""){
  const datalist=$("tl");
  if(!datalist)return;
  if(!regionName){datalist.replaceChildren();return}
  const prefix=locationKey(query);
  const options=TOWN_RECORDS.filter(place=>(!regionName||place.region===regionName)&&(!prefix||place.key.startsWith(prefix))).slice(0,20);
  datalist.replaceChildren(...options.map(place=>{
    const option=document.createElement("option");
    option.value=place.name;
    option.label=`${place.name} — ${place.region} Region`;
    return option;
  }));
}
async function loadLocationCatalog(){
  const response=await fetch("/ghana-locations.json");
  if(!response.ok)throw new Error(`Town directory request failed with HTTP ${response.status}.`);
  const catalog=await response.json();
  if(!Array.isArray(catalog.regions)||!Array.isArray(catalog.campuses))throw new Error("Town directory data is invalid.");
  const regionNames=catalog.regions.map(entry=>entry.name);
  if(REGIONS.some(name=>!regionNames.includes(name)))throw new Error("Town directory is missing a Ghana region.");
  TOWN_RECORDS=catalog.regions.flatMap(entry=>entry.towns.map(name=>({name,region:entry.name,key:locationKey(name)})))
    .sort((a,b)=>a.key.localeCompare(b.key)||a.region.localeCompare(b.region));
  CAMPUS=Object.fromEntries(catalog.campuses.map(entry=>{
    const label=`${entry.institution} — ${entry.campus} (${entry.town}, ${entry.region} Region)`;
    return [label,{r:entry.region,t:entry.town,m:{}}];
  }));
  camp.innerHTML='<option value="">Choose your campus</option>'+Object.keys(CAMPUS).map(name=>`<option>${htmlEsc(name)}</option>`).join("");
  populateOwnerTownOptions($("f_town")?.value||"",$("f_region")?.value||"");
}
function ensureLocationCatalog(){
  if(!locationCatalogPromise){
    locationCatalogPromise=loadLocationCatalog().then(()=>{
      $("location-status").hidden=true;
    }).catch(error=>{
      locationCatalogPromise=null;
      console.error("Could not load Ghana location directory:",error);
      const status=$("location-status");
      status.textContent="Town and campus suggestions could not be loaded. Please try again.";
      status.hidden=false;
      camp.innerHTML='<option value="">Campus suggestions unavailable</option>';
      throw error;
    });
  }
  return locationCatalogPromise;
}
function requestLocationCatalog(){return ensureLocationCatalog().catch(()=>{});}
const st=r=>r.un?["r","Unavailable"]:r.availableFrom?["y","Available from "+new Date(r.availableFrom+"T00:00:00").toLocaleDateString()]:r.d===0?["g","Confirmed today"]:r.d<=7?["g","Confirmed "+(r.d===1?"1 day":r.d+" days")+" ago"]:r.d<=20?["y","Confirmed "+r.d+" days ago"]:["w","Needs confirmation"];
const rank=r=>r.un?3:r.d>20?2:r.d>7?1:0;
function sv(r){const f=r.f,D=DEF[r.ty];return{Water:f.includes("Water")?"Included":"Separate",Electricity:"Separate","Wi-Fi":f.includes("Wi-Fi")?"Included":"No",Kitchen:D.kit,Bathroom:D.bath,Security:f.includes("Security")||f.includes("Gated")?"Included":"No",Parking:f.includes("Parking")?"Included":"No"}}
const has=(r,k)=>k==="Kitchen"?(r.f.includes("Kitchen")||r.ty==="chamber"||r.ty==="self"):k==="Security"?(r.f.includes("Security")||r.f.includes("Gated")):r.f.includes(k);
function match(r,a,t){const m=parseInt(max.value,10);return (!region.value||r.region===region.value)&&(!t||r.t===t)&&(!a||r.a===a)&&(!ty.value||r.ty===ty.value)&&(!m||r.p<=m)&&[...must].every(k=>has(r,k))}
function fillAreas(){const areas=[...new Set(ROOMS.filter(r=>(!town.value||r.t===town.value)&&(!region.value||r.region===region.value)).map(r=>r.a))];area.innerHTML='<option value="">All areas</option>'+areas.map(a=>`<option>${htmlEsc(a)}</option>`).join("")}
function art(i){const w=["#E4D9C3","#D3DCD5","#DCD6E4","#EBDCCB"][i%4],b=["#5B7A8C","#8C6A5B","#5B8C74","#8C5B76"][i%4];
return `<svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="170" fill="${w}"/><rect y="128" width="400" height="42" fill="#0000001c"/><rect x="40" y="30" width="86" height="80" rx="3" fill="#BFD8E8"/><path d="M83 30v80M40 70h86" stroke="#fff" stroke-width="4"/><rect x="170" y="78" width="190" height="50" rx="6" fill="${b}"/><rect x="170" y="62" width="34" height="30" rx="6" fill="#fff"/><rect x="170" y="128" width="8" height="14" fill="#5a4a3a"/><rect x="352" y="128" width="8" height="14" fill="#5a4a3a"/><rect x="336" y="96" width="4" height="34" fill="#444"/><path d="M328 96h20l-4-14h-12z" fill="#F6D58A"/></svg>`}
const btns=r=>`<a class="wa" href="https://wa.me/${encodeURIComponent(r.wa||r.c)}?text=${encodeURIComponent("Hello, is the room on NestGH ("+r.n+") still available?")}">WhatsApp</a><a class="call" href="tel:+${encodeURIComponent(r.c)}" aria-label="Call">${ico("phone")}</a>`;
function card(r,cm){const i=ROOMS.indexOf(r),[k,l]=st(r),mn=cm&&cm.m[r.a];
return `<article class="card${r.un?" off":""}" data-o="${i}"><div class="pic">${r.photos?.[0]?`<img src="${htmlEsc(r.photos[0])}" alt="${htmlEsc(r.n)}" width="400" height="170" loading="lazy" decoding="async">`:art(i)}<span class="ty">${htmlEsc(TYPE[r.ty])}</span><button class="hb" data-i="${i}" aria-label="${saved.has(r.id)?"Remove from":"Save"} saved rooms" aria-pressed="${saved.has(r.id)}">${ico("heart")}</button></div><div class="b"><h3><button class="lk" data-o="${i}">${htmlEsc(r.n)}</button></h3><div class="loc">${ico("pin")}${htmlEsc(r.a)}, ${htmlEsc(r.t)}${mn?" · "+mn+" min from campus":""}</div><div class="fac">${r.f.map(x=>`<span>${htmlEsc(x)}</span>`).join("")}</div><div class="meta"><span class="st"><i class="${k}"></i>${l}</span>${r.v?" · <b>✔ Verified</b>":""}</div><div class="ft"><div class="pr">${ghs(r.p)} <small>/month</small></div><div class="acts">${r.un?'<span class="gone">Taken</span>':btns(r)}</div></div></div></article>`}
function nearby(){const a=area.value;
if(!a)return `<div class="empty"><b>No rooms found in ${htmlEsc(town.value)}</b><p>Try a higher budget, another room type, or fewer must-haves.</p></div>`;
const c=(NB[town.value+"|"+a]||[]).map(([na,nt,km,lo,hi])=>({na,nt,km,lo,hi,n:ROOMS.filter(r=>!r.un&&match(r,na,nt)).length})).filter(x=>x.n).sort((x,y)=>(x.lo+x.hi)-(y.lo+y.hi)||x.km-y.km);
return `<div class="empty near"><b>No rooms found in ${htmlEsc(a)}.</b><p>${c.length?"Try these nearby areas. Travel times are estimates and change with traffic.":"No matching rooms nearby either. Try a higher budget or another room type."}</p><div class="nl">${c.map(x=>`<button class="nb" data-t="${htmlEsc(x.nt)}" data-a="${htmlEsc(x.na)}"><b>${htmlEsc(x.na)}</b><span>${x.n} room${x.n>1?"s":""} · usually ${x.lo}–${x.hi} min away · ${x.km} km</span></button>`).join("")}</div></div>`}
function render(){const cm=stu.checked&&camp.value?CAMPUS[camp.value]:null;
const res=ROOMS.filter(r=>savedOnly?saved.has(r.id):match(r,area.value,town.value)).sort((a,b)=>rank(a)-rank(b)||(cm?((a.ty==="hostel"?0:1)-(b.ty==="hostel"?0:1)||(cm.m[a.a]||99)-(cm.m[b.a]||99)):0)||a.d-b.d);
const live=res.filter(r=>!r.un).length;
$("re").textContent=savedOnly?"Your saved rooms":"Rooms in "+([region.value&&`${region.value} Region`,area.value||town.value].filter(Boolean).join(" · ")||"Ghana");
$("rt").textContent=savedOnly?(live?`${live} saved room${live>1?"s":""}`:"No saved rooms yet"):ROOMS.length?(live?`${live} room${live>1?"s":""} available`:"No rooms found"):"";
$("list").setAttribute("aria-busy",String(isLoadingListings));
const emptyMessage=live?"":savedOnly?'<div class="empty"><b>No saved rooms yet</b><p>Tap the heart on a room to save it here.</p></div>':hasMoreListings?`<div class="empty"><b>No matching rooms in the listings loaded so far.</b><p>Load more rooms to continue your search.</p></div>`:nearby();
const loadError=listingLoadFailed?'<div class="empty"><b>Could not load more rooms.</b><p>Check your connection, then try again.</p></div>':"";
$("list").innerHTML=loadError+emptyMessage+res.map(r=>card(r,cm)).join("");
const loadMore=$("load-more");
loadMore.hidden=(!hasMoreListings&&!listingLoadFailed)||savedOnly||!supabaseClient;
loadMore.disabled=isLoadingListings;
loadMore.textContent=isLoadingListings?"Loading rooms…":listingLoadFailed?"Try loading rooms again":(town.value||region.value||area.value||ty.value||max.value||must.size?"Load more to find matches":"Load more rooms");
}
function openSheet(i){const r=ROOMS[i],d=r.details||{},m=d.m||{},D=DEF[r.ty],s=sv(r),[k,l]=st(r),h=r.ty==="hostel";
const kv=o=>`<div class="kv">${Object.entries(o).map(([a,b])=>`<div><span>${htmlEsc(a)}</span><b>${htmlEsc(b)}</b></div>`).join("")}</div>`;
const tg=(a,c="")=>`<div class="tags ${c}">${a.map(x=>`<span>${htmlEsc(x)}</span>`).join("")||"<span>None</span>"}</div>`;
const included=Object.entries(m).filter(([,v])=>["Included","Private","Shared"].includes(v)).map(([a,b])=>`${a.replace(/^(inc_|fac_)/,"")}: ${b}`);
const separate=Object.entries(m).filter(([,v])=>["Separate Charge","Not Included","Extra Charge"].includes(v)).map(([a,b])=>`${a.replace(/^(inc_|fac_)/,"")}: ${b}`);
const photos=r.photos.map((photo,index)=>`<img src="${htmlEsc(photo)}" alt="${htmlEsc(r.n)} photo ${index+1}" width="400" height="300" loading="lazy" decoding="async">`).join("");
const pl=d.period==="Other"?d.periodOther:(d.period||"Monthly");
const otherCost=Number(d.oth)||0;
const extras=[d.othNote?`${d.othNote}: ${ghs(otherCost)}`:"",d.notinc].filter(Boolean);
const rules={"Who can stay":Array.isArray(d.who)?d.who.join(", "):"", "Maximum occupants":d.maxOcc||"Not specified",Cooking:d.cooking||"Not specified",Visitors:d.visitors||"Not specified",Pets:d.pets||"Not specified",Smoking:d.smoking||"Not specified",Curfew:d.curfew==="Curfew applies"?d.curfewTime:"No curfew",Noise:d.noise||"Not specified"};
$("sheet").innerHTML=`<div class="sp" role="dialog" aria-modal="true" aria-label="${htmlEsc(r.n)}"><button class="x" id="cx" aria-label="Close">Close ✕</button><div class="pic sm">${photos||art(i)}</div>
<h3 class="sn">${htmlEsc(r.n)}</h3><div class="loc">${ico("pin")}${htmlEsc(r.a)}, ${htmlEsc(r.t)}</div><div class="meta"><span class="st"><i class="${k}"></i>${l}</span>${r.v?" · <b>✔ NestGH Verified</b>":""}</div>
<h4>Room overview</h4>${kv({Type:d.type||TYPE[r.ty],Condition:d.cond||"Not specified",Furnished:d.furn||"Not specified","Approx. size":d.size||D.size,Bathroom:d.bath||D.bath,Kitchen:d.kit||D.kit,"Units available":d.aunits||"Not specified"})}
<h4>Price and costs</h4>${kv({Rent:ghs(r.rentAmount??r.p)+" / "+pl,Advance:(r.adv||0)+" payment(s) upfront","Security deposit":ghs(r.dep),"Agency or caretaker fee":ghs(r.fee),"Other mandatory charges":ghs(otherCost)})}<div class="tot"><span>Estimated initial payment</span><b>${ghs((r.rentAmount??r.p)*r.adv+r.dep+r.fee+otherCost)}</b></div>
<h4>What is included</h4>${tg(included)}<h4>What you pay for separately</h4>${tg(separate.concat(extras),"sep")}<h4>Facilities</h4>${tg(r.f)}
<h4>Rules</h4>${kv(rules)}
<h4>Location</h4><p class="np">Landmark: ${htmlEsc(r.lm)}. The exact address is not shown publicly.</p><a class="mp" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.a+" "+r.t+" Ghana")}">Open area in Maps</a>
<h4>Photos</h4><div class="listing-photos">${photos||"<p class=np>No photos provided.</p>"}</div>
<h4>Availability</h4>${kv({Status:r.un?"Taken":d.avail==="Yes, available now"?"Available now":"Available from "+(d.from||"a later date"),"Last confirmed":r.d===0?"Today":r.d+" days ago"})}
<h4>Owner or caretaker</h4><p class="np">${htmlEsc(r.own||"Owner")}. Contact the listing owner directly.</p>
<div class="acts big">${r.un?'<span class="gone">Taken</span>':btns(r)}</div>
<h4>Report this listing</h4><div class="rep"><select id="rr" aria-label="Reason"><option>Room already taken</option><option>Wrong price</option><option>Fake photos</option><option>Wrong location</option><option>Suspicious or scam</option><option>Owner not responding</option></select><button class="btn" id="rp" data-id="${htmlEsc(r.id)}">Report</button></div></div>`;
$("sheet").classList.add("on");updateModalScroll();{const sp=$("sheet").querySelector(".sp");sp.tabIndex=-1;sp.focus({preventScroll:true})}}
function closeSheet(){$("sheet").classList.remove("on");updateModalScroll()}
$("sheet").onclick=async e=>{if(e.target.id==="sheet"||e.target.closest("#cx"))closeSheet();const report=e.target.closest("#rp");if(report){if(!supabaseClient)return toast("Reports are unavailable right now.");report.disabled=true;const {error}=await supabaseClient.from("listing_reports").insert({listing_id:report.dataset.id,reason:$("rr").value});if(error){console.error("Could not submit listing report:",error);report.disabled=false;toast("Your report could not be sent. Please try again.")}else{toast("Thank you. Your report has been sent for review.");report.textContent="Reported"}}};
document.onkeydown=e=>{if(e.key==="Escape"){closeSheet();$("links").classList.remove("open");$("mn").setAttribute("aria-expanded","false")}};
$("list").onclick=e=>{const nb=e.target.closest(".nb");if(nb){const place=TOWN_RECORDS.find(item=>item.name===nb.dataset.t&&item.region===region.value)||TOWN_RECORDS.find(item=>item.name===nb.dataset.t);if(place)chooseTown(place);else town.value=nb.dataset.t;fillAreas();area.value=nb.dataset.a;render();return}
const hb=e.target.closest(".hb");if(hb){const r=ROOMS[+hb.dataset.i];saved.has(r.id)?saved.delete(r.id):saved.add(r.id);try{localStorage.setItem("nestgh_saved_rooms_v1",JSON.stringify([...saved]))}catch(error){console.error("Could not save room preference:",error)}render();return}
if(e.target.closest("a"))return;const c=e.target.closest(".card");if(c)openSheet(+c.dataset.o)};
town.addEventListener("input",()=>{selectedTown=null;area.value="";showTownSuggestions(town.value);requestLocationCatalog().then(()=>showTownSuggestions(town.value))});
town.addEventListener("focus",()=>{showTownSuggestions(town.value);requestLocationCatalog().then(()=>showTownSuggestions(town.value))});
town.addEventListener("keydown",event=>{
  if(event.key==="ArrowDown"&&!townSuggestions.hidden){event.preventDefault();townSuggestions.querySelector("button")?.focus()}
  else if(event.key==="Escape")hideTownSuggestions();
});
townSuggestions.addEventListener("focusin",event=>{
  townSuggestions.querySelectorAll("button").forEach(option=>option.setAttribute("aria-selected",String(option===event.target.closest("button"))));
});
townSuggestions.addEventListener("click",event=>{
  const option=event.target.closest("[data-town-index]");
  if(!option)return;
  const place=currentTownSuggestions[Number(option.dataset.townIndex)];
  if(place)chooseTown(place);
});
townSuggestions.addEventListener("keydown",event=>{
  const options=[...townSuggestions.querySelectorAll("button")],index=options.indexOf(document.activeElement);
  if(event.key==="ArrowDown"||event.key==="ArrowUp"){
    event.preventDefault();
    options[Math.max(0,Math.min(options.length-1,index+(event.key==="ArrowDown"?1:-1)))]?.focus();
  }else if(event.key==="Escape"){
    hideTownSuggestions();
    town.focus();
  }
});
document.addEventListener("click",event=>{
  if(!townSuggestions.contains(event.target)&&event.target!==town)hideTownSuggestions();
});
region.onchange=()=>{
  selectedTown=null;
  if(town.value&&!TOWN_RECORDS.some(place=>place.name===town.value&&place.region===region.value))town.value="";
  area.value="";
  if(town.value)showTownSuggestions(town.value);
  fillAreas();
  render();
};
document.querySelectorAll(".mh").forEach(b=>b.onclick=()=>{const k=b.dataset.k;must.has(k)?must.delete(k):must.add(k);b.setAttribute("aria-pressed",must.has(k));render()});
stu.onchange=()=>{camp.classList.toggle("open",stu.checked);if(!stu.checked)camp.value="";else requestLocationCatalog();render()};
camp.onchange=()=>{if(camp.value){const selected=CAMPUS[camp.value];region.value=selected.r;town.value=selected.t;area.value="";selectedTown={name:selected.t,region:selected.r};hideTownSuggestions();fillAreas()}render()};
[area,ty].forEach(e=>e.onchange=render);max.oninput=render;
$("clr").onclick=()=>{region.value="";town.value="";selectedTown=null;ty.value="";max.value="";area.value="";must.clear();document.querySelectorAll(".mh").forEach(b=>b.setAttribute("aria-pressed","false"));stu.checked=false;camp.value="";camp.classList.remove("open");hideTownSuggestions();fillAreas();render()};
$("form").onsubmit=e=>{
  e.preventDefault();
  if(town.value){
    const candidates=TOWN_RECORDS.filter(place=>place.key===locationKey(town.value)&&(!region.value||place.region===region.value));
    if(candidates.length===1)chooseTown(candidates[0]);
    else if(!selectedTown){showTownSuggestions(town.value);town.focus();return}
  }
  render();
  $("rooms").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
};
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),2400)}
["l1","l2"].forEach(i=>$(i).onclick=openLF);
$("sv").onclick=()=>{savedOnly=!savedOnly;$("sv").setAttribute("aria-pressed",savedOnly);$("sv").setAttribute("aria-label",savedOnly?"Show all rooms":"Show saved rooms");render();$("rooms").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"})};
$("mn").onclick=()=>{const open=$("links").classList.toggle("open");$("mn").setAttribute("aria-expanded",String(open))};
$("links").onclick=e=>{if(e.target.closest("a")){$("links").classList.remove("open");$("mn").setAttribute("aria-expanded","false")}};
camp.innerHTML='<option value="">Select student to load campuses</option>';fillAreas();render();
async function loadListingFee(){
  if(!supabaseClient)throw new Error("Supabase is not configured.");
  const {data,error}=await supabaseClient.from("public_site_settings")
    .select("listing_fee_pesewas, currency")
    .single();
  if(error)throw error;
  const fee=Number(data?.listing_fee_pesewas);
  if(!Number.isSafeInteger(fee)||fee<=0||data?.currency!=="GHS")throw new Error("Listing fee settings are invalid.");
  listingFeePesewas=fee;
}
async function refreshListingFee(){
  try{await loadListingFee()}
  catch(error){console.error("Could not load current listing fee:",error);listingFeePesewas=null}
}
refreshListingFee();
function mapPublicListing(row){
  const d=row.public_data||{},m=d.m||{},type=d.type||"";
  const ty=/hostel/i.test(type)?"hostel":/self-contained/i.test(type)?"self":/chamber/i.test(type)?"chamber":"single";
  const facilities=Object.entries(m).filter(([,v])=>["Included","Private","Shared"].includes(v)).map(([k])=>k.replace(/^(inc_|fac_)/,""));
  if(d.feat)facilities.push(d.feat);
  if(d.facOther)facilities.push(d.facOther);
  const phone=String(d.phone||"").replace(/\D/g,"").replace(/^0/,"233");
  const whatsapp=String(d.wa||d.phone||"").replace(/\D/g,"").replace(/^0/,"233");
  const confirmedAt=Date.parse(d.confirmed_at||row.created_at||"");
  const confirmedDays=Number.isFinite(confirmedAt)?Math.max(0,Math.floor((Date.now()-confirmedAt)/86400000)):0;
  const periodMonths={"3 Months":3,"6 Months":6,Yearly:12,Semester:6};
  const rentAmount=Number(d.rent)||0,period=String(d.period||"Monthly");
  return {id:row.id,t:String(d.town||""),region:String(d.region||""),a:String(d.area||""),ty,n:String(d.title||"Room listing"),p:rentAmount/(periodMonths[period]||1),rentAmount,period,
    f:[...new Set(facilities)],v:Boolean(d.verified),d:confirmedDays,adv:Number(d.adv)||0,dep:Number(d.dep)||0,fee:Number(d.fee)||0,
    lm:String(d.lm||""),c:phone,wa:whatsapp,own:String(d.role||"Property owner"),un:row.status==="unavailable",
    availableFrom:d.avail==="No, available from a later date"?String(d.from||""): "",
    photos:Array.isArray(d.photos)?d.photos.filter(photo=>typeof photo==="string"&&photo.startsWith("https://")):[],details:d};
}
async function loadPublicListings(){
  const state=$("db-status");
  if(isLoadingListings)return;
  if(!supabaseClient){$("list").innerHTML='<div class="empty"><b>Room listings are temporarily unavailable.</b><p>We could not connect to the listings service.</p></div>';$("list").setAttribute("aria-busy","false");$("load-more").hidden=true;state.textContent="Room listings are temporarily unavailable because the Supabase browser configuration could not load.";return}
  isLoadingListings=true;
  listingLoadFailed=false;
  state.textContent=listingOffset?"Loading more rooms.":"Loading available rooms.";
  $("list").setAttribute("aria-busy","true");
  $("load-more").hidden=true;
  let data,error;
  try{
    ({data,error}=await supabaseClient.from("public_listings")
      .select("id,public_data,created_at")
      .order("created_at",{ascending:false})
      .order("id",{ascending:true})
      .range(listingOffset,listingOffset+LISTING_PAGE_SIZE-1));
  }catch(requestError){
    isLoadingListings=false;
    listingLoadFailed=true;
    console.error("Could not request approved listings:",requestError);
    state.textContent="We could not load rooms right now. Please try again.";
    render();
    return;
  }
  isLoadingListings=false;
  if(error){listingLoadFailed=true;console.error("Could not load approved listings:",error);state.textContent="We could not load rooms right now. Please try again.";render();return}
  listingLoadFailed=false;
  const page=data||[];
  listingOffset+=page.length;
  hasMoreListings=page.length===LISTING_PAGE_SIZE;
  const selectedArea=area.value;
  ROOMS.push(...page.map(mapPublicListing).filter(room=>room.t&&room.a&&room.p>0&&room.c));
  fillAreas();
  if(selectedArea&&[...area.options].some(option=>option.value===selectedArea))area.value=selectedArea;
  state.textContent=ROOMS.length?`${ROOMS.length} room${ROOMS.length===1?"":"s"} loaded${hasMoreListings?". Load more to continue browsing.":"."}`:"There are no approved rooms available at the moment.";
  render();
}
document.querySelector("#load-more").addEventListener("click",loadPublicListings);
loadPublicListings();
async function verifyPaymentReturn(){
  const url=new URL(window.location.href),reference=url.searchParams.get("payment_reference");
  if(!reference)return;
  url.searchParams.delete("payment_reference");
  history.replaceState(null,"",url.pathname+url.search+url.hash);
  if(!supabaseClient){toast("Payment returned, but payment verification is unavailable. Contact NestGH with reference "+reference+".");return}
  const resultStatus=$("payment-return-status"),retryButton=$("retry-payment");
  let data,error;
  try{({data,error}=await supabaseClient.functions.invoke("verify-listing-payment",{body:{reference}}))}
  catch(requestError){error=requestError}
  if(error||data?.error){
    console.error("Listing payment verification failed:",error||data.error);
    resultStatus.textContent="We could not verify payment yet. Do not pay again until you check the payment status. If Paystack marked the attempt failed or cancelled, you can retry. Reference: "+reference;
    resultStatus.hidden=false;
    retryButton.hidden=!getPendingSubmission(reference);
    toast("Payment verification is pending. Reference: "+reference);
    return;
  }
  clearPendingSubmission();
  resultStatus.textContent="Payment verified. Your listing is now waiting for NestGH review.";
  resultStatus.hidden=false;
  toast("Payment verified. Your listing is now waiting for NestGH review.");
}
verifyPaymentReturn();
function getPendingSubmission(reference){
  try{
    const value=JSON.parse(sessionStorage.getItem("nestgh_pending_payment")||"null");
    return value?.reference===reference?value:null;
  }catch(error){
    console.error("Could not read saved payment retry details:",error);
    return null;
  }
}
function readPendingSubmission(){
  try{return JSON.parse(sessionStorage.getItem("nestgh_pending_payment")||"null")}
  catch(error){console.error("Could not read saved payment retry details:",error);return null}
}
function clearPendingSubmission(){
  try{sessionStorage.removeItem("nestgh_pending_payment")}
  catch(error){console.error("Could not clear saved payment retry details:",error)}
}
async function beginCheckout(form){
  if(!Number.isSafeInteger(listingFeePesewas)||listingFeePesewas<=0)throw new Error("The current listing fee could not be loaded. Please refresh and try again.");
  form.set("expected_fee_pesewas",String(listingFeePesewas));
  const response=await fetch(window.NESTGH_SUPABASE_CONFIG.url+"/functions/v1/start-listing-payment",{
    method:"POST",headers:{apikey:window.NESTGH_SUPABASE_CONFIG.publishableKey},body:form
  });
  const result=await response.json();
  if(!response.ok||!result.authorization_url)throw new Error(result.error||"Secure checkout could not be started.");
  const checkout=new URL(result.authorization_url);
  if(checkout.protocol!=="https:"||(checkout.hostname!=="paystack.com"&&!checkout.hostname.endsWith(".paystack.com")))throw new Error("The payment provider returned an invalid checkout link.");
  const submission=JSON.parse(form.get("listing"));
  try{sessionStorage.setItem("nestgh_pending_payment",JSON.stringify({submission_id:form.get("submission_id"),email:submission.email,reference:result.reference,expectedFeePesewas:listingFeePesewas}))}
  catch(error){console.error("Could not save payment retry details:",error)}
  S.ref=result.reference;
  window.location.assign(checkout.toString());
}
async function retrySecurePayment(){
  const pending=readPendingSubmission();
  const reference=pending?.reference;
  if(!pending){toast("Payment retry details are unavailable. Contact NestGH with your payment reference.");return}
  await refreshListingFee();
  if(listingFeePesewas===null){$("payment-return-status").textContent="The current listing fee could not be loaded. Please refresh the page before retrying.";return}
  if(pending.expectedFeePesewas!==listingFeePesewas){
    pending.expectedFeePesewas=listingFeePesewas;
    try{sessionStorage.setItem("nestgh_pending_payment",JSON.stringify(pending))}
    catch(error){console.error("Could not update saved listing fee for retry:",error)}
    $("payment-return-status").textContent="The listing fee is now "+formatFeePesewas(listingFeePesewas)+". Review the updated fee, then select the retry button again to continue.";
    $("retry-payment").textContent="Retry at "+formatFeePesewas(listingFeePesewas);
    return;
  }
  const listing={submission_id:pending.submission_id,email:pending.email,title:"Previously submitted listing",town:"Pending",area:"Pending",rent:1,phone:"0240000000",cons:Array(6).fill(true)};
  const form=new FormData();
  form.append("submission_id",pending.submission_id);
  form.append("listing",JSON.stringify(listing));
  $("retry-payment").disabled=true;
  try{await refreshListingFee();await beginCheckout(form)}
  catch(error){
    console.error("Could not retry listing payment:",error);
    toast(error instanceof Error?error.message:"Secure checkout could not be started.");
    $("retry-payment").disabled=false;
  }
}
$("retry-payment").onclick=retrySecurePayment;
/* ===== LIST A ROOM ===== */
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TYPES=["Single Room","Chamber & Hall","Self-Contained","1-in-a-Room","2-in-a-Room","4-in-a-Room","Student Hostel"],CONDS=["New","Newly Renovated","Good Condition","Fair Condition"],
PERIODS=["Monthly","3 Months","6 Months","Yearly","Semester","Other"],
INC=["Water","Electricity","Wi-Fi","Kitchen","Bathroom","Wardrobe","Bed","Mattress","Parking","Security","Cleaning"],INCO=["Included","Not Included","Shared","Separate Charge"],
FAC=["Water","Electricity","Wi-Fi","Kitchen","Bathroom","Security","Gated Compound","Parking","Laundry Area","Waste Disposal"],FACO=["Not available","Private","Shared","Included","Extra Charge"],
WHO=["Students","Workers","Families","Couples","Male","Female","Anyone"],PHC=["Exterior","Bedroom","Bathroom","Kitchen","Compound or common area"],EXC=["Hall","Wardrobe","Parking","Balcony","Surrounding area","Other"],
ROLES=["Property Owner","Caretaker","Hostel Manager","Authorized Representative"],
CONS=["I confirm that I am authorized to list this property.","The information I have provided is accurate.","The room is genuinely available.","I understand that NestGH may contact me to confirm availability.","I consent to my profile photo and relevant contact information being displayed to people viewing my listing.","I understand that NestGH may reject or remove inaccurate, misleading or fraudulent listings."],
PL={Monthly:"month","3 Months":"3 months","6 Months":"6 months",Yearly:"year",Semester:"semester"};
const S={m:{},ph:{},extra:[],who:[],cons:[]},LIST={};let cur=0,reach=0;const done=new Set();
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const n=k=>parseFloat(S[k]),blank=k=>!String(S[k]??"").trim(),okPhone=v=>/^(?:0|\+?233)[235]\d{8}$/.test(String(v||"").replace(/[\s-]/g,""));
const F=(k,l,i,h="")=>`<div class="fld" data-f="${k}"><label for="f_${k}">${l}</label>${i}${h?`<small>${h}</small>`:""}<em class="er" role="alert"></em></div>`;
const inp=(k,t="text",a="")=>`<input id="f_${k}" data-k="${k}" type="${t}" value="${esc(S[k])}" ${a}>`;
const sel=(k,o)=>`<select id="f_${k}" data-k="${k}"><option value="">Select</option>${o.map(x=>`<option${S[k]===x?" selected":""}>${x}</option>`).join("")}</select>`;
const txt=(k,r,ph="")=>`<textarea id="f_${k}" data-k="${k}" rows="${r}" placeholder="${ph}">${esc(S[k])}</textarea>`;
const rad=(k,o)=>`<div class="rg" role="radiogroup">${o.map(x=>`<label class="ch"><input type="radio" name="${k}" data-k="${k}" value="${x}"${S[k]===x?" checked":""}><span>${x}</span></label>`).join("")}</div>`;
const chk=(k,o)=>`<div class="rg">${o.map(x=>`<label class="ch"><input type="checkbox" data-c="${k}" value="${x}"${(S[k]||[]).includes(x)?" checked":""}><span>${x}</span></label>`).join("")}</div>`;
const mrow=(k,l,o)=>`<div class="mx" data-f="${k}"><span>${l}</span><select data-m="${k}" aria-label="${l}"><option value="">Select</option>${o.map(x=>`<option${S.m[k]===x?" selected":""}>${x}</option>`).join("")}</select><em class="er"></em></div>`;
const bd=()=>{const r=n("rent")||0,a=n("adv")||0,d=n("dep")||0,f=n("fee")||0,o=n("oth")||0,pl=S.period==="Other"?(S.periodOther||"period"):(PL[S.period]||"period");
return `<div class="tot2"><div><span>Rent</span><b>${ghs(r)} / ${esc(pl)}</b></div><div><span>Advance</span><b>${a} × ${esc(pl)} (${ghs(r*a)})</b></div><div><span>Security deposit</span><b>${ghs(d)}</b></div><div><span>Agency or caretaker fee</span><b>${ghs(f)}</b></div><div><span>Other mandatory charges</span><b>${ghs(o)}</b></div><div class="g"><span>Estimated amount required to move in</span><b>${ghs(r*a+d+f+o)}</b></div></div>`};
const slot=c=>`<div class="ps" data-f="ph_${c}"><b>${c}</b><div class="pv">${S.ph[c]?`<img src="${S.ph[c]}" alt="${c} photo">`:"No photo yet"}</div><div class="pa"><label class="btn2 up">${S.ph[c]?"Replace":"Upload"}<input type="file" accept="image/jpeg,image/png,image/webp" data-ph="${c}"></label>${S.ph[c]?`<button type="button" class="btn2" data-rm="${c}">Remove</button>`:""}</div><em class="er"></em></div>`;
const xl=()=>S.extra.map((x,i)=>`<div class="xr"><img src="${x.src}" alt="Extra photo ${i+1}"><select data-xc="${i}" aria-label="Photo category">${EXC.map(o=>`<option${x.cat===o?" selected":""}>${o}</option>`).join("")}</select><div><button type="button" class="btn2" data-xu="${i}" aria-label="Move up">↑</button><button type="button" class="btn2" data-xd="${i}" aria-label="Move down">↓</button><button type="button" class="btn2" data-xr="${i}">Remove</button></div></div>`).join("");
const KV=o=>`<div class="kv">${Object.entries(o).map(([a,b])=>`<div><span>${a}</span><b>${esc(b)}</b></div>`).join("")}</div>`;
const sec=(t,i,h)=>`<section class="rv"><div class="rh"><b>${t}</b><button type="button" class="ed" data-go="${i}">Edit</button></div>${h}</section>`;
const tags=a=>`<div class="vs">${a.map(x=>`<span>${esc(x)}</span>`).join("")}</div>`;
const VAGUE=/^(nice|good|great|clean)?\s*room[.!]*$|^call me[.!]*$/i,MAPRE=/^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.)/i;
const STEPS=[
{n:"Room",r:()=>`<h2>Room information</h2><p class="sub2">What are you listing? Tell seekers exactly what they will get.</p>
${F("title","Listing title",inp("title","text",'maxlength="80" placeholder="e.g. Self-contained room near Community 20 market"'))}
${F("type","Accommodation type",sel("type",TYPES))}${F("cond","Property condition",sel("cond",CONDS))}
${F("furn","Furnished or unfurnished",rad("furn",["Furnished","Unfurnished"]))}
${F("units","Number of rooms or units available",inp("units","number",'min="1" inputmode="numeric"'))}
${F("desc","Room description",txt("desc",5,"Describe the room, its condition, location, facilities and anything a tenant should know."),'Describe the room, its condition, location, facilities and anything a tenant should know. Not just "Nice room". <span id="cc"></span>')}
<h3>Room details</h3>${F("beds","Number of bedrooms",inp("beds","number",'min="0" inputmode="numeric"'))}${F("bath","Bathroom type",rad("bath",["Private","Shared","None"]))}${F("kit","Kitchen type",rad("kit",["Private","Shared","None"]))}
${F("size","Approximate room size",inp("size","text",'placeholder="e.g. 12 m² or 4 m x 5 m"'))}${F("floor","Floor level",sel("floor",["Ground floor","1st floor","2nd floor","3rd floor","4th floor or higher"]))}
${F("store","Wardrobe or storage",sel("store",["Built-in wardrobe","Space for a wardrobe","No storage"]))}${F("balc","Balcony",rad("balc",["Yes","No"]))}${F("feat","Other important features (optional)",inp("feat"))}`,
v:()=>{const e={},d=(S.desc||"").trim();
if((S.title||"").trim().length<8)e.title="Please enter a listing title (at least 8 characters).";if(!S.type)e.type="Please select the room type.";if(!S.cond)e.cond="Please select the property condition.";if(!S.furn)e.furn="Please choose furnished or unfurnished.";
if(!(n("units")>=1))e.units="Please enter how many rooms or units are available.";if(d.length<100||d.split(/\s+/).length<15||VAGUE.test(d))e.desc="Please describe the room properly. Write at least 100 characters (about 15 words).";
if(blank("beds")||n("beds")<0)e.beds="Please enter the number of bedrooms (0 if none).";if(!S.bath)e.bath="Please choose the bathroom type.";if(!S.kit)e.kit="Please choose the kitchen type.";if(blank("size"))e.size="Please enter the approximate room size.";
if(!S.floor)e.floor="Please select the floor level.";if(!S.store)e.store="Please select wardrobe or storage.";if(!S.balc)e.balc="Please say whether there is a balcony.";return e}},
{n:"Location",r:()=>`<h2>Location</h2><p class="sub2">Seekers see the area and landmark. Your exact address stays private.</p>
${F("region","Region",sel("region",REGIONS))}${F("town","Town or city",inp("town","text",'list="tl" autocomplete="off" placeholder="Choose a region first"'))}<datalist id="tl"></datalist>
${F("area","Area or community",inp("area","text",'placeholder="e.g. Community 20"'))}${F("lm","Nearest landmark",inp("lm","text",'placeholder="e.g. Community 20 Market"'))}
${F("addr","Exact address or directions (private: only NestGH admin sees this)",txt("addr",3,"House number, street name, or directions to the house"))}
<div class="fld" data-f="map"><label>Map location</label><button type="button" class="btn2" id="gps">Use my current location</button><div class="or">or paste a Google Maps link to the property</div>${inp("mapLink","url",'placeholder="https://maps.app.goo.gl/..."')}<small id="mapst">${S.lat?"Location saved: "+S.lat+", "+S.lng:"Standing at the property helps. In Google Maps, press and hold to drop a pin, tap Share, and paste the link here."}</small><a class="mp" target="_blank" rel="noopener" href="https://www.google.com/maps">Open Google Maps</a><em class="er"></em></div>`,
v:()=>{const e={};if(!S.region)e.region="Please select the region.";if(blank("town"))e.town="Please enter the town or city.";else if(!TOWN_RECORDS.some(place=>place.region===S.region&&place.key===locationKey(S.town)))e.town="Choose a town listed under the selected region.";if(blank("area"))e.area="Please enter the area or community.";if(blank("lm"))e.lm="Please enter the nearest landmark.";
if((S.addr||"").trim().length<5)e.addr="Please enter the exact address or directions (only admin sees this).";if(!(S.lat&&S.lng)&&!MAPRE.test((S.mapLink||"").trim()))e.map="Please provide the map location: use your current location or paste a Google Maps link.";return e}},
{n:"Costs",r:()=>`<h2>Price and costs</h2><p class="sub2">Show every mandatory charge. Nothing hidden.</p>
${F("rent","Rent amount (GH₵)",inp("rent","number",'min="1" inputmode="decimal"'))}${F("period","Payment period",sel("period",PERIODS))}<div id="po" hidden>${F("periodOther","Describe the payment period",inp("periodOther","text",'placeholder="e.g. every 2 months"'))}</div>
${F("adv","Advance required (number of payments upfront)",inp("adv","number",'min="0" step="1" inputmode="numeric"'),"Example: monthly rent with 12 means one year in advance. Enter 0 if none.")}
${F("dep","Security deposit (GH₵, enter 0 if none)",inp("dep","number",'min="0" inputmode="decimal"'))}${F("fee","Agency or caretaker fee (GH₵, enter 0 if none)",inp("fee","number",'min="0" inputmode="decimal"'))}
${F("oth","Other mandatory charges (GH₵, enter 0 if none)",inp("oth","number",'min="0" inputmode="decimal"'))}<div id="on" hidden>${F("othNote","Describe the other charges",inp("othNote"))}</div>
<h3>What the seeker sees</h3><div id="bd"></div>`,
v:()=>{const e={};if(!(n("rent")>0))e.rent="Please enter the rent amount.";if(!S.period)e.period="Please select the payment period.";if(S.period==="Other"&&blank("periodOther"))e.periodOther="Please describe the payment period.";
if(blank("adv")||!(n("adv")>=0)||n("adv")%1)e.adv="Please enter the advance as a whole number (0 if none).";["dep:security deposit","fee:agency or caretaker fee","oth:other mandatory charges"].forEach(x=>{const[k,l]=x.split(":");if(blank(k)||!(n(k)>=0))e[k]="Please enter the "+l+" (0 if none)."});
if(n("oth")>0&&blank("othNote"))e.othNote="Please describe the other charges.";return e}},
{n:"Included",r:()=>`<h2>What is included</h2><p class="sub2">For each item, say what the tenant gets.</p>${INC.map(i=>mrow("inc_"+i,i,INCO)).join("")}
<div class="mx"><input type="text" data-k="incOther" placeholder="Other item (optional)" aria-label="Other item" value="${esc(S.incOther)}"><select data-m="inc_Other" aria-label="Other item status"><option value="">Select</option>${INCO.map(x=>`<option${S.m.inc_Other===x?" selected":""}>${x}</option>`).join("")}</select></div>
<h3>What is NOT included?</h3>${F("notinc","What will the tenant pay for separately, or not get?",txt("notinc",4,"e.g. Electricity is prepaid. Cleaning is GH₵30 a month. No Wi-Fi."),"Required. Be clear so tenants are not surprised.")}
<label class="ch line"><input type="checkbox" data-k="nothingSep"${S.nothingSep?" checked":""}><span>The tenant pays nothing separately. Everything needed is included.</span></label>`,
v:()=>{const e={};INC.forEach(i=>{if(!S.m["inc_"+i])e["inc_"+i]="Please choose an option."});
const sep=INC.some(i=>["Not Included","Separate Charge"].includes(S.m["inc_"+i]));
if(S.nothingSep&&sep)e.notinc="You marked some items as not included or separate. Please list them here instead of ticking the box.";else if(!S.nothingSep&&(S.notinc||"").trim().length<10)e.notinc="Please explain what is NOT included.";return e}},
{n:"Facilities",r:()=>`<h2>Facilities</h2><p class="sub2">Choose an option for every facility.</p>${FAC.map(i=>mrow("fac_"+i,i,FACO)).join("")}<div class="fld" style="margin-top:16px">${`<label for="f_facOther">Other facilities (optional)</label>`+inp("facOther")}</div>`,
v:()=>{const e={};FAC.forEach(i=>{if(!S.m["fac_"+i])e["fac_"+i]="Please choose an option."});return e}},
{n:"Rules",r:()=>`<h2>Rules</h2><p class="sub2">Say the rules now, so tenants know before they contact you.</p>
${F("who","Who can stay? (choose all that apply)",chk("who",WHO))}${F("maxOcc","Maximum occupants",inp("maxOcc","number",'min="1" inputmode="numeric"'))}
${F("cooking","Cooking allowed?",rad("cooking",["Allowed","Not allowed","Shared kitchen only"]))}${F("visitors","Visitors allowed?",rad("visitors",["Allowed","Not allowed","Daytime only"]))}
${F("pets","Pets allowed?",rad("pets",["Allowed","Not allowed"]))}${F("smoking","Smoking allowed?",rad("smoking",["Allowed","Not allowed"]))}
${F("curfew","Curfew?",rad("curfew",["No curfew","Curfew applies"]))}<div id="ct" hidden>${F("curfewTime","Curfew time",inp("curfewTime","time"))}</div>
${F("noise","Noise restrictions",sel("noise",["No restrictions","Quiet after 10 pm","Quiet all day (study-friendly)","Other (explain below)"]))}
${F("otherRules","Other rules (optional)",txt("otherRules",6,"Any other house rules tenants must follow"))}`,
v:()=>{const e={};if(!S.who.length)e.who="Please choose who can stay.";if(!(n("maxOcc")>=1))e.maxOcc="Please enter the maximum number of occupants.";["cooking:cooking","visitors:visitors","pets:pets","smoking:smoking","curfew:curfew"].forEach(x=>{const[k,l]=x.split(":");if(!S[k])e[k]="Please choose an option for "+l+"."});
if(S.curfew==="Curfew applies"&&blank("curfewTime"))e.curfewTime="Please enter the curfew time.";if(!S.noise)e.noise="Please select the noise rule.";return e}},
{n:"Availability",r:()=>`<h2>Availability</h2><p class="sub2">The date you submit is recorded automatically. Seekers see it as "Confirmed today" or "Confirmed 3 days ago".</p>
${F("avail","Is the room currently available?",rad("avail",["Yes, available now","No, available from a later date"]))}${F("from","Available from",inp("from","date"))}${F("aunits","Number of units currently available",inp("aunits","number",'min="1" inputmode="numeric"'))}
<div class="warn">You do not pay again to keep your listing live. If the room is taken, you or NestGH can mark it Unavailable.</div>`,
v:()=>{const e={},t=today();if(!S.avail)e.avail="Please say whether the room is currently available.";if(blank("from"))e.from="Please enter the date it is available from.";else if(S.avail&&S.avail.startsWith("Yes")&&S.from>t)e.from="If it is available now, the date cannot be in the future.";else if(S.avail&&S.avail.startsWith("No")&&S.from<=t)e.from="Please choose a future date for when it will be available.";
if(!(n("aunits")>=1))e.aunits="Please enter the number of units currently available.";else if(n("units")>=1&&n("aunits")>n("units"))e.aunits="This cannot be more than the units you entered in step 1 ("+S.units+").";return e}},
{n:"Photos",r:()=>`<h2>Photos</h2><p class="sub2">Upload at least 5 clear photos. One photo for each category below is required.</p><div class="pg">${PHC.map(slot).join("")}</div><div class="fld" data-f="photos"><em class="er"></em></div>
<h3>More photos (optional)</h3><label class="btn2 up">Add more photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-xph></label><div id="xl" style="margin-top:10px">${xl()}</div><small class="sub2">JPG, PNG or WebP. Photos are resized before upload. Use the arrows to reorder extra photos.</small>`,
v:()=>{const e={},miss=PHC.filter(c=>!S.ph[c]);miss.forEach(c=>e["ph_"+c]="Please upload a photo for: "+c+".");if(miss.length)e.photos="Please upload at least 5 photos. Still needed: "+miss.join(", ")+".";return e}},
{n:"Contact",r:()=>`<h2>Owner or caretaker</h2><p class="sub2">Tenants want to know who they are dealing with.</p>
<div class="fld" data-f="profile"><label>Profile photo</label><div class="av">${S.profile?`<img src="${S.profile}" alt="Your profile photo">`:"No photo"}</div><label class="btn2 up">${S.profile?"Replace photo":"Upload a clear photo of your face"}<input type="file" accept="image/jpeg,image/png,image/webp" data-pf></label><small>Your profile photo may be displayed to people viewing this listing so they know who they are contacting.</small><em class="er"></em></div>
${F("name","Full name",inp("name","text",'autocomplete="name"'))}${F("phone","Phone number",inp("phone","tel",'autocomplete="tel" placeholder="e.g. 024 000 0000"'))}
${F("email","Email address",inp("email","email",'autocomplete="email" placeholder="you@example.com"'))}
${F("wa","WhatsApp number",inp("wa","tel",'placeholder="e.g. 024 000 0000"'),'<label class="ch line" style="margin:6px 0 0"><input type="checkbox" data-k="waSame"'+(S.waSame?" checked":"")+'><span>Same as my phone number</span></label>')}
${F("role","Your role",sel("role",ROLES))}${F("rel","Relationship to the property",inp("rel","text",'placeholder="e.g. I own the building, or I manage it for the owner"'))}
<div class="vs"><span>Phone: not verified yet</span><span>Identity: not verified yet</span><span>Property: not verified yet</span></div><small class="sub2">Paying does not make you verified. NestGH only marks Phone, Identity or Property as verified after checking. We never show identity documents publicly.</small>`,
v:()=>{const e={};if(!S.profile)e.profile="Please upload a clear profile photo.";if((S.name||"").trim().length<3)e.name="Please enter your full name.";if(!okPhone(S.phone))e.phone="Please enter a valid Ghana phone number, like 024 000 0000.";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.email||""))e.email="Please enter a valid email address for the payment receipt.";if(!okPhone(S.wa))e.wa="Please enter a valid WhatsApp number.";if(!S.role)e.role="Please select your role.";if((S.rel||"").trim().length<3)e.rel="Please describe your relationship to the property.";return e}},
{n:"Review",r:()=>{const pl=S.period==="Other"?S.periodOther:PL[S.period],t=STEPS,al=[...PHC.map(c=>S.ph[c]),...S.extra.map(x=>x.src)].filter(Boolean);
const fail=S.payMsg?`<div class="warn fail" role="alert">${S.payMsg}</div>`:"";
const feeNotice=S.feeChanged?'<div class="warn" role="status">The listing fee changed while you were preparing this submission. Review the updated amount, then submit again.</div>':"";
return `<h2>Review and pay</h2><p class="sub2">Check everything. This is what seekers will see once NestGH approves your listing.</p>${feeNotice}${fail}
${sec("Room",0,KV({Title:S.title,Type:S.type,Condition:S.cond,Furnished:S.furn,"Units available":S.units,Bedrooms:S.beds,Bathroom:S.bath,Kitchen:S.kit,Size:S.size,Floor:S.floor,Storage:S.store,Balcony:S.balc,...(S.feat?{Features:S.feat}:{})})+`<p class="np">${esc(S.desc)}</p>`)}
${sec("Location",1,KV({Region:S.region,"Town or city":S.town,Area:S.area,"Nearest landmark":S.lm,"Map":S.lat?"Saved from GPS":"Google Maps link"})+`<p class="np">Public: area and landmark only. Your exact address is private to NestGH admin.</p>`)}
${sec("Price and costs",2,bd())}
${sec("What is included",3,tags(INC.map(i=>i+": "+S.m["inc_"+i]).concat(S.m.inc_Other&&S.incOther?[S.incOther+": "+S.m.inc_Other]:[]))+`<p class="np"><b>Not included:</b> ${S.nothingSep?"Nothing. Everything needed is included.":esc(S.notinc)}</p>`)}
${sec("Facilities",4,tags(FAC.map(i=>i+": "+S.m["fac_"+i]).concat(S.facOther?[S.facOther]:[])))}
${sec("Rules",5,KV({"Who can stay":S.who.join(", "),"Max occupants":S.maxOcc,Cooking:S.cooking,Visitors:S.visitors,Pets:S.pets,Smoking:S.smoking,Curfew:S.curfew==="Curfew applies"?"From "+S.curfewTime:"None",Noise:S.noise,...(S.otherRules?{Other:S.otherRules}:{})}))}
${sec("Availability",6,KV({Available:S.avail,"Available from":S.from,"Units available":S.aunits,Confirmed:"Today (recorded automatically when you submit)"}))}
${sec("Photos",7,`<div class="rvp">${al.map(s=>`<img src="${s}" alt="Listing photo">`).join("")}</div>`)}
${sec("Owner or caretaker",8,`<div style="display:flex;gap:12px;align-items:center"><div class="av" style="margin:0;border-style:solid"><img src="${S.profile}" alt="Profile photo"></div><div><b>${esc(S.name)}</b><div class="np" style="margin:0">${esc(S.role)}. ${esc(S.rel)}</div></div></div>`+KV({"Shown to seekers":"Profile photo, name, role, WhatsApp and Call buttons",Phone:S.phone,WhatsApp:S.wa})+`<div class="vs"><span>Phone: not verified yet</span><span>Identity: not verified yet</span><span>Property: not verified yet</span></div>`)}
<div class="warn">CHECK YOUR INFORMATION CAREFULLY</div><div class="fld" data-f="consent"><label class="ch line"><input type="checkbox" data-k="accurate"${S.accurate?" checked":""}><span>I confirm that all information is accurate.</span></label>
${CONS.map((c,i)=>`<label class="ch line"><input type="checkbox" data-cons="${i}"${S.cons[i]?" checked":""}><span>${c}</span></label>`).join("")}<em class="er"></em></div>
<p class="pv2"><b>Privacy notice.</b> NestGH uses what you submit to review and publish your listing, contact you about availability, and prevent fraud. Your profile photo, name, role and contact buttons may be shown on your listing. Your exact address is only seen by NestGH admin, and identity documents are never shown publicly. You can ask to see, correct or delete your information under Ghana's Data Protection Act, 2012 (Act 843). Read our full <a href="#" data-pol="privacy">Privacy Policy</a> , <a href="#" data-pol="cookie">Cookie Policy</a> and <a href="#" data-pol="terms">Terms and Conditions</a>.</p>
<div class="tot"><span>Standard listing (one-time)</span><b>${listingFeePesewas===null?"Unavailable":formatFeePesewas(listingFeePesewas)}</b></div>${listingFeePesewas===null?'<p class="warn" role="alert">The current listing fee could not be loaded. Payment is unavailable until the site reconnects to its settings.</p>':""}<p class="pv2">There is one package only. No renewal fee: your listing stays live while the room is genuinely available. Payment does not approve or verify your listing. NestGH reviews every listing first.</p>`},
v:()=>{const e={};if(!S.accurate||CONS.some((_,i)=>!S.cons[i]))e.consent="Please tick every box to continue.";if(listingFeePesewas===null)e.listingFee="The current listing fee could not be loaded. Please refresh and try again.";return e}}];
function show(e){document.querySelectorAll(".bad").forEach(x=>{x.classList.remove("bad");const m=x.querySelector(".er");m&&(m.textContent="")});let first=null,extra=[];
for(const[k,v]of Object.entries(e)){const el=document.querySelector(`#lb [data-f="${k}"]`);if(!el){extra.push(v);continue}el.classList.add("bad");el.querySelector(".er").textContent=v;first=first||el}
const c=Object.keys(e).length;$("sum").textContent=c?"Please fix "+c+" item"+(c>1?"s":"")+" below."+(extra.length?" "+extra.join(" "):""):"";
if(first){first.scrollIntoView({block:"center"});const i=first.querySelector("input,select,textarea,button");i&&i.focus({preventScroll:true})}else $("sum").scrollIntoView({block:"center"})}
function dyn(){const c=$("cc");if(c){const l=(S.desc||"").trim().length;c.textContent=l+"/100 characters";c.className=l>=100?"ok":""}
const b=$("bd");if(b)b.innerHTML=bd();const po=$("po");if(po)po.hidden=S.period!=="Other";const on=$("on");if(on)on.hidden=!(n("oth")>0);const ct=$("ct");if(ct)ct.hidden=S.curfew!=="Curfew applies"}
function paint(){const L=STEPS.length;$("pb").innerHTML=`<div class="pt">Step ${cur+1} of ${L}: <b>${STEPS[cur].n}</b></div><div class="seg">${STEPS.map((s,i)=>`<i class="${i===cur?"c":i<cur?"d":""}"></i>`).join("")}</div>`;
$("pn").innerHTML=STEPS.map((s,i)=>`<button type="button" data-go="${i}" class="${i===cur?"c":done.has(i)?"d":""}"${i>reach?" disabled":""}${i===cur?' aria-current="step"':""}>${done.has(i)&&i!==cur?"✓ ":""}${s.n}</button>`).join('<span aria-hidden="true">→</span>');
$("bk").hidden=cur===0;$("nx").textContent=cur===L-1?(S.ref?"Retry payment":"Submit & pay"+(listingFeePesewas===null?"":" "+formatFeePesewas(listingFeePesewas))):"Next";const a=$("pn").querySelector(".c");a&&a.scrollIntoView({inline:"center",block:"nearest"})}
function draw(){$("lb").innerHTML='<div class="sum" id="sum" role="alert"></div>'+STEPS[cur].r();paint();dyn()}
function go(i){cur=i;reach=Math.max(reach,i);draw();$("lf").scrollTo(0,0)}
async function next(){if(cur===STEPS.length-1){await submit();return}const e=STEPS[cur].v();if(Object.keys(e).length){done.delete(cur);paint();show(e);return}done.add(cur);go(cur+1)}
async function submit(){const displayedFee=listingFeePesewas;await refreshListingFee();if(listingFeePesewas!==null&&displayedFee!==listingFeePesewas){S.feeChanged=true;draw();return}S.feeChanged=false;draw();for(let i=0;i<STEPS.length;i++){const e=STEPS[i].v();if(Object.keys(e).length){go(i);show(e);if(i<STEPS.length-1)toast("Please fix step "+(i+1)+" ("+STEPS[i].n+") before paying.");return}}await pay()}
async function pay(){
if(!supabaseClient){S.payMsg="Payment is unavailable because Supabase did not load. Please try again later.";return go(cur)}
if(!S.submissionId)S.submissionId=crypto.randomUUID();
$("psheet").innerHTML=`<div class="sp" role="dialog" aria-modal="true" aria-label="Secure payment"><h3 class="sn">Standard listing fee</h3><p class="np">Your listing details will be sent securely for review. Payment is processed by Paystack.</p><div class="tot"><span>One-time listing fee</span><b>${formatFeePesewas(listingFeePesewas)}</b></div><p class="np" role="status">Preparing secure checkout…</p></div>`;
$("psheet").classList.add("on");
updateModalScroll();
try{
const images=[...PHC.map(category=>S.ph[category]),S.profile,...S.extra.map(photo=>photo.src)];
const estimatedBytes=images.reduce((sum,dataUrl)=>sum+Math.ceil((dataUrl.split(",")[1]||"").length*0.75),0);
if(estimatedBytes>4_250_000)throw new Error("The compressed photos are too large to upload together. Remove extra photos or choose smaller images.");
const form=new FormData();
const payload={...S};
delete payload.ph;delete payload.profile;delete payload.extra;delete payload.submissionId;delete payload.payMsg;delete payload.ref;
form.append("submission_id",S.submissionId);
form.append("listing",JSON.stringify(payload));
for(const category of PHC){
  const blob=await (await fetch(S.ph[category])).blob();
  form.append("photo:"+category,blob,category+".jpg");
}
const profile=await (await fetch(S.profile)).blob();
form.append("profile_photo",profile,"profile.jpg");
for(let i=0;i<S.extra.length;i++){
  const blob=await (await fetch(S.extra[i].src)).blob();
  form.append("photo:Extra "+(i+1),blob,"extra-"+(i+1)+".jpg");
}
await beginCheckout(form);
}catch(error){
console.error("Could not start listing payment:",error);
$("psheet").classList.remove("on");updateModalScroll();
S.payMsg=error instanceof Error?error.message:"Secure checkout could not be started.";
go(cur);
toast(S.payMsg);
}}
function reset(){for(const k of Object.keys(S))delete S[k];Object.assign(S,{m:{},ph:{},extra:[],who:[],cons:[]});cur=0;reach=0;done.clear();$("lf").classList.remove("fin","on");updateModalScroll()}
async function openLF(){await requestLocationCatalog();$("lf").classList.add("on");updateModalScroll();go(cur);await refreshListingFee();if(cur===STEPS.length-1)draw()}
function closeLF(){$("lf").classList.remove("on");updateModalScroll()}
const shrink=(f,max,q)=>new Promise((ok,no)=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL("image/jpeg",q))};im.onerror=()=>{URL.revokeObjectURL(u);no("type")};im.src=u});
async function pic(f,max,q){if(!["image/jpeg","image/png","image/webp"].includes(f.type))throw"type";if(f.size>15*1048576)throw"size";return shrink(f,max,q)}
const perr=x=>x==="size"?"That photo is too large. Please use a photo under 15 MB.":"Unsupported file. Please use a JPG, PNG or WebP image.";
function keep(fn){const y=$("lf").scrollTop;fn();draw();$("lf").scrollTop=y}
function upd(e){const t=e.target,d=t.dataset;
if(d.k!==undefined){const k=d.k;S[k]=t.type==="checkbox"?t.checked:t.value;
if(k==="region"){S.town="";const city=$("f_town");if(city)city.value=""}
if(k==="region"||k==="town")populateOwnerTownOptions(k==="town"?t.value:"",S.region||"");
if(k==="phone"&&S.waSame){S.wa=S.phone;const w=$("f_wa");w&&(w.value=S.wa)}
if(k==="waSame"&&t.checked){S.wa=S.phone||"";const w=$("f_wa");w&&(w.value=S.wa)}
if(k==="avail"&&t.value.startsWith("Yes")){S.from=today();const f=$("f_from");f&&(f.value=S.from)}
if(k==="wa"&&S.waSame&&S.wa!==S.phone){S.waSame=false;const c=document.querySelector('[data-k="waSame"]');c&&(c.checked=false)}
if(k==="curfew"||k==="period"||k==="oth")dyn()}
else if(d.c){const a=S[d.c]||(S[d.c]=[]);if(t.checked){if(t.value==="Anyone"){a.length=0;document.querySelectorAll('[data-c="who"]').forEach(x=>{if(x!==t)x.checked=false})}else{const i=a.indexOf("Anyone");if(i>-1){a.splice(i,1);document.querySelector('[data-c="who"][value="Anyone"]').checked=false}}a.push(t.value)}else{const i=a.indexOf(t.value);i>-1&&a.splice(i,1)}}
else if(d.m)S.m[d.m]=t.value;else if(d.cons!==undefined)S.cons[+d.cons]=t.checked;else if(d.xc!==undefined)S.extra[+d.xc].cat=t.value;else return;
const f=t.closest("[data-f]");if(f){f.classList.remove("bad");const m=f.querySelector(".er");m&&(m.textContent="")}dyn()}
const L=$("lf");L.addEventListener("input",upd);
L.addEventListener("change",async e=>{upd(e);const t=e.target,d=t.dataset,fs=[...(t.files||[])];if(!fs.length)return;
try{if(d.ph){S.ph[d.ph]=await pic(fs[0],1000,.68);keep(()=>{})}
else if(d.pf!==undefined){S.profile=await pic(fs[0],512,.75);keep(()=>{})}
else if(d.xph!==undefined){let bad=0;for(const f of fs){if(S.extra.length>=10)break;try{S.extra.push({src:await pic(f,1000,.68),cat:"Other"})}catch(x){bad++}}keep(()=>{});bad&&toast(bad+" file(s) skipped: use JPG, PNG or WebP under 15 MB.")}}
catch(x){t.value="";const k=d.ph?"ph_"+d.ph:"profile";show({[k]:perr(x)})}});
L.addEventListener("click",e=>{const t=e.target.closest("button,a");if(!t)return;const d=t.dataset;
if(d.go!==undefined)go(+d.go);else if(d.rm)keep(()=>delete S.ph[d.rm]);
else if(d.xu!==undefined){const i=+d.xu;i>0&&keep(()=>[S.extra[i-1],S.extra[i]]=[S.extra[i],S.extra[i-1]])}
else if(d.xd!==undefined){const i=+d.xd;i<S.extra.length-1&&keep(()=>[S.extra[i+1],S.extra[i]]=[S.extra[i],S.extra[i+1]])}
else if(d.xr!==undefined)keep(()=>S.extra.splice(+d.xr,1));
else if(t.id==="gps"){if(!navigator.geolocation)return toast("Location is not available. Paste a Google Maps link instead.");navigator.geolocation.getCurrentPosition(p=>{S.lat=p.coords.latitude.toFixed(5);S.lng=p.coords.longitude.toFixed(5);$("mapst").textContent="Location saved: "+S.lat+", "+S.lng;const f=document.querySelector('[data-f="map"]');f.classList.remove("bad");f.querySelector(".er").textContent=""},()=>toast("Could not get your location. Paste a Google Maps link instead."),{enableHighAccuracy:true,timeout:10000})}
else if(t.id==="dn")reset()});
$("bk").onclick=()=>go(cur-1);$("nx").onclick=next;$("lx").onclick=closeLF;
["l1","l2"].forEach(i=>$(i).onclick=openLF);

/* ===== POLICIES ===== */
const POLT={privacy:"Privacy Policy",cookie:"Cookie Policy",terms:"Terms and Conditions"};
function openPol(k){$("pt2").textContent=POLT[k];$("pc").innerHTML=$("t-"+k).innerHTML;$("pol").classList.add("on");$("pol").scrollTo(0,0);updateModalScroll()}
function closePol(){$("pol").classList.remove("on");updateModalScroll()}
document.addEventListener("click",e=>{const a=e.target.closest("[data-pol]");if(a){e.preventDefault();openPol(a.dataset.pol)}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("pol").classList.contains("on"))closePol()});
$("px").onclick=closePol;

/* ===== COOKIE PREFERENCES ===== */
const COOKIE_CONSENT_KEY="nestgh_cookie_consent_v1";
const cookieBanner=$("cookie-banner");
function showCookieBanner(){cookieBanner.hidden=false}
function saveCookieChoice(choice){
try{
localStorage.setItem(COOKIE_CONSENT_KEY,JSON.stringify({choice,updatedAt:new Date().toISOString()}));
cookieBanner.hidden=true;
}catch(e){
toast("Your cookie choice could not be saved. Please check your browser storage settings.");
}}
try{
if(!localStorage.getItem(COOKIE_CONSENT_KEY))showCookieBanner();
}catch(e){
showCookieBanner();
toast("Browser storage is unavailable. Your cookie choice may not be remembered.");
}
$("cookie-accept").onclick=()=>saveCookieChoice("accepted");
$("cookie-reject").onclick=()=>saveCookieChoice("rejected");
$("cookie-settings").onclick=e=>{e.preventDefault();showCookieBanner()};