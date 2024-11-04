// noinspection JSCheckFunctionSignatures

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const Note = require("./models/noteModel.js");
const cors = require("cors");
const req = require("express/lib/request");
const { response } = require("express");
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.get("/api/notes", (_, res, next) => {
  Note.find()
    .then((result) => res.json(result))
    .catch((error) => next(error));
});
app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});
app.post("/api/notes", (req, res, next) => {
  const { content, important } = req.body;
  const newNote = new Note({ content: content, important: important });
  newNote
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});
app.patch("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  const { important } = req.body;
  Note.findByIdAndUpdate(
    id,
    { important: important },
    {
      new: true,
      context: "query",
      runValidators: true,
    },
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});
app.delete("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then((result) => res.json(result))
    .catch((error) => next(error));
});
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(500).send({ error: "Malformed id" });
  }
  next(err);
});
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
