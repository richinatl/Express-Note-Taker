const express = require("express");
const path = require("path");
const fs = require("fs");
let notes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

currentID = notes.length;

app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", ({ body }, res) => {
  const newNote = body;

  newNote["id"] = currentID + 1;
  currentID++;
  console.log(newNote);

  notes.push(newNote);

  rewriteNotes();

  return res.status(200).end();
});

app.delete("/api/notes/:id", function (req, res) {
  const filtered = notes.filter((note) => note.id !== parseInt(req.params.id));
  notes = filtered;

  updateDb();

  return res.status(200).end();
});

function updateDb() {
  fs.writeFile("db/db.json", JSON.stringify(notes, "\t"), (err) => {
    if (err) throw err;
    return;
  });
}

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

function rewriteNotes() {
  fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
    if (err) {
      console.log("Error");
      return console.log(err);
    }

    console.log("Success");
  });
}
