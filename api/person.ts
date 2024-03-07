import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { PersonPostRequest } from "../model/person-post-request";

export const router = express.Router();
// Retrieve all Person
router.get("/", (req, res) => {
    conn.query("SELECT * FROM Person", (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});


// Retrieve Person by ID
router.get("/id/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Person WHERE pid = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});


//post /Person+data
router.post("/", (req, res) => {

    const Person: PersonPostRequest = req.body;
    console.log(Person);
    

    let sql = "INSERT INTO `Person`(`name`, `detail`, `lmage`) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        Person.name,
        Person.detail,
        Person.lmage,
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
    conn.query("delete from Person where pid = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });