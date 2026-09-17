/* ==========================================
   NAVBAR MOBILE
========================================== */

function toggleMenu() {

    const nav =
        document.getElementById("navLinks");

    nav.classList.toggle("open");

}


/* ==========================================
   BACK TO TOP
========================================== */

const topButton =
    document.getElementById("topBtn");


window.addEventListener("scroll", function () {

    if (window.scrollY > 400) {

        topButton.classList.add("show");

    } else {

        topButton.classList.remove("show");

    }

});


function backToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ==========================================
   MUSIC PLAYER
========================================== */

const music =
    document.getElementById("music");

const musicButton =
    document.getElementById("musicBtn");


function toggleMusic() {

    if (!music) return;


    if (music.paused) {

        music.play()
        .then(() => {

            musicButton.innerHTML = "⏸";

            musicButton.title =
                "Jeda Musik";

        })

        .catch(() => {

            alert(
                "Tambahkan file background-music.mp3 ke folder assets/music/"
            );

        });

    }

    else {

        music.pause();

        musicButton.innerHTML =
            "🎵";

        musicButton.title =
            "Putar Musik Desa";

    }

}


/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "show"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },

        {
            threshold: .12
        }

    );


revealElements.forEach(
    function (element) {

        observer.observe(element);

    }
);


/* ==========================================
   GALLERY LIGHTBOX
========================================== */

function openLightbox(element) {

    const image =
        element.querySelector("img");

    if (!image) return;

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    if (
        image.style.display === "none"
    ) {

        return;

    }


    lightboxImage.src =
        image.src;

    lightboxImage.alt =
        image.alt;


    lightbox.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


function closeLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    if (!lightbox) return;


    lightbox.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


/* Klik area gelap untuk menutup */

const lightbox =
    document.getElementById(
        "lightbox"
    );


if (lightbox) {

    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* Keyboard Escape */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeLightbox();

        }

    }
);
/* ==========================================
   GOOGLE SHEETS
========================================== */

const GOOGLE_SHEET_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxYn4u9IOmK3fUSUPNH5LeRiwdhAIK-44AcpdQZTF7e-bpcQ3STaO8NteJmwxKV49gaiCkW2jqblxW/pub?output=csv";

async function loadGoogleSheetData() {

    try {

        const response =
            await fetch(GOOGLE_SHEET_CSV);

        if (!response.ok) {
            throw new Error(
                "Gagal mengambil data Google Sheets"
            );
        }

        const csvText =
            await response.text();

        console.log(
            "Google Sheets berhasil terhubung!"
        );

        console.log(
            "Data:",
            csvText
        );

        window.desaSepaduData =
            csvText;

    } catch (error) {

        console.error(
            "Google Sheets tidak dapat diakses:",
            error
        );

    }

}

loadGoogleSheetData();
/* ==========================================
   FORM ADUAN MASYARAKAT
========================================== */

const ADUAN_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyaEUWP2AjJHV2jFZeaCqpYRF77l6EC0xz2wTS2Wm6NL8_oAXQQWGAUZBUm0Huf_9An/exec";

const aduanForm = document.getElementById("aduanForm");
const aduanMessage = document.getElementById("aduanMessage");

if (aduanForm) {
    aduanForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton =
            aduanForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Mengirim...";

        const formData = new FormData(aduanForm);

        const data = {
            action: "submit",
            id: "ADUAN-" + Date.now(),
            nama: formData.get("nama"),
            kategori: formData.get("kategori"),
            judul: formData.get("judul"),
            isi_aduan: formData.get("isi_aduan")
        };

        try {
            const response = await fetch(ADUAN_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === "success") {
                aduanMessage.textContent =
                    "Aduan berhasil dikirim. Terima kasih atas masukannya!";

                aduanMessage.style.color = "green";

                aduanForm.reset();
            } else {
                throw new Error("Pengiriman gagal");
            }

        } catch (error) {
            aduanMessage.textContent =
                "Aduan gagal dikirim. Silakan coba lagi.";

            aduanMessage.style.color = "red";

            console.error("Error:", error);

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Kirim Aduan →";
        }
    });
}


/* ==========================================
   ADMIN ADUAN
========================================== */
const ADMIN_PIN = "123456"; // Ganti PIN ini untuk proyekmu.

function loginAdmin() {
    const pin = document.getElementById("adminPin");
    const msg = document.getElementById("loginMessage");
    if (!pin) return;
    if (pin.value === ADMIN_PIN) {
        sessionStorage.setItem("desaAdminLogin", "true");
        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadAdminComplaints();
    } else {
        msg.textContent = "PIN admin salah.";
        msg.style.color = "#b94a48";
    }
}

function parseCSV(text) {
    const rows=[]; let row=[]; let cell=""; let quoted=false;
    for(let i=0;i<text.length;i++){ const c=text[i], n=text[i+1];
        if(c==='"'){ if(quoted && n==='"'){cell+='"'; i++;} else quoted=!quoted; }
        else if(c===',' && !quoted){row.push(cell);cell="";}
        else if((c==='\
'||c==='\\r')&&!quoted){ if(c==='\\r'&&n==='\
') i++; row.push(cell);cell=""; if(row.some(v=>v!=='')) rows.push(row); row=[];}
        else cell+=c;
    }
    if(cell!==''||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row);}
    if(!rows.length)return[];
    const headers=rows[0].map(h=>h.trim().toLowerCase());
    return rows.slice(1).map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||'').trim()])));
}

function getField(o, names){ for(const n of names){ if(o[n]!==undefined) return o[n]; } return ""; }

async function loadAdminComplaints(){
    const list=document.getElementById("complaintList"), status=document.getElementById("adminStatus");
    if(!list)return;
    list.innerHTML='<div class="aduan-card">Memuat data aduan...</div>';
    try{
        const response=await fetch(GOOGLE_SHEET_CSV + "&t=" + Date.now());
        if(!response.ok) throw new Error();
        const data=parseCSV(await response.text());
        window.adminComplaints=data;
        renderComplaints(data);
        status.textContent=data.length ? `Menampilkan ${data.length} aduan.` : "Belum ada aduan.";
    }catch(e){
        list.innerHTML='<div class="aduan-card">Data Google Sheets belum dapat dimuat. Pastikan sheet dipublikasikan sebagai CSV.</div>';
        status.textContent="Gagal memuat data.";
    }
}

function renderComplaints(data){
    const list=document.getElementById("complaintList");
    if(!data.length){list.innerHTML='<div class="aduan-card"><h3>Belum ada aduan</h3><p>Aduan dari masyarakat akan muncul di sini.</p></div>';return;}
    const replies=JSON.parse(localStorage.getItem("desaReplies")||"{}");
    list.innerHTML=data.map((d,i)=>{
        const id=getField(d,["id","id aduan"])||`ROW-${i}`;
        const answer=getField(d,["jawaban","jawaban admin"])||replies[id]||"";
        const status=getField(d,["status"])||(answer?"Dijawab":"Menunggu");
        return `<article class="complaint-card"><div class="complaint-head"><div><span class="complaint-id">${escapeHTML(id)}</span><h3>${escapeHTML(getField(d,["judul","judul aduan"])||"Tanpa judul")}</h3></div><span class="complaint-status ${answer?'answered':'pending'}">${escapeHTML(status)}</span></div><p><strong>Nama:</strong> ${escapeHTML(getField(d,["nama"]))}</p><p><strong>Kategori:</strong> ${escapeHTML(getField(d,["kategori"]))}</p><p>${escapeHTML(getField(d,["isi_aduan","isi aduan","isi"]))}</p><textarea id="reply-${i}" placeholder="Tulis jawaban admin...">${escapeHTML(answer)}</textarea><div class="complaint-actions"><button class="btn green" onclick="sendReply(${i}, '${escapeJS(id)}')">Kirim Jawaban →</button><span id="reply-msg-${i}"></span></div></article>`;
    }).join("");
}

async function sendReply(index,id){
    const d=(window.adminComplaints||[])[index];
    const box=document.getElementById(`reply-${index}`), msg=document.getElementById(`reply-msg-${index}`);
    const answer=box.value.trim(); if(!answer){msg.textContent="Tulis jawaban dulu ya.";msg.style.color="#b94a48";return;}
    msg.textContent="Mengirim..."; msg.style.color="#637568";
    localStorage.setItem("desaReplies",JSON.stringify({...JSON.parse(localStorage.getItem("desaReplies")||"{}"),[id]:answer}));
    try{
        const response=await fetch(ADUAN_SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"answer",id,jawaban:answer,status:"Dijawab"})});
        const result=await response.json().catch(()=>({}));
        if(result.status && result.status!=="success") throw new Error();
        msg.textContent="Jawaban tersimpan."; msg.style.color="#315b45";
        loadAdminComplaints();
    }catch(e){
        msg.textContent="Jawaban disimpan di browser ini. Untuk tersimpan di Google Sheets, perbarui Apps Script dengan Code.gs yang disertakan."; msg.style.color="#9a6b18";
    }
}

function escapeHTML(value){return String(value??"").replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeJS(value){return String(value??"").replace(/\\/g,'\\\\').replace(/'/g,"\\'");}

document.addEventListener("DOMContentLoaded",()=>{
    if(document.getElementById("adminPanel") && sessionStorage.getItem("desaAdminLogin")==="true"){
        document.getElementById("adminLogin").style.display="none";
        document.getElementById("adminPanel").style.display="block";
        loadAdminComplaints();
    }
});
