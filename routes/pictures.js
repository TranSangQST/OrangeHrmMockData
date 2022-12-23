const express = require("express");
const router = express.Router();

const dateformat = require("date-and-time");
const write = require("write");
const pictures = require("../mock/pictures");

/* GET home page. */
router.get("/", async function (req, res, next) {
   let insertSqls = "";
   //    let insertSqls = [];

   let picIndex = 0;
   const len = pictures.length;

   for (let i = 1; i <= 500; i++) {
      // for (let i = 501; i <= 1000; i++) {
      // for (let i = 1001; i <= 1500; i++) {
      // for (let i = 1501; i <= 2000; i++) {
      let insertSqlPre = `INSERT INTO hs_hr_emp_picture (emp_number, epic_picture, epic_filename, epic_type, epic_file_size, epic_file_width, epic_file_height)`;

      const pic = pictures[picIndex];

      let insertSqlValue = ` VALUES(${i}, ${pic[0]},'${pic[1]}', '${pic[2]}', '${pic[3]}', '${pic[4]}', '${pic[5]}');`;

      let insertSql = insertSqlPre + " " + insertSqlValue;

      picIndex++;
      if (picIndex > len - 1) picIndex = 0;

      insertSqls = insertSqls + insertSql;
      insertSqls = insertSqls + "\n";

      //   insertSqls.push(insertSql);
   }

   // await write.sync("pictures500.sql", insertSqls, { newline: true });
   // await write.sync("pictures1000.sql", insertSqls, { newline: true });
   // await write.sync("pictures1500.sql", insertSqls, { newline: true });
   // await write.sync("pictures2000.sql", insertSqls, { newline: true });

   res.render("pictures", { title: "Express" });
});

module.exports = router;
