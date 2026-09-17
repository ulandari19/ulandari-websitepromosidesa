// =====================================================
// KONFIGURASI
// =====================================================

const ADUAN_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyaEUWP2AjJHV2jFZeaCqpYRF77l6EC0xz2wTS2Wm6NL8_oAXQQWGAUZBUm0Huf_9An/exec";


// =====================================================
// NAVBAR MOBILE
// =====================================================

function toggleMenu() {
    const navMenu = document.querySelector(".nav-menu");

    if (navMenu) {
        navMenu.classList.toggle("active");
    }
}


// =====================================================
// BACK TO TOP
// =====================================================

const backToTop = document.getElementById("backToTop");

if (backToTop) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// =====================================================
// MUSIK
// =====================================================

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

if (music && musicButton) {
    musicButton.addEventListener("click", function () {
        if (music.paused) {
            music.play();
            musicButton.textContent = "⏸";
        } else {
            music.pause();
            musicButton.textContent = "▶";
        }
    });
}


// =====================================================
// ANIMASI REVEAL
// =====================================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});


// =====================================================
// LIGHTBOX GALERI
// =====================================================

const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

galleryImages.forEach(function (image) {
    image.addEventListener("click", function () {
        if (lightbox && lightboxImage) {
            lightboxImage.src = image.src;
            lightbox.classList.add("active");
        }
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener("click", function () {
        lightbox.classList.remove("active");
    });
}

if (lightbox) {
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            lightbox.classList.remove("active");
        }
    });
}


// =====================================================
// FORM ADUAN MASYARAKAT
// =====================================================

const aduanForm = document.getElementById("aduanForm");
const aduanMessage = document.getElementById("aduanMessage");

if (aduanForm) {
    aduanForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const kategori = document.getElementById("kategori").value;
        const judul = document.getElementById("judul").value.trim();
        const isiAduan = document.getElementById("isi_aduan").value.trim();

        const submitButton = aduanForm.querySelector("button[type='submit']");

        const token = "ADUAN-" + Date.now();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Mengirim...";
        }

        if (aduanMessage) {
            aduanMessage.textContent = "Aduan sedang dikirim...";
            aduanMessage.style.color = "#555";
        }

        try {
            await fetch(ADUAN_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    action: "submit",
                    id: token,
                    nama: nama,
                    kategori: kategori,
                    judul: judul,
                    isi_aduan: isiAduan
                })
            });

            aduanForm.reset();

            if (aduanMessage) {
                aduanMessage.textContent =
                    "Aduan berhasil dikirim. Terima kasih sudah menyampaikan laporan.";
                aduanMessage.style.color = "green";
            }

            const tokenBox = document.getElementById("aduanTokenBox");
            const tokenText = document.getElementById("aduanToken");

            if (tokenBox && tokenText) {
                tokenText.textContent = token;
                tokenBox.style.display = "block";
            }

        } catch (error) {
            console.error("Gagal mengirim aduan:", error);

            if (aduanMessage) {
                aduanMessage.textContent =
                    "Aduan gagal dikirim. Silakan coba lagi.";
                aduanMessage.style.color = "red";
            }
        }

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Kirim Aduan";
        }
    });
}


// =====================================================
// CEK STATUS ADUAN DENGAN TOKEN
// =====================================================

const cekAduanForm = document.getElementById("cekAduanForm");
const cekAduanMessage = document.getElementById("cekAduanMessage");
const cekAduanResult = document.getElementById("cekAduanResult");

if (cekAduanForm) {
    cekAduanForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const tokenInput = document.getElementById("cekToken");
        const token = tokenInput.value.trim();

        const submitButton = cekAduanForm.querySelector(
            "button[type='submit']"
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Mengecek...";
        }

        if (cekAduanMessage) {
            cekAduanMessage.textContent = "Sedang mengecek pengaduan...";
            cekAduanMessage.style.color = "#555";
        }

        if (cekAduanResult) {
            cekAduanResult.style.display = "none";
        }

        try {
            const response = await fetch(ADUAN_SCRIPT_URL);
            const data = await response.json();

            const aduan = data.find(function (item) {
                return String(item.id).trim() === token;
            });

            if (!aduan) {
                if (cekAduanMessage) {
                    cekAduanMessage.textContent =
                        "Token pengaduan tidak ditemukan.";
                    cekAduanMessage.style.color = "red";
                }

                return;
            }

            const status = aduan.status || "Menunggu";
            const jawaban = aduan.jawaban || "Belum ada jawaban dari admin.";

            if (cekAduanMessage) {
                cekAduanMessage.textContent =
                    "Data pengaduan berhasil ditemukan.";
                cekAduanMessage.style.color = "green";
            }

            if (cekAduanResult) {
                cekAduanResult.innerHTML = `
                    <h3>Hasil Pengaduan</h3>
                    <p><strong>ID Pengaduan:</strong> ${escapeHTML(aduan.id)}</p>
                    <p><strong>Nama:</strong> ${escapeHTML(aduan.nama)}</p>
                    <p><strong>Kategori:</strong> ${escapeHTML(aduan.kategori)}</p>
                    <p><strong>Judul:</strong> ${escapeHTML(aduan.judul)}</p>
                    <p><strong>Status:</strong> 
                        <strong>${escapeHTML(status)}</strong>
                    </p>
                    <p><strong>Jawaban Admin:</strong><br>
                        ${escapeHTML(jawaban)}
                    </p>
                `;

                cekAduanResult.style.display = "block";
            }

        } catch (error) {
            console.error("Gagal mengecek aduan:", error);

            if (cekAduanMessage) {
                cekAduanMessage.textContent =
                    "Terjadi kesalahan saat mengecek pengaduan.";
                cekAduanMessage.style.color = "red";
            }
        }

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Cek Pengaduan →";
        }
    });
}


// =====================================================
// LOGIN ADMIN
// =====================================================

const adminLogin = document.getElementById("adminLogin");
const adminPanel = document.getElementById("adminPanel");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginMessage = document.getElementById("adminLoginMessage");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const pinInput = document.getElementById("adminPin");
        const pin = pinInput.value.trim();

        if (pin === "123456") {
            sessionStorage.setItem("desaAdminLogin", "true");

            if (adminLogin) {
                adminLogin.style.display = "none";
            }

            if (adminPanel) {
                adminPanel.style.display = "block";
            }

            loadComplaints();
        } else {
            if (adminLoginMessage) {
                adminLoginMessage.textContent = "PIN admin salah.";
                adminLoginMessage.style.color = "red";
            }
        }
    });
}


// =====================================================
// LOGOUT ADMIN
// =====================================================

function logoutAdmin() {
    sessionStorage.removeItem("desaAdminLogin");
    window.location.reload();
}


// =====================================================
// MEMUAT DATA ADUAN ADMIN
// =====================================================

async function loadComplaints() {
    const complaintList = document.getElementById("complaintList");
    const adminStatus = document.getElementById("adminStatus");

    if (!complaintList) {
        return;
    }

    complaintList.innerHTML = "Memuat data aduan...";

    try {
        const response = await fetch(ADUAN_SCRIPT_URL);
        const data = await response.json();

        if (!data || data.length === 0) {
            complaintList.innerHTML = "<p>Belum ada aduan.</p>";
            return;
        }

        complaintList.innerHTML = "";

        data.forEach(function (item) {
            const card = document.createElement("div");
            card.className = "complaint-card";

            card.innerHTML = `
                <h3>${escapeHTML(item.judul || "Tanpa Judul")}</h3>

                <p>
                    <strong>ID:</strong>
                    ${escapeHTML(item.id || "-")}
                </p>

                <p>
                    <strong>Nama:</strong>
                    ${escapeHTML(item.nama || "-")}
                </p>

                <p>
                    <strong>Kategori:</strong>
                    ${escapeHTML(item.kategori || "-")}
                </p>

                <p>
                    <strong>Isi Aduan:</strong><br>
                    ${escapeHTML(item.isi_aduan || "-")}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(item.status || "Menunggu")}
                </p>

                <p>
                    <strong>Jawaban:</strong><br>
                    ${escapeHTML(item.jawaban || "Belum ada jawaban")}
                </p>

                <textarea
                    class="reply-input"
                    id="reply-${escapeHTML(item.id)}"
                    placeholder="Tulis jawaban admin..."
                ></textarea>

                <button
                    class="btn green"
                    onclick="sendReply('${escapeJS(item.id)}')"
                >
                    Kirim Jawaban
                </button>
            `;

            complaintList.appendChild(card);
        });

        if (adminStatus) {
            adminStatus.textContent = "Data aduan berhasil dimuat.";
            adminStatus.style.color = "green";
        }

    } catch (error) {
        console.error("Gagal memuat aduan:", error);
        complaintList.innerHTML =
            "<p>Gagal memuat data aduan.</p>";
    }
}


// =====================================================
// KIRIM JAWABAN ADMIN
// =====================================================

async function sendReply(id) {
    const replyInput = document.getElementById("reply-" + id);

    if (!replyInput) {
        return;
    }

    const jawaban = replyInput.value.trim();

    if (!jawaban) {
        alert("Jawaban tidak boleh kosong.");
        return;
    }

    try {
        await fetch(ADUAN_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "answer",
                id: id,
                jawaban: jawaban,
                status: "Selesai"
            })
        });

        alert("Jawaban berhasil dikirim.");
        loadComplaints();

    } catch (error) {
        console.error("Gagal mengirim jawaban:", error);
        alert("Jawaban gagal dikirim.");
    }
}


// =====================================================
// KEAMANAN TAMPILAN HTML
// =====================================================

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJS(value) {
    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');
}


// =====================================================
// CEK LOGIN ADMIN SAAT HALAMAN DIBUKA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    const isAdminLoggedIn =
        sessionStorage.getItem("desaAdminLogin") === "true";

    const adminLogin = document.getElementById("adminLogin");
    const adminPanel = document.getElementById("adminPanel");

    if (isAdminLoggedIn && adminPanel) {
        if (adminLogin) {
            adminLogin.style.display = "none";
        }

        adminPanel.style.display = "block";
        loadComplaints();
    }
});
