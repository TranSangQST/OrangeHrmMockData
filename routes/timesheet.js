const express = require("express");
const router = express.Router();

const dateformat = require("date-and-time");
const write = require("write");

/* GET home page. */
router.get("/", async function (req, res, next) {
   let insertSqls = "";

   let currentEmployeeNum = 1;

   for (let i = 1; i <= 120000; i++) {
      let insertSqlPre = `insert into ohrm_timesheet (timesheet_id, state, start_date, end_date, employee_id)`;

      const firstDay = new Date("2021-12-27 00:00:00");

      const countDay = Math.floor((i - 1) / 2000) * 7;
      const prevDay = dateformat.addDays(firstDay, countDay);
      const nextDay = dateformat.addDays(prevDay, 6);

      let insertSqlValue = `values (${i}, 'NOT SUBMITTED', '${dateformat.format(
         prevDay,
         "YYYY-MM-DD 00:00:00"
      )}', '${dateformat.format(nextDay, "YYYY-MM-DD 00:00:00")}', ${currentEmployeeNum});`;

      currentEmployeeNum++;
      if (currentEmployeeNum > 2000) currentEmployeeNum = 1;

      let insertSql = insertSqlPre + " " + insertSqlValue;

      insertSqls = insertSqls + insertSql;
      insertSqls = insertSqls + "\n";
      //   insertSqls.push(insertSql);
   }

   await write.sync("timesheet.sql", insertSqls, { newline: true });

   res.render("timesheet", { title: "Express", insertSqls });
});

module.exports = router;
