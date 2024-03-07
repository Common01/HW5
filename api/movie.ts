import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { MoviePostRequest } from "../model/movie-post-req";

export const router = express.Router();
// Retrieve all Movie
router.get("/", (req, res) => {
    conn.query("SELECT * FROM Movie", (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});


// Retrieve Movie by ID
router.get("/id/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Movie WHERE mid = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});


//post /Movie+data
router.post("/", (req, res) => {

    const Movie: MoviePostRequest = req.body;
    console.log(Movie);
    

    let sql = "INSERT INTO `Movie`(`name`, `type`, `detail`, `year`, `id`, `poster`) VALUES (?,?,?,?,?,?)";
    sql = mysql.format(sql, [
        Movie.name,
        Movie.type,
        Movie.detail,
        Movie.year,
        Movie.id,
        Movie.poster
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });

    });

});

//Delete Person by id
router.delete("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from Movie where mid = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });