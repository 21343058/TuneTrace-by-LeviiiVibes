// Fungsi untuk menambahkan class 'bold-text' pada input saat diubah
function inputChange() {
  var input = document.getElementById("searchInput");
  input.classList.add("bold-text"); // Menambahkan class 'bold-text' saat input diubah
}

// Fungsi untuk memicu pencarian musik saat tombol 'Enter' ditekan
function searchOnEnter(event) {
  if (event.key === "Enter") {
    searchMusic();
  }
}

// Fungsi untuk melakukan pencarian musik
function searchMusic() {
  // Fungsi pencarian musik
}
const clientId = "acd391309b554bfe977f514ab221f0f9";
const clientSecret = "805eaca7b5ce46eeb22c9d78d12e227a";
const redirectUri = "http://localhost:3036"; // Redirect URI kamu yang disetel di Dashboard Spotify

// Fungsi untuk melakukan pencarian musik dengan memanfaatkan API Spotify
async function searchMusic() {
  const query = document.getElementById("searchInput").value;
  const token = await getToken(); // Mendapatkan token otorisasi

  if (token) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${query}&type=track`; // URL API untuk melakukan pencarian lagu
    const headers = {
      Authorization: `Bearer ${token}`, // Menggunakan token untuk otorisasi
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers,
      });

      const data = await response.json(); // Mendapatkan data hasil pencarian
      displayResults(data.tracks.items); // Menampilkan hasil pencarian lagu
    } catch (error) {
      console.error("Error:", error); // Menampilkan pesan error jika terjadi kesalahan
    }
  }
}

// Fungsi untuk mendapatkan token dari Spotify menggunakan metode autentikasi client credentials
async function getToken() {
  const url = "https://accounts.spotify.com/api/token"; // URL untuk mendapatkan token
  const body = "grant_type=client_credentials"; // Jenis autentikasi yang digunakan
  const headers = {
    Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`, // Menggunakan clientId dan clientSecret untuk autentikasi
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await response.json(); // Mendapatkan data token dari response
    return data.access_token; // Mengembalikan access token
  } catch (error) {
    console.error("Error:", error); // Menampilkan pesan error jika terjadi kesalahan
    return null;
  }
}

function displayResults(tracks) {
  const resultsDiv = document.getElementById("results"); // Mendapatkan elemen div hasil pencarian
  resultsDiv.innerHTML = ""; // Mengosongkan isi elemen div

  tracks.forEach((track) => {
    // Loop melalui setiap lagu dalam hasil pencarian
    const trackInfo = document.createElement("div"); // Membuat elemen div untuk informasi lagu
    const trackName = document.createElement("p"); // Membuat elemen paragraf untuk nama lagu
    const artistName = document.createElement("p"); // Membuat elemen paragraf untuk nama artis
    const hr = document.createElement("hr"); // Membuat elemen garis horizontal sebagai pemisah
    const trackLink = document.createElement("a"); // Membuat elemen anchor untuk tautan lagu
    const albumImage = document.createElement("img"); // Membuat elemen gambar untuk cover album
    const audioPreview = document.createElement("audio"); // Membuat elemen audio untuk preview lagu
    const addToFavoritesBtn = document.createElement("button"); // Membuat tombol untuk menambahkan lagu ke favorit

    albumImage.src = track.album.images[0].url; // Mengatur sumber gambar dari cover album
    albumImage.alt = "Cover Album"; // Mengatur atribut alt untuk gambar
    albumImage.style.width = "150px"; // Mengatur lebar gambar
    albumImage.style.height = "150px"; // Mengatur tinggi gambar

    audioPreview.controls = true; // Menampilkan kontrol audio
    audioPreview.src = track.preview_url; // Mengatur sumber audio dari preview lagu
    audioPreview.style.marginTop = "10px"; // Mengatur margin atas untuk elemen audio

    trackLink.href = track.external_urls.spotify; // Mengatur tautan lagu ke Spotify
    trackLink.target = "_blank"; // Membuka tautan lagu di tab baru
    trackLink.appendChild(albumImage); // Menambahkan gambar album ke tautan lagu

    trackInfo.appendChild(trackLink); // Menambahkan tautan lagu ke informasi lagu
    trackInfo.appendChild(audioPreview); // Menambahkan elemen audio ke informasi lagu

    addToFavoritesBtn.textContent = "Add to Favorite"; // Mengatur teks tombol
    addToFavoritesBtn.addEventListener("click", () => {
      // Menambahkan event listener untuk tombol favorit
      addToFavorites(track); // Menambahkan lagu ke favorit saat tombol diklik
    });
    trackInfo.appendChild(addToFavoritesBtn); // Menambahkan tombol ke informasi lagu

    trackName.innerHTML = `<strong>Lagu:</strong> ${track.name}`; // Menambahkan informasi nama lagu
    artistName.innerHTML = `<strong>Artis:</strong> ${track.artists[0].name}`; // Menambahkan informasi nama artis

    trackInfo.appendChild(trackName); // Menambahkan nama lagu ke informasi lagu
    trackInfo.appendChild(artistName); // Menambahkan nama artis ke informasi lagu
    trackInfo.appendChild(hr); // Menambahkan garis pemisah ke informasi lagu

    resultsDiv.appendChild(trackInfo); // Menambahkan informasi lagu ke dalam div hasil pencarian
  });
}

async function addToFavorites(track) {
  const { name, artists, preview_url, external_urls, album } = track; // Mendestrukturisasi data lagu

  const data = {
    name, // Menyimpan nama lagu dalam objek data
    artist: artists[0].name, // Menyimpan nama artis pertama dalam objek data
    previewUrl: preview_url, // Menyimpan URL preview lagu dalam objek data
    externalUrl: external_urls.spotify, // Menyimpan URL eksternal Spotify lagu dalam objek data
    imageUrl: album.images[0].url, // Menyimpan URL gambar album pertama dalam objek data
  };

  try {
    const response = await fetch("/add-to-favorites", {
      // Mengirim permintaan POST ke server untuk menambahkan lagu ke favorit
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Menetapkan tipe konten sebagai JSON
      },
      body: JSON.stringify(data), // Mengirim data dalam format JSON ke server
    });

    if (response.ok) {
      // Jika respons dari server adalah sukses (status code 200s)
      // Tampilkan pop-up notifikasi jika lagu berhasil ditambahkan ke favorit
      showNotification("Song added to favorites!");
    } else {
      // Tampilkan pop-up notifikasi jika gagal menambahkan lagu ke favorit
      showNotification("Failed to add song to favorites");
    }
  } catch (error) {
    console.error("Error:", error); // Tangani kesalahan jika terjadi error saat mengirim permintaan
    // Tampilkan pop-up notifikasi jika terjadi kesalahan saat menambahkan lagu ke favorit
    showNotification("An error occurred while adding to favorites");
  }
}

// Fungsi untuk menampilkan notifikasi dengan pesan yang diberikan
function showNotification(message) {
  const notification = document.createElement("div"); // Membuat elemen div untuk notifikasi
  notification.classList.add("notification"); // Menambahkan kelas 'notification' ke elemen div
  notification.innerHTML = `
    <p>${message}</p> <!-- Menambahkan pesan notifikasi ke dalam elemen div -->
    <button onclick="closeNotification()">OK</button> <!-- Menambahkan tombol 'OK' dengan event listener untuk menutup notifikasi -->
  `;

  document.body.appendChild(notification); // Menambahkan elemen notifikasi ke dalam body dokumen
}

// Fungsi untuk menutup notifikasi dengan menghapus elemen notifikasi dari DOM
function closeNotification() {
  const notification = document.querySelector(".notification"); // Memilih elemen notifikasi
  notification.remove(); // Menghapus elemen notifikasi dari tampilan
}
