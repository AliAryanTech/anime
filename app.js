const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin-anime:Dbskalyan@1@cluster0.0ge2u.mongodb.net/animeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// ===================== Anime Model ===========================

const animeSchema = new mongoose.Schema({
  name: String,
  bannerUrl: String,
  status: String,
  dateAired: String,
  episodeList: [
    {
      episodeName: String,
      episodeLink: String,
    },
  ],
});

const Anime = mongoose.model("Anime", animeSchema);

// ===================== Get Requests  ===========================

app.get("/", function (req, res) {
  Anime.find({}, function (err, animes) {
    res.render("home", {
      animes: animes,
    });
  });
});

app.get("/anime/:animeId", function (req, res) {
  const requestedAnime = req.params.animeId;

  Anime.findOne({ _id: requestedAnime }, function (err, anime) {
    res.render("anime", {
      anime: anime,
    });
  });
});

app.get("/player/:epId", function (req, res) {
  const source = req.params.epId;
  console.log(source);
  res.render("player", {
    src: source,
  });
});

app.get("/add", function (req, res) {
  res.render("addPage");
});

// =========================== POST Requests =========================

app.post("/addAnime", function (req, res) {
  const animeName = req.body.animeName;
  const animeImgUrl = req.body.animeImgUrl;
  const animeStatus = req.body.animeStatus;
  const animeDate = req.body.animeDate;
  const animeEpisode = req.body.animeEpisode;
  const animeLink = req.body.animeLink;

  const anime = new Anime({
    name: animeName,
    bannerUrl: animeImgUrl,
    status: animeStatus,
    dateAired: animeDate,
    episodeList: [
      {
        episodeName: animeEpisode,
        episodeLink: animeLink,
      },
    ],
  });

  anime.save(function (err) {
    if (!err) {
      res.redirect("/add");
    }
  });
});

// ==========================Save new Episodes

// const episodeListNew = {
//   episodeName: "3",
//   episodeLink: "hydra3",
// };

// Anime.findOneAndUpdate(
//   { name: "GOHS" },
//   {
//     $push: { episodeList: episodeListNew },
//   },
//   { upsert: true },
//   function (err, data) {
//     console.log(err);
//   }
// );
// Anime.findOne({ name: "GOHS" }, function (err, name) {
//   console.log(name);
// });

// ==========================Save new anime

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});
