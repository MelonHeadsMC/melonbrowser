// Pixel background
const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const pixels = Array.from({length:150}, () => ({
  x: Math.random()*width,
  y: Math.random()*height,
  size: Math.random()*3+2,
  speed: Math.random()*2+1
}));

function animate() {
  ctx.clearRect(0,0,width,height);
  pixels.forEach(p => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
    p.y += p.speed;
    if(p.y > height){
      p.y = -p.size;
      p.x = Math.random()*width;
    }
  });
  requestAnimationFrame(animate);
}
animate();

// Open URL in about:blank
function openWebsiteInNewTab(url, title="Inbox (10)", favicon="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico") {
  const newTab = window.open("about:blank", "_blank");
  if(!newTab){ alert("Popup blocked!"); return; }

  newTab.document.title = title;
  const link = newTab.document.createElement("link");
  link.rel = "icon";
  link.href = favicon;
  newTab.document.head.appendChild(link);

  newTab.document.body.style.margin = "0";
  newTab.document.body.style.padding = "0";
  newTab.document.body.style.overflow = "hidden";

  const obj = newTab.document.createElement("object");
  obj.data = url;
  obj.style.width = "100%";
  obj.style.height = "100vh";
  obj.style.border = "none";
  newTab.document.body.appendChild(obj);
}

// Search bar
function handleKeyPress(event){
  if(event.key==='Enter') document.getElementById("openNewTabButton").click();
}

document.getElementById("openNewTabButton").addEventListener("click", ()=>{
  let originalURL = document.getElementById("search").value.trim();
  let favicon;
  if(!originalURL.startsWith("https://") && !originalURL.startsWith("http://")){
    originalURL = "https://www.google.com/search?igu=1&q="+encodeURIComponent(originalURL);
    favicon = "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico";
  } else favicon = "https://th.bing.com/th/id/R.9c9e32f43441e347a3f028c79019564b?rik=R360mttE%2fu6vbQ&pid=ImgRaw&r=0";

  openWebsiteInNewTab(originalURL,"MelonBrowser",favicon);
  document.getElementById("suggestions").innerHTML='';
});

// Custom buttons
const customLinks = ["https://example.com","https://example.org","https://example.net"];
const customButtons = [
  document.getElementById("customBtn1"),
  document.getElementById("customBtn2"),
  document.getElementById("customBtn3")
];

customButtons.forEach((btn, idx)=>{
  btn.addEventListener("click", ()=>{
    const pageTitle = btn.textContent || `Custom ${idx+1}`;
    openWebsiteInNewTab(customLinks[idx], pageTitle);
  });
});

// Settings
const customInputs = [
  document.getElementById("customLink1"),
  document.getElementById("customLink2"),
  document.getElementById("customLink3")
];
const customNameInputs = [
  document.getElementById("customName1"),
  document.getElementById("customName2"),
  document.getElementById("customName3")
];
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const antiCloseToggle = document.getElementById("antiCloseToggle");

// Load saved settings
if(localStorage.getItem("antiClose")) antiCloseToggle.checked = localStorage.getItem("antiClose")==="true";

customInputs.forEach((input, idx)=>{
  const saved = localStorage.getItem(`customLink${idx+1}`);
  if(saved){ input.value = saved; customLinks[idx] = saved; }
});

customNameInputs.forEach((input, idx)=>{
  const saved = localStorage.getItem(`customName${idx+1}`);
  if(saved){ input.value = saved; customButtons[idx].textContent = saved; }
});

// Panel toggle
settingsBtn.addEventListener("click", ()=>{
  settingsPanel.classList.toggle("open");
});

closeSettingsBtn.addEventListener("click", ()=>{
  settingsPanel.classList.remove("open");
});

// Save settings
saveSettingsBtn.addEventListener("click", ()=>{
  localStorage.setItem("antiClose",antiCloseToggle.checked);

  customInputs.forEach((input,idx)=>{
    customLinks[idx] = input.value.trim();
    localStorage.setItem(`customLink${idx+1}`,customLinks[idx]);
  });

  customNameInputs.forEach((input,idx)=>{
    const name = input.value.trim() || `Custom ${idx+1}`;
    customButtons[idx].textContent = name;
    localStorage.setItem(`customName${idx+1}`,name);
  });

  alert("Settings saved!");
});

// Anti-close
window.onbeforeunload = function(e){
  if(antiCloseToggle.checked){
    const msg = "You have unsaved changes, are you sure you want to leave?";
    e.returnValue = msg;
    return msg;
  }
};

// Google Suggestions
function showSuggestions(value){
  const suggestionsDiv = document.getElementById("suggestions");
  suggestionsDiv.innerHTML = '';
  if(!value) return;

  const script = document.createElement("script");
  const callbackName = "jsonpCallback_"+Math.random().toString(36).substr(2,5);

  window[callbackName] = function(data){
    delete window[callbackName];
    document.body.removeChild(script);
    const results = data[1].slice(0,3);
    results.forEach(s=>{
      const div = document.createElement("div");
      div.textContent = s;
      div.addEventListener("click", ()=>{
        document.getElementById("search").value = s;
        suggestionsDiv.innerHTML = '';
        document.getElementById("openNewTabButton").click();
      });
      suggestionsDiv.appendChild(div);
    });
  };

  script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(value)}&callback=${callbackName}`;
  document.body.appendChild(script);
}

// Auto-open MelonBrowser
window.addEventListener("load", ()=>{
  const autoWindow = window.open("about:blank","_blank");
  if(autoWindow){
    const pageHTML = document.documentElement.outerHTML;
    autoWindow.document.open();
    autoWindow.document.write(pageHTML);
    autoWindow.document.close();

    autoWindow.document.title = "MelonBrowser";
    const faviconLink = autoWindow.document.createElement("link");
    faviconLink.rel = "icon";
    faviconLink.href = "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico";
    autoWindow.document.head.appendChild(faviconLink);
  } else alert("Popup blocked! Allow popups to run MelonBrowser.");
});
