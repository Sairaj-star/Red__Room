let adminToken = sessionStorage.getItem("redroom_admin");
const login = document.getElementById("login"), dashboard = document.getElementById("dashboard");
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showDashboard(){login.classList.add("hidden");dashboard.classList.remove("hidden");load();}
async function api(url, options={}) {
  const r = await fetch(url,{...options,headers:{"Content-Type":"application/json","x-admin-token":adminToken,...(options.headers||{})}});
  const d = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(d.error||"Request failed");
  return d;
}
async function doLogin(){
  try {
    const d=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:document.getElementById("password").value})});
    const j=await d.json(); if(!d.ok) throw new Error(j.error);
    adminToken=j.token; sessionStorage.setItem("redroom_admin",adminToken); showDashboard();
  } catch(e){document.getElementById("loginError").textContent=e.message;}
}
async function load(){
  try {
    const d=await api("/api/admin/rooms");
    document.getElementById("stats").innerHTML=[
      ["Active rooms",d.overview.activeRooms],["Connected users",d.overview.connectedUsers],["Messages",d.overview.totalMessages],["Locked rooms",d.overview.lockedRooms],["Created today",d.overview.roomsCreatedToday]
    ].map(x=>`<div class="stat"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join("");
    document.getElementById("updated").textContent="Updated "+new Date().toLocaleTimeString();
    const el=document.getElementById("rooms");
    if(!d.rooms.length){el.innerHTML='<div style="padding:30px;color:#666">No active rooms.</div>';return;}
    el.innerHTML=d.rooms.map(r=>`<div class="room-row">
      <div><b>${esc(r.id)}</b><small>Master: ${esc(r.masterName)}</small></div>
      <div>${r.participants.length} online</div><div>${r.messageCount}</div>
      <div>${new Date(r.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</div>
      <div class="room-status ${r.locked?"locked":""}">${r.locked?"Locked":"Open"}</div>
      <div class="row-actions"><button onclick="viewRoom('${esc(r.id)}')">View</button><button onclick="roomAction('${esc(r.id)}','${r.locked?"unlock":"lock"}')">${r.locked?"Unlock":"Lock"}</button><button onclick="roomAction('${esc(r.id)}','delete')">Delete</button></div>
    </div>`).join("");
  } catch(e){ if(e.message==="Unauthorized"){sessionStorage.removeItem("redroom_admin");location.reload();} }
}
async function roomAction(id,action){
  if(action==="delete"&&!confirm("Delete this room? Everyone will be disconnected.")) return;
  try{await api(`/api/admin/rooms/${encodeURIComponent(id)}/action`,{method:"POST",body:JSON.stringify({action})});load();}catch(e){alert(e.message);}
}
async function viewRoom(id){
  try{
    const r=await api(`/api/admin/rooms/${encodeURIComponent(id)}`);
    document.getElementById("roomDetail").innerHTML=`<div class="detail-head"><div><div class="eyebrow">MONITORED ROOM</div><h2>${esc(r.id)}</h2></div><span class="pill">${r.locked?"LOCKED":"OPEN"}</span></div>
    <div class="detail-grid"><div class="detail-box"><small>MASTER</small>${esc(r.masterName)}</div><div class="detail-box"><small>CREATED</small>${new Date(r.createdAt).toLocaleString()}</div><div class="detail-box"><small>PARTICIPANTS</small>${r.participants.map(p=>esc(p.name)).join(", ")||"None"}</div><div class="detail-box"><small>MESSAGES</small>${r.messageCount}</div></div>
    <h3>Chat history</h3><div>${r.messages.map(m=>`<div class="admin-message"><span>${new Date(m.timestamp).toLocaleTimeString()}</span><b>${m.type==="system"?"SYSTEM":esc(m.name)}</b> ${esc(m.text)}</div>`).join("")||'<p style="color:#666">No messages yet.</p>'}</div>`;
    document.getElementById("roomModal").classList.remove("hidden");
  }catch(e){alert(e.message)}
}
document.getElementById("loginBtn").onclick=doLogin;
document.getElementById("password").onkeydown=e=>{if(e.key==="Enter")doLogin()};
document.getElementById("refresh").onclick=load;
document.getElementById("logout").onclick=async()=>{try{await api("/api/admin/logout",{method:"POST"})}finally{sessionStorage.removeItem("redroom_admin");location.reload()}};
document.getElementById("closeRoom").onclick=()=>document.getElementById("roomModal").classList.add("hidden");
if(adminToken)showDashboard();
