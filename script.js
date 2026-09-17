/* ==========================================
NAVBAR MOBILE
========================================== */

function toggleMenu() {
const nav = document.getElementById("navLinks");
if (nav) {
nav.classList.toggle("open");
}
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
                "File musik belum dapat diputar."
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

const revealElements =
document.querySelectorAll(".reveal");

const observer =
new IntersectionObserver(
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
    document.getElementById("lightboxImage");

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

const lightbox =
    document.getElementById("lightbox");

if (!lightbox) return;

lightbox.classList.remove("open");

document.body.style.overflow = "";

}

/* Klik area gelap untuk menutup */

const lightbox =
document.getElementById("lightbox");

if (lightbox) {

lightbox.addEventListener(
    "click",
    function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    }
);

}

/* Keyboard Escape */

document.addEventListener(
"keydown",
function (event) {

    if (event.key === "Escape") {
        closeLightbox();
    }

}

);

/* ==========================================
GOOGLE SHEETS LAMA
Tetap dipertahankan untuk bagian website
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

    window.desaSepaduData = csvText;

} catch (error) {

    console.error(
        "Google Sheets tidak dapat diakses:",
        error
    );

}

}

loadGoogleSheetData();

/* ==========================================
GOOGLE APPS SCRIPT ADUAN
========================================== */

const ADUAN_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyaEUWP2AjJHV2jFZeaCqpYRF77l6EC0xz2wTS2Wm6NL8_oAXQQWGAUZBUm0Huf_9An/exec";

/* ==========================================
FORM ADUAN MASYARAKAT
========================================== */

const aduanForm =
document.getElementById("aduanForm");

const aduanMessage =
document.getElementById("aduanMessage");

if (aduanForm) {

aduanForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const submitButton =
            aduanForm.querySelector(
                "button[type='submit']"
            );

        submitButton.disabled = true;
        submitButton.textContent = "Mengirim...";

        const formData =
            new FormData(aduanForm);

        const data = {

            action: "submit",

            id: "ADUAN-" + Date.now(),

            nama: formData.get("nama"),

            kategori: formData.get("kategori"),

            judul: formData.get("judul"),

            isi_aduan:
                formData.get("isi_aduan")

        };

        try {

            const response =
                await fetch(
                    ADUAN_SCRIPT_URL,
                    {
                        method: "POST",
                        body: JSON.stringify(data)
                    }
                );

            const result =
                await response.json();

            if (result.status === "success") {

                aduanMessage.textContent =
                    "Aduan berhasil dikirim. Terima kasih atas masukannya!";

                aduanMessage.style.color =
                    "green";

                aduanForm.reset();

            } else {

                throw new Error(
                    result.message ||
                    "Pengiriman gagal"
                );

            }

        } catch (error) {

            aduanMessage.textContent =
                "Aduan gagal dikirim. Silakan coba lagi.";

            aduanMessage.style.color =
                "red";

            console.error(
                "Error:",
                error
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Kirim Aduan →";

        }

    }
);

}

/* ==========================================
ADMIN ADUAN
========================================== */

const ADMIN_PIN = "123456";

/* LOGIN ADMIN */

function loginAdmin() {

const pin =
    document.getElementById("adminPin");

const msg =
    document.getElementById("loginMessage");

if (!pin) return;

if (pin.value === ADMIN_PIN) {

    sessionStorage.setItem(
        "desaAdminLogin",
        "true"
    );

    const login =
        document.getElementById("adminLogin");

    const panel =
        document.getElementById("adminPanel");

    if (login) {
        login.style.display = "none";
    }

    if (panel) {
        panel.style.display = "block";
    }

    loadAdminComplaints();

} else {

    if (msg) {

        msg.textContent =
            "PIN admin salah.";

        msg.style.color =
            "#b94a48";

    }

}

}

/* LOGOUT ADMIN */

function logoutAdmin() {

sessionStorage.removeItem(
    "desaAdminLogin"
);

const login =
    document.getElementById("adminLogin");

const panel =
    document.getElementById("adminPanel");

const pin =
    document.getElementById("adminPin");

if (panel) {
    panel.style.display = "none";
}

if (login) {
    login.style.display = "block";
}

if (pin) {
    pin.value = "";
}

}

/* ==========================================
AMBIL DATA ADUAN DARI APPS SCRIPT
========================================== */

async function loadAdminComplaints() {

const list =
    document.getElementById(
        "complaintList"
    );

const status =
    document.getElementById(
        "adminStatus"
    );

if (!list) return;

list.innerHTML =
    '<div class="aduan-card">Memuat data aduan...</div>';

try {

    const response =
        await fetch(
            ADUAN_SCRIPT_URL +
            "?t=" +
            Date.now()
        );

    if (!response.ok) {
        throw new Error(
            "Gagal mengambil data dari server"
        );
    }

    const data =
        await response.json();

    if (!Array.isArray(data)) {

        throw new Error(
            data.message ||
            "Format data tidak valid"
        );

    }

    window.adminComplaints =
        data;

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
        `
        <div class="aduan-card">
            <h3>Gagal memuat data</h3>
            <p>
                Data aduan belum dapat diambil
                dari server.
            </p>
        </div>
        `;

    if (status) {
        status.textContent =
            "Gagal memuat data.";
    }

}

}

/* ==========================================
TAMPILKAN ADUAN
========================================== */

function renderComplaints(data) {

const list =
    document.getElementById(
        "complaintList"
    );

if (!list) return;

if (!data.length) {

    list.innerHTML =
        `
        <div class="aduan-card">
            <h3>Belum ada aduan</h3>
            <p>
                Aduan dari masyarakat
                akan muncul di sini.
            </p>
        </div>
        `;

    return;

}

const replies =
    JSON.parse(
        localStorage.getItem(
            "desaReplies"
        ) || "{}"
    );

list.innerHTML =
    data.map(function (d, i) {

        const id =
            getField(
                d,
                ["id", "id aduan"]
            ) ||
            `ROW-${i}`;

        const answer =
            getField(
                d,
                ["jawaban", "jawaban admin"]
            ) ||
            replies[id] ||
            "";

        const status =
            getField(
                d,
                ["status"]
            ) ||
            (answer
                ? "Dijawab"
                : "Menunggu");

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
                                [
                                    "judul",
                                    "judul aduan"
                                ]
                            ) ||
                            "Tanpa judul"
                        )}
                    </h3>

                </div>

                <span class="complaint-status ${
                    answer
                        ? "answered"
                        : "pending"
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
                <strong>Isi Aduan:</strong><br>
                ${escapeHTML(
                    getField(
                        d,
                        [
                            "isi_aduan",
                            "isi aduan",
                            "isi"
                        ]
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
                    onclick="sendReply(
                        ${i},
                        '${escapeJS(id)}'
                    )"
                >
                    Kirim Jawaban →
                </button>

                <span id="reply-msg-${i}">
                </span>

            </div>

        </article>
        `;

    }).join("");

}

/* ==========================================
KIRIM TANGGAPAN ADMIN
========================================== */

async function sendReply(index, id) {

const box =
    document.getElementById(
        `reply-${index}`
    );

const msg =
    document.getElementById(
        `reply-msg-${index}`
    );

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


/* Simpan cadangan di browser */

const oldReplies =
    JSON.parse(
        localStorage.getItem(
            "desaReplies"
        ) || "{}"
    );

oldReplies[id] =
    answer;

localStorage.setItem(
    "desaReplies",
    JSON.stringify(oldReplies)
);


try {

    const response =
        await fetch(
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
        await response.json();

    if (
        result.status !==
        "success"
    ) {

        throw new Error(
            result.message ||
            "Jawaban gagal disimpan"
        );

    }

    msg.textContent =
        "Jawaban berhasil disimpan.";

    msg.style.color =
        "#315b45";

    /* Muat ulang data */

    setTimeout(
        function () {
            loadAdminComplaints();
        },
        500
    );

} catch (error) {

    console.error(
        "Gagal mengirim jawaban:",
        error
    );

    msg.textContent =
        "Jawaban gagal disimpan ke server.";

    msg.style.color =
        "#b94a48";

}

}

/* ==========================================
HELPER
========================================== */

function getField(object, names) {

for (const name of names) {

    if (
        object[name] !== undefined &&
        object[name] !== null
    ) {

        return object[name];

    }

}

return "";

}

function escapeHTML(value) {

return String(
    value ?? ""
).replace(
    /[&<>'"]/g,
    function (char) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"

        }[char];

    }
);

}

function escapeJS(value) {

return String(
    value ?? ""
)
    .replace(
        /\\/g,
        "\\\\"
    )
    .replace(
        /'/g,
        "\\'"
    );

}

/* ==========================================
CEK LOGIN ADMIN SAAT HALAMAN DIBUKA
========================================== */

document.addEventListener(
"DOMContentLoaded",
function () {

    const adminPanel =
        document.getElementById(
            "adminPanel"
        );

    if (
        adminPanel &&
        sessionStorage.getItem(
            "desaAdminLogin"
        ) === "true"
    ) {

        const adminLogin =
            document.getElementById(
                "adminLogin"
            );

        if (adminLogin) {
            adminLogin.style.display =
                "none";
        }

        adminPanel.style.display =
            "block";

        loadAdminComplaints();

    }

}

);
