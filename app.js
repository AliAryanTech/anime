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
  summary: String,
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

app.get("/new", function (req, res) {
  res.render("addPage");
});

app.get("/add", function (req, res) {
  res.render("addEpisode");
});

// =========================== POST Requests =========================

// == Save new anime ==

app.post("/addAnime", function (req, res) {
  const animeName = req.body.animeName;
  const animeImgUrl = req.body.animeImgUrl;
  const animeSummary = req.body.animeSummary;
  const animeStatus = req.body.animeStatus;
  const animeDate = req.body.animeDate;
  const animeEpisode = req.body.animeEpisode;
  const animeLink = req.body.animeLink;

  const anime = new Anime({
    name: animeName,
    bannerUrl: animeImgUrl,
    summary: animeSummary,
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

// == Save new Episodes ==

app.post("/addEpisode", function (req, res) {
  const animeName = req.body.animeName;
  const episodeListNew = {
    episodeName: req.body.episodeNumber,
    episodeLink: req.body.episodeLink,
  };

  Anime.findOneAndUpdate(
    { name: animeName },
    {
      $push: { episodeList: episodeListNew },
    },
    { upsert: true },
    function (err, data) {
      res.redirect("/add");
    }
  );
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});
