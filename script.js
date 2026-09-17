```javascript
/* ==========================================
   NAVBAR MOBILE
========================================== */

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) nav.classList.toggle("open");
}


/* ==========================================
   BACK TO TOP
========================================== */

const topButton = document.getElementById("topBtn");

if (topButton) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 400) {
            topButton.classList.add("show");
        } else {
            topButton.classList.remove("show");
        }
    });
}

function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==========================================
   MUSIC PLAYER
========================================== */

const music = document.getElementById("music");
const musicButton = document.getElementById("musicBtn");

function toggleMusic() {
    if (!music || !musicButton) return;

    if (music.paused) {
        music.play()
            .then(() => {
                musicButton.innerHTML = "⏸";
                musicButton.title = "Jeda Musik";
            })
            .catch(() => {
                alert("Tambahkan file background-music.mp3 ke folder assets/music/");
            });
    } else {
        music.pause();
        musicButton.innerHTML = "🎵";
        musicButton.title = "Putar Musik Desa";
    }
}


/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {
        observer.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.classList.add("show");
    });
}


/* ==========================================
   GALLERY LIGHTBOX
========================================== */

function openLightbox(element) {
    const image = element.querySelector("img");
    if (!image) return;

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    if (!lightbox || !lightboxImage) return;

    if (image.style.display === "none") {
        return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");

    if (!lightbox) return;

    lightbox.classList.remove("open");
    document.body.style.overflow = "";
}

const lightbox = document.getElementById("lightbox");

if (lightbox) {
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeLightbox();
    }
});


/* ==========================================
   GOOGLE SHEETS
========================================== */

const GOOGLE_SHEET_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxYn4u9IOmK3fUSUPNH5LeRiwdhAIK-44AcpdQZTF7e-bpcQ3STaO8NteJmwxKV49gaiCkW2jqblxW/pub?gid=1958031429&output=csv";


/* ==========================================
   FORM ADUAN MASYARAKAT
========================================== */

const ADUAN_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby6NWDnRcx2SOE0mcCR3Pi8gWwrRxHRt5i14RWdFziNppDfuwJFDrk9p8gjwaG1-muC/exec";

const aduanForm = document.getElementById("aduanForm");

if (aduanForm) {
    aduanForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nama = document.getElementById("nama")?.value.trim() || "";
        const kategori = document.getElementById("kategori")?.value || "";
        const judul = document.getElementById("judul")?.value.trim() || "";
        const isi = document.getElementById("isi_aduan")?.value.trim() || "";

        if (!nama || !kategori || !judul || !isi) {
            alert("Mohon lengkapi semua data aduan.");
            return;
        }

        const id = "ADUAN-" + Date.now();

        const data = {
            action: "submit",
            id: id,
            nama: nama,
            kategori: kategori,
            judul: judul,
            isi_aduan: isi
        };

        try {
            const response = await fetch(ADUAN_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === "success") {
                alert("Aduan berhasil dikirim. Terima kasih!");
                aduanForm.reset();
            } else {
                alert("Aduan gagal dikirim: " + result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat mengirim aduan.");
        }
    });
}


/* ==========================================
   ADMIN
========================================== */

const ADMIN_PIN = "123456";

function loginAdmin() {
    const pinInput = document.getElementById("adminPin");
    const message = document.getElementById("loginMessage");
    const loginBox = document.getElementById("adminLogin");
    const panel = document.getElementById("adminPanel");

    if (!pinInput || !loginBox || !panel) return;

    if (pinInput.value === ADMIN_PIN) {
        loginBox.style.display = "none";
        panel.style.display = "block";

        loadAdminComplaints();
    } else {
        if (message) {
            message.textContent = "PIN admin salah.";
        }
    }
}

async function loadAdminComplaints() {
    const list = document.getElementById("complaintList");
    const status = document.getElementById("adminStatus");

    if (!list) return;

    list.innerHTML = "";
    if (status) status.textContent = "Memuat aduan...";

    try {
        const response = await fetch(GOOGLE_SHEET_CSV);
        const csv = await response.text();

        const rows = parseCSV(csv);

        if (!rows.length) {
            if (status) status.textContent = "Belum ada aduan.";
            return;
        }

        const headers = rows[0].map(h =>
            h.trim().toLowerCase()
        );

        const dataRows = rows.slice(1);

        const complaints = dataRows.map(row => {
            const obj = {};

            headers.forEach((header, index) => {
                obj[header] = row[index] || "";
            });

            return obj;
        });

        if (!complaints.length) {
            if (status) status.textContent = "Belum ada aduan.";
            return;
        }

        if (status) {
            status.textContent =
                complaints.length + " aduan ditemukan.";
        }

        complaints.reverse().forEach(function (item) {
            const card = document.createElement("div");
            card.className = "complaint-card";

            card.innerHTML = `
                <div class="complaint-header">
                    <strong>${escapeHTML(item.judul || "Tanpa Judul")}</strong>
                    <span>${escapeHTML(item.status || "Menunggu")}</span>
                </div>

                <p><b>Nama:</b> ${escapeHTML(item.nama || "-")}</p>
                <p><b>Kategori:</b> ${escapeHTML(item.kategori || "-")}</p>
                <p>${escapeHTML(item.isi_aduan || "-")}</p>

                <textarea
                    class="answer-input"
                    data-id="${escapeHTML(item.id || "")}"
                    placeholder="Tulis jawaban admin..."
                >${escapeHTML(item.jawaban || "")}</textarea>

                <button
                    class="btn green answer-btn"
                    onclick="answerComplaint(this)"
                    data-id="${escapeHTML(item.id || "")}"
                >
                    Kirim Jawaban
                </button>
            `;

            list.appendChild(card);
        });

    } catch (error) {
        console.error(error);

        if (status) {
            status.textContent =
                "Gagal mengambil data aduan.";
        }
    }
}

async function answerComplaint(button) {
    const id = button.dataset.id;

    const textarea =
        document.querySelector(
            `.answer-input[data-id="${CSS.escape(id)}"]`
        );

    if (!textarea) return;

    const jawaban = textarea.value.trim();

    if (!jawaban) {
        alert("Tulis jawaban terlebih dahulu.");
        return;
    }

    button.disabled = true;
    button.textContent = "Menyimpan...";

    try {
        const response = await fetch(
            ADUAN_SCRIPT_URL,
            {
                method: "POST",
                body: JSON.stringify({
                    action: "answer",
                    id: id,
                    jawaban: jawaban,
                    status: "Dijawab"
                })
            }
        );

        const result = await response.json();

        if (result.status === "success") {
            alert("Jawaban berhasil disimpan.");
            loadAdminComplaints();
        } else {
            alert("Gagal menyimpan jawaban: " + result.message);
        }

    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat menyimpan jawaban.");
    } finally {
        button.disabled = false;
        button.textContent = "Kirim Jawaban";
    }
}


/* ==========================================
   CSV PARSER
========================================== */

function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"') {
            if (quoted && next === '"') {
                cell += '"';
                i++;
            } else {
                quoted = !quoted;
            }
        } else if (char === "," && !quoted) {
            row.push(cell);
            cell = "";
        } else if ((char === "\n" || char === "\r") && !quoted) {
            if (char === "\r" && next === "\n") {
                i++;
            }

            row.push(cell);
            cell = "";

            if (row.some(value => value !== "")) {
                rows.push(row);
            }

            row = [];
        } else {
            cell += char;
        }
    }

    if (cell !== "" || row.length) {
        row.push(cell);

        if (row.some(value => value !== "")) {
            rows.push(row);
        }
    }

    return rows;
}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

**Penting:** PIN admin di kode ini adalah `123456`.

Setelah ditempel: **Save → commit/push → refresh website.**
Kalau halaman sudah balik muncul, **berhenti dulu di situ**. Jangan ubah Google Sheet atau link apa pun lagi.
