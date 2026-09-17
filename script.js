// =====================================================
// KONFIGURASI
// =====================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbyaEUWP2AjJHV2jFZeaCqpYRF77l6EC0xz2wTS2Wm6NL8_oAXQQWGAUZBUm0Huf_9An/exec";


// =====================================================
// MENU NAVBAR
// =====================================================

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");

  if (navLinks) {
    navLinks.classList.toggle("active");
  }
}


// =====================================================
// TUTUP MENU SETELAH LINK DIKLIK
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.getElementById("navLinks");

  if (navLinks) {
    const menuItems = navLinks.querySelectorAll("a");

    menuItems.forEach(function (item) {
      item.addEventListener("click", function () {
        navLinks.classList.remove("active");
      });
    });
  }
});


// =====================================================
// ANIMASI REVEAL
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  const revealElements = document.querySelectorAll(".reveal");

  revealElements.forEach(function (element) {
    element.classList.add("show");
  });
});


// =====================================================
// TOMBOL KEMBALI KE ATAS
// =====================================================

window.addEventListener("scroll", function () {
  const topButton = document.getElementById("topBtn");

  if (!topButton) return;

  if (window.scrollY > 300) {
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


// =====================================================
// MUSIK WEBSITE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");

  if (!music || !musicBtn) return;

  let musicPlaying = false;

  musicBtn.addEventListener("click", function () {
    if (musicPlaying) {
      music.pause();
      musicBtn.textContent = "🔇";
      musicPlaying = false;
    } else {
      music.play()
        .then(function () {
          musicBtn.textContent = "🔊";
          musicPlaying = true;
        })
        .catch(function () {
          alert("Musik belum dapat diputar. Silakan klik tombol musik lagi.");
        });
    }
  });
});


// =====================================================
// FORM ADUAN MASYARAKAT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  const aduanForm = document.getElementById("aduanForm");
  const aduanMessage = document.getElementById("aduanMessage");

  if (!aduanForm) return;

  aduanForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = aduanForm.querySelector(
      "button[type='submit']"
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Mengirim...";
    }

    if (aduanMessage) {
      aduanMessage.textContent = "";
    }

    const formData = new FormData(aduanForm);

    const data = {
      action: "submit",
      nama: formData.get("nama"),
      kategori: formData.get("kategori"),
      judul: formData.get("judul"),
      isi_aduan: formData.get("isi_aduan")
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        aduanForm.reset();

        if (aduanMessage) {
          aduanMessage.textContent =
            "Aduan berhasil dikirim. Simpan token Anda untuk mengecek status aduan.";
          aduanMessage.style.color = "green";
        }

        if (result.id) {
          alert(
            "Aduan berhasil dikirim.\nToken aduan Anda: " +
            result.id
          );
        }
      } else {
        throw new Error(
          result.message || "Aduan gagal dikirim."
        );
      }
    } catch (error) {
      console.error("Error:", error);

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
});


// =====================================================
// CEK STATUS ADUAN
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  const statusForm = document.getElementById("statusForm");
  const statusResult = document.getElementById("statusResult");

  if (!statusForm) return;

  statusForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const tokenInput = document.getElementById("token");

    if (!tokenInput) return;

    const token = tokenInput.value.trim();

    if (!token) {
      if (statusResult) {
        statusResult.textContent =
          "Silakan masukkan token aduan.";
        statusResult.style.color = "red";
      }

      return;
    }

    if (statusResult) {
      statusResult.textContent = "Memeriksa status...";
      statusResult.style.color = "#315b45";
    }

    try {
      const response = await fetch(
        API_URL + "?id=" + encodeURIComponent(token)
      );

      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;

        if (statusResult) {
          statusResult.innerHTML = `
            <div class="status-card">
              <p><strong>ID Aduan:</strong> ${data.id || "-"}</p>
              <p><strong>Nama:</strong> ${data.nama || "-"}</p>
              <p><strong>Kategori:</strong> ${data.kategori || "-"}</p>
              <p><strong>Judul:</strong> ${data.judul || "-"}</p>
              <p><strong>Status:</strong> ${data.status || "Menunggu"}</p>
              <p><strong>Jawaban:</strong> ${
                data.jawaban || "Belum ada jawaban dari admin."
              }</p>
            </div>
          `;

          statusResult.style.color = "#24402b";
        }
      } else {
        if (statusResult) {
          statusResult.textContent =
            "Token tidak ditemukan. Periksa kembali token Anda.";
          statusResult.style.color = "red";
        }
      }
    } catch (error) {
      console.error("Error:", error);

      if (statusResult) {
        statusResult.textContent =
          "Gagal mengecek status. Silakan coba lagi.";
        statusResult.style.color = "red";
      }
    }
  });
});


// =====================================================
// LOGIN ADMIN
// =====================================================

function loginAdmin() {
  const adminLogin = document.getElementById("adminLogin");
  const adminPanel = document.getElementById("adminPanel");
  const adminPin = document.getElementById("adminPin");
  const loginMessage = document.getElementById("loginMessage");

  if (!adminPin) {
    console.error("Input adminPin tidak ditemukan.");
    return;
  }

  const pin = adminPin.value.trim();

  // PIN ADMIN
  if (pin === "123456") {
    sessionStorage.setItem("desaAdminLogin", "true");

    if (adminLogin) {
      adminLogin.style.display = "none";
    }

    if (adminPanel) {
      adminPanel.style.display = "block";
    }

    if (loginMessage) {
      loginMessage.textContent = "";
    }

    loadAdminComplaints();
  } else {
    if (loginMessage) {
      loginMessage.textContent = "PIN admin salah.";
      loginMessage.style.color = "red";
    }
  }
}


// =====================================================
// CEK LOGIN ADMIN SAAT HALAMAN DIBUKA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  const adminLogin = document.getElementById("adminLogin");
  const adminPanel = document.getElementById("adminPanel");

  if (!adminLogin || !adminPanel) return;

  const isLoggedIn =
    sessionStorage.getItem("desaAdminLogin") === "true";

  if (isLoggedIn) {
    adminLogin.style.display = "none";
    adminPanel.style.display = "block";

    loadAdminComplaints();
  } else {
    adminLogin.style.display = "block";
    adminPanel.style.display = "none";
  }
});


// =====================================================
// LOGOUT ADMIN
// =====================================================

function logoutAdmin() {
  sessionStorage.removeItem("desaAdminLogin");

  const adminLogin = document.getElementById("adminLogin");
  const adminPanel = document.getElementById("adminPanel");

  if (adminLogin) {
    adminLogin.style.display = "block";
  }

  if (adminPanel) {
    adminPanel.style.display = "none";
  }
}


// =====================================================
// MENAMPILKAN DATA ADUAN DI HALAMAN ADMIN
// =====================================================

async function loadAdminComplaints() {
  const complaintList = document.getElementById("complaintList");
  const adminStatus = document.getElementById("adminStatus");

  if (!complaintList) return;

  complaintList.innerHTML = "Memuat data aduan...";

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!result.success || !result.data) {
      complaintList.innerHTML = "Belum ada data aduan.";
      return;
    }

    const complaints = result.data;

    if (complaints.length === 0) {
      complaintList.innerHTML = "Belum ada aduan masuk.";
      return;
    }

    complaintList.innerHTML = "";

    complaints.forEach(function (item) {
      const complaintCard = document.createElement("div");

      complaintCard.className = "complaint-card";

      complaintCard.innerHTML = `
        <h3>${item.judul || "Tanpa judul"}</h3>

        <p><strong>ID:</strong> ${item.id || "-"}</p>
        <p><strong>Nama:</strong> ${item.nama || "-"}</p>
        <p><strong>Kategori:</strong> ${item.kategori || "-"}</p>
        <p><strong>Isi Aduan:</strong> ${
          item.isi_aduan || "-"
        }</p>
        <p><strong>Status:</strong> ${
          item.status || "Menunggu"
        }</p>
        <p><strong>Jawaban:</strong> ${
          item.jawaban || "Belum ada jawaban"
        }</p>

        <div class="admin-answer">
          <select id="status-${item.id}">
            <option value="Menunggu" ${
              item.status === "Menunggu" ? "selected" : ""
            }>
              Menunggu
            </option>

            <option value="Diproses" ${
              item.status === "Diproses" ? "selected" : ""
            }>
              Diproses
            </option>

            <option value="Selesai" ${
              item.status === "Selesai" ? "selected" : ""
            }>
              Selesai
            </option>
          </select>

          <textarea
            id="answer-${item.id}"
            placeholder="Tulis jawaban admin..."
          >${item.jawaban || ""}</textarea>

          <button
            class="btn green"
            onclick="answerComplaint('${item.id}')"
          >
            Simpan Jawaban
          </button>
        </div>
      `;

      complaintList.appendChild(complaintCard);
    });

    if (adminStatus) {
      adminStatus.textContent =
        "Data aduan berhasil dimuat.";
      adminStatus.style.color = "green";
    }
  } catch (error) {
    console.error("Error:", error);

    complaintList.innerHTML =
      "Gagal memuat data aduan. Periksa koneksi atau Apps Script.";

    if (adminStatus) {
      adminStatus.textContent =
        "Terjadi kesalahan saat memuat data.";
      adminStatus.style.color = "red";
    }
  }
}


// =====================================================
// ALIAS UNTUK FUNGSI LAMA
// =====================================================

function loadComplaints() {
  loadAdminComplaints();
}


// =====================================================
// MENJAWAB ADUAN ADMIN
// =====================================================

async function answerComplaint(id) {
  const statusInput = document.getElementById(
    "status-" + id
  );

  const answerInput = document.getElementById(
    "answer-" + id
  );

  const adminStatus = document.getElementById("adminStatus");

  if (!statusInput || !answerInput) return;

  const status = statusInput.value;
  const jawaban = answerInput.value.trim();

  if (!jawaban) {
    alert("Silakan isi jawaban terlebih dahulu.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "answer",
        id: id,
        status: status,
        jawaban: jawaban
      })
    });

    const result = await response.json();

    if (result.success) {
      if (adminStatus) {
        adminStatus.textContent =
          "Jawaban berhasil disimpan.";
        adminStatus.style.color = "green";
      }

      loadAdminComplaints();
    } else {
      throw new Error(
        result.message || "Jawaban gagal disimpan."
      );
    }
  } catch (error) {
    console.error("Error:", error);

    if (adminStatus) {
      adminStatus.textContent =
        "Jawaban gagal disimpan.";
      adminStatus.style.color = "red";
    }
  }
}
