import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";

export const router = express.Router();

router.get("/:name", (req, res) => {
    let responseData = {
      persons: [],
      movies: []
    };
  
    let sql = `SELECT Person.* FROM Person WHERE pid IN (
      SELECT Stars_S.SPID FROM Stars_S
      INNER JOIN Movie ON Stars_S.SMID = Movie.mid
      WHERE Movie.name LIKE ?
  
      UNION
  
      SELECT Creators_C.CPID FROM Creators_C
      INNER JOIN Movie ON Creators_C.CMID = Movie.mid
      WHERE Movie.name LIKE ?
  )`;
    sql = mysql.format(sql, [`%${req.params.name}%`, `%${req.params.name}%`]); // Use the same parameter twice
    conn.query(sql, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        responseData.persons = result;
        checkAndSendResponse();
      }
    });
  
    let sql1 = `SELECT * FROM Movie WHERE name LIKE ?`;
    sql1 = mysql.format(sql1, [`%${req.params.name}%`]);
    conn.query(sql1, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        responseData.movies = result;
        checkAndSendResponse();
      }
    });
  
    function checkAndSendResponse() {
      if (responseData.persons.length > 0 && responseData.movies.length > 0) {
        res.json(responseData);
      }
    }
  });