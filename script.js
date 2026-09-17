
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

window.addEventListener("scroll", function () {
    if (!topButton) return;

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

const music = document.getElementById("music");
const musicButton = document.getElementById("musicBtn");

function toggleMusic() {
    if (!music) return;

    if (music.paused) {
        music.play()
            .then(() => {
                if (musicButton) {
                    musicButton.innerHTML = "⏸";
                    musicButton.title = "Jeda Musik";
                }
            })
            .catch(() => {
                alert(
                    "Tambahkan file background-music.mp3 ke folder assets/music/"
                );
            });
    } else {
        music.pause();

        if (musicButton) {
            musicButton.innerHTML = "🎵";
            musicButton.title = "Putar Musik Desa";
        }
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

const ADMIN_PIN = "123456";


function loginAdmin() {
    const pin = document.getElementById("adminPin");
    const msg = document.getElementById("loginMessage");
    const loginBox = document.getElementById("adminLogin");
    const panel = document.getElementById("adminPanel");

    if (!pin) return;

    if (pin.value === ADMIN_PIN) {

        sessionStorage.setItem("desaAdminLogin", "true");

        if (loginBox) {
            loginBox.style.display = "none";
        }

        if (panel) {
            panel.style.display = "block";
        }

        loadAdminComplaints();

    } else {

        if (msg) {
            msg.textContent = "PIN admin salah.";
            msg.style.color = "#b94a48";
        }

    }
}


/* ==========================================
   PARSE CSV
========================================== */

function parseCSV(text) {

    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {

        const c = text[i];
        const n = text[i + 1];

        if (c === '"') {

            if (quoted && n === '"') {
                cell += '"';
                i++;
            } else {
                quoted = !quoted;
            }

        } else if (c === "," && !quoted) {

            row.push(cell);
            cell = "";

        } else if ((c === "\n" || c === "\r") && !quoted) {

            if (c === "\r" && n === "\n") {
                i++;
            }

            row.push(cell);
            cell = "";

            if (row.some(v => v !== "")) {
                rows.push(row);
            }

            row = [];

        } else {

            cell += c;

        }
    }

    if (cell !== "" || row.length) {

        row.push(cell);

        if (row.some(v => v !== "")) {
            rows.push(row);
        }
    }

    if (!rows.length) {
        return [];
    }

    const headers =
        rows[0].map(h => h.trim().toLowerCase());

    return rows.slice(1).map(r => {

        return Object.fromEntries(
            headers.map((h, i) => [
                h,
                (r[i] || "").trim()
            ])
        );

    });
}


/* ==========================================
   GET FIELD
========================================== */

function getField(object, names) {

    for (const name of names) {

        if (object[name] !== undefined) {
            return object[name];
        }

    }

    return "";
}


/* ==========================================
   LOAD ADMIN COMPLAINTS
========================================== */

async function loadAdminComplaints() {

    const list =
        document.getElementById("complaintList");

    const status =
        document.getElementById("adminStatus");

    if (!list) return;

    list.innerHTML =
        '<div class="aduan-card">Memuat data aduan...</div>';

    try {

        const response = await fetch(
            GOOGLE_SHEET_CSV + "&t=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Gagal mengambil Google Sheets");
        }

        const csvText =
            await response.text();

        const data =
            parseCSV(csvText);

        window.adminComplaints = data;

        renderComplaints(data);

        if (status) {

            status.textContent =
                data.length
                    ? `Menampilkan ${data.length} aduan.`
                    : "Belum ada aduan.";

        }

    } catch (error) {

        console.error(
            "Gagal memuat aduan:",
            error
        );

        list.innerHTML =
            '<div class="aduan-card">' +
            '<h3>Data aduan belum dapat dimuat</h3>' +
            '<p>Pastikan Google Sheets sudah dipublikasikan.</p>' +
            '</div>';

        if (status) {
            status.textContent =
                "Gagal memuat data.";
        }

    }
}


/* ==========================================
   RENDER COMPLAINTS
========================================== */

function renderComplaints(data) {

    const list =
        document.getElementById("complaintList");

    if (!list) return;

    if (!data.length) {

        list.innerHTML =
            '<div class="aduan-card">' +
            '<h3>Belum ada aduan</h3>' +
            '<p>Aduan dari masyarakat akan muncul di sini.</p>' +
            '</div>';

        return;
    }

    const replies =
        JSON.parse(
            localStorage.getItem("desaReplies") || "{}"
        );

    list.innerHTML =
        data.map((d, i) => {

            const id =
                getField(d, ["id", "id aduan"]) ||
                `ROW-${i}`;

            const answer =
                getField(
                    d,
                    ["jawaban", "jawaban admin"]
                ) ||
                replies[id] ||
                "";

            const status =
                getField(d, ["status"]) ||
                (answer ? "Dijawab" : "Menunggu");

            return `
                <article class="complaint-card">

                    <div class="complaint-head">

                        <div>

                            <span class="complaint-id">
                                ${escapeHTML(id)}
                            </span>

                            <h3>
                                ${escapeHTML(
                                    getField(
                                        d,
                                        ["judul", "judul aduan"]
                                    ) || "Tanpa judul"
                                )}
                            </h3>

                        </div>

                        <span class="complaint-status ${
                            answer ? "answered" : "pending"
                        }">

                            ${escapeHTML(status)}

                        </span>

                    </div>

                    <p>
                        <strong>Nama:</strong>
                        ${escapeHTML(
                            getField(d, ["nama"])
                        )}
                    </p>

                    <p>
                        <strong>Kategori:</strong>
                        ${escapeHTML(
                            getField(d, ["kategori"])
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            getField(
                                d,
                                ["isi_aduan", "isi aduan", "isi"]
                            )
                        )}
                    </p>

                    <textarea
                        id="reply-${i}"
                        placeholder="Tulis jawaban admin..."
                    >${escapeHTML(answer)}</textarea>

                    <div class="complaint-actions">

                        <button
                            class="btn green"
                            onclick="sendReply(${i}, '${escapeJS(id)}')"
                        >
                            Kirim Jawaban →
                        </button>

                        <span id="reply-msg-${i}"></span>

                    </div>

                </article>
            `;

        }).join("");
}


/* ==========================================
   SEND REPLY
========================================== */

async function sendReply(index, id) {

    const box =
        document.getElementById(`reply-${index}`);

    const msg =
        document.getElementById(`reply-msg-${index}`);

    if (!box || !msg) return;

    const answer =
        box.value.trim();

    if (!answer) {

        msg.textContent =
            "Tulis jawaban dulu ya.";

        msg.style.color =
            "#b94a48";

        return;
    }

    msg.textContent =
        "Mengirim...";

    msg.style.color =
        "#637568";

    const replies =
        JSON.parse(
            localStorage.getItem("desaReplies") || "{}"
        );

    replies[id] = answer;

    localStorage.setItem(
        "desaReplies",
        JSON.stringify(replies)
    );

    try {

        const response = await fetch(
            ADUAN_SCRIPT_URL,
            {
                method: "POST",
                body: JSON.stringify({
                    action: "answer",
                    id: id,
                    jawaban: answer,
                    status: "Dijawab"
                })
            }
        );

        const result =
            await response.json().catch(() => ({}));

        if (
            result.status &&
            result.status !== "success"
        ) {
            throw new Error(
                result.message || "Gagal menyimpan"
            );
        }

        msg.textContent =
            "Jawaban tersimpan.";

        msg.style.color =
            "#315b45";

        loadAdminComplaints();

    } catch (error) {

        console.error(
            "Gagal mengirim jawaban:",
            error
        );

        msg.textContent =
            "Jawaban tersimpan di browser ini.";

        msg.style.color =
            "#9a6b18";
    }
}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /[&<>'"]/g,
            function (c) {

                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;"
                }[c];

            }
        );
}


function escapeJS(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


/* ==========================================
   AUTO LOGIN
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const panel =
            document.getElementById("adminPanel");

        const loginBox =
            document.getElementById("adminLogin");

        if (
            panel &&
            sessionStorage.getItem("desaAdminLogin") === "true"
        ) {

            if (loginBox) {
                loginBox.style.display = "none";
            }

            panel.style.display = "block";

            loadAdminComplaints();
        }

    }
);
```

**Setelah ditempel:**

1. `Ctrl + S`
2. Buka `admin.html`
3. `Ctrl + Shift + R` untuk refresh penuh
4. Masukkan PIN **123456**

Terus lihat hasilnya. **Kalau masih kosong, jangan ubah apa-apa lagi—bilang aku apa yang muncul di halaman Admin.**
