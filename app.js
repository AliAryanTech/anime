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

const animeSchema = new mongoose.Schema({
  name: String,
  episodeList: [
    {
      episodeName: String,
      episodeLink: String,
    },
  ],
});

const Anime = mongoose.model("Anime", animeSchema);

app.get("/", function (req, res) {
  Anime.find({}, function (err, animes) {
    res.render("home", {
      animes: animes,
    });
  });
});

app.get("/anime/:animeId", function (req, res) {
  const requestedAnime = req.params.animeId;

  // console.log(requestedAnime);
  // console.log(requestedVideo);

  Anime.findOne({ _id: requestedAnime }, function (err, anime) {
    // console.log(anime.episodeList);

    // var i = anime.episodeList.length,
    //   foundVideo;

    // while (i--) {
    //   if (requestedVideo == anime.episodeList[i]._id) {
    //     foundVideo = anime.episodeList[i];
    //     break;
    //   }
    // }

    // for (let index = 0; index < i; index++) {
    //   if (requestedVideo === anime.episodeList[i]._id) {
    //     foundVideo = anime.episodeList[i];
    //     break;
    //   }
    // }

    // var foundVideo = anime.episodeList.find(function (episode) {
    //   return episode._id === requestedVideo;
    // });

    // console.log(foundVideo);
    // const foundVideo = anime.episodeList.find(function (matchedVideo) {
    //   return matchedVideo._id === requestedVideo;
    // });
    // console.log("Found Vide0 = " + foundVideo);

    res.render("anime", {
      anime: anime,
    });
  });

  app.get("/player/:epId", function (req, res) {
    const source = req.params.epId;
    console.log(source);
    res.render("player", {
      src: source,
    });
  });

  // Anime.find(
  //   {},
  //   function (err, animes) {
  //     animes.forEach(function (anime) {
  //       const foundVideo = anime.episodeList.find(function (matchedVideo) {
  //         return matchedVideo._id === requestedVideo;
  //       });
  //       console.log(foundVideo);
  //     });
  //   },
  //   function (params) {
  //     res.render("player");
  //   }
  // );
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
// const anime = new Anime({
//   name: "GOHS",
//   episodeList: [{ episodeName: "2", episodeLink: "hydra" }],
// });

// anime.save(function (err) {
//   if (!err) {
//     res.redirect("/home");
//   }
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
