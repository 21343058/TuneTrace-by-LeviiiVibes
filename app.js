// Mengimpor modul-modul yang dibutuhkan
const express = require("express"); // Memanggil modul Express.js
const app = express(); // Membuat instance aplikasi Express
const path = require("path"); // Modul untuk menangani path file
const { MongoClient } = require("mongodb"); // Modul untuk berinteraksi dengan MongoDB
const port = 3036; // Port yang akan digunakan
const bodyParser = require("body-parser"); // Middleware untuk parsing body pada request HTTP

// Menggunakan middleware bodyParser untuk parsing request body
app.use(bodyParser.urlencoded({ extended: true })); // Mendukung parsing data URL-encoded
app.use(bodyParser.json()); // Mendukung parsing data JSON

// Nama database yang ingin dibuat
const dbName = "spotify";

// Koneksi ke MongoDB
const uri = "mongodb://localhost:27017"; // URI MongoDB
const client = new MongoClient(uri, {
  useNewUrlParser: true, // Pengaturan untuk URL parser yang akan digunakan
  useUnifiedTopology: true, // Pengaturan untuk topologi server yang akan digunakan
});

let db; // Variabel untuk menyimpan koneksi database

// Menghubungkan ke MongoDB
client
  .connect() // Melakukan koneksi ke MongoDB
  .then(async (connectedClient) => {
    console.log("Connected to MongoDB"); // Pesan jika berhasil terkoneksi

    // Mengatur koneksi database
    db = connectedClient.db(dbName); // Menggunakan database dengan nama yang ditentukan

    // Membuat koleksi 'favorite' jika belum ada
    const collectionExists = await db
      .listCollections({ name: "favorite" }) // Mengecek apakah koleksi 'favorite' sudah ada
      .hasNext();
    if (!collectionExists) {
      await db.createCollection("favorite"); // Jika belum ada, koleksi 'favorite' akan dibuat
      console.log("Created 'favorite' collection"); // Pesan jika koleksi 'favorite' berhasil dibuat
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err); // Pesan jika gagal terkoneksi
    process.exit(1); // Keluar dari proses aplikasi
  });

// Mengatur routing untuk halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Mengirim file index.html sebagai response
});

// Menyediakan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public"))); // Menyajikan file statis dari folder 'public'

// Menangani request POST untuk menambah lagu ke daftar favorit
app.post("/add-to-favorites", async (req, res) => {
  const { name, artist, previewUrl, externalUrl, imageUrl } = req.body; // Mengambil data dari request body

  if (!db) {
    return res.status(500).send("Database unavailable"); // Memberikan pesan jika database tidak tersedia
  }

  try {
    const favoritesCollection = db.collection("favorite"); // Mengakses koleksi 'favorite'
    await favoritesCollection.insertOne({
      name,
      artist,
      previewUrl,
      externalUrl,
      imageUrl,
    }); // Menambahkan data lagu ke koleksi 'favorite'
    res.status(200).send("Song added to favorites"); // Memberikan respons berhasil
  } catch (error) {
    console.error("Error adding song to favorites:", error); // Menampilkan pesan kesalahan jika terjadi error
    res.status(500).send("Failed to add song to favorites"); // Memberikan respons gagal
  }
});

// Endpoint untuk mendapatkan lagu favorit dari MongoDB
app.get("/get-favorites", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).send("Database unavailable"); // Memberikan pesan jika database tidak tersedia
    }

    const favoritesCollection = db.collection("favorite"); // Mengakses koleksi 'favorite'
    const favorites = await favoritesCollection.find({}).toArray(); // Mengambil semua lagu favorit

    res.json(favorites); // Mengirim daftar lagu favorit sebagai respons JSON
  } catch (error) {
    console.error("Error getting favorites:", error); // Menampilkan pesan kesalahan jika terjadi error
    res.status(500).send("Failed to get favorites"); // Memberikan respons gagal
  }
});

// Menjalankan server pada port yang ditentukan
app.listen(port, () => {
  console.log(`Server running on port ${port}`); // Menampilkan pesan saat server berjalan
});
