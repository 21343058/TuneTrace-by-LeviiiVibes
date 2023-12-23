// Ketika halaman telah dimuat sepenuhnya
window.onload = async function () {
  try {
    // Mengirim permintaan untuk mendapatkan daftar lagu favorit dari server
    const response = await fetch("/get-favorites");
    // Mengambil data dari respons sebagai JSON
    const data = await response.json();

    // Mendapatkan elemen DOM untuk daftar favorit
    const favoritesList = document.getElementById("favoritesList");

    // Iterasi melalui setiap lagu favorit
    data.forEach((favorite) => {
      // Membuat elemen untuk setiap item favorit
      const favoriteInfo = document.createElement("div");
      favoriteInfo.classList.add("favorite-item");

      // Membuat elemen untuk gambar album
      const albumImage = document.createElement("img");
      albumImage.classList.add("album-image");
      albumImage.src = favorite.imageUrl;
      albumImage.alt = "Album Cover";

      // Membuat elemen untuk detail lagu
      const songDetails = document.createElement("div");
      songDetails.classList.add("song-details");

      // Membuat elemen untuk nama lagu
      const songName = document.createElement("p");
      songName.classList.add("song-name");
      songName.textContent = favorite.name;

      // Membuat elemen untuk nama artis
      const artistName = document.createElement("p");
      artistName.classList.add("artist-name");
      artistName.textContent = favorite.artist;

      // Menyusun elemen detail lagu
      songDetails.appendChild(songName);
      songDetails.appendChild(artistName);

      // Menyusun elemen item favorit
      favoriteInfo.appendChild(albumImage);
      favoriteInfo.appendChild(songDetails);

      // Menambahkan item favorit ke dalam daftar favorit
      favoritesList.appendChild(favoriteInfo);
    });
  } catch (error) {
    console.error("Error:", error); // Menampilkan pesan kesalahan jika terjadi error
  }
};
