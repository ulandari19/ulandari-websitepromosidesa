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
    "https://script.google.com/macros/s/AKfycbxQGTtlA0txwEflQAk2Vi3h_0DBiH1olcjEwlQmdZ-HZQLQUlSy12pbigGKZckxtC3C/exec";

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
