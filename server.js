const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

currentID = notes.length;

app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", ({ body }, res) => {
  const newTask = body;

  newTask["id"] = currentID + 1;
  currentID++;
  console.log(newTask);

  notes.push(newTask);

  rewriteTasks();

  return res.status(200).end();
});

app.delete("/api/notes/:id", ({ params }, res) => {
  res.send("DELETE request at /api/notes/:id");

  const id = params.id;

  const idLess = notes.filter((less) => less.id < id);

  const idMore = notes.filter((more) => more.id > id);

  notes = idLess.concat(idMore);

  rewriteTasks();
});

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

function rewriteTasks() {
  fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
    if (err) {
      console.log("Error");
      return console.log(err);
    }

    console.log("Success");
  });
}
