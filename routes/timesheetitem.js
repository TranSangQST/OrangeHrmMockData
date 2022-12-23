var express = require("express");
var router = express.Router();

const dateformat = require("date-and-time");
const write = require("write");

/* GET users listing. */
router.get("/", async function (req, res, next) {
   let insertSqls = "";
   //  let insertSqls = [];

   let activityId = 1;

   const employeeOff = {};

   const durationMocks = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
   ];

   const len = durationMocks.length - 1;

   for (let i = 1; i <= 756000; i++) {
      let insertSqlPre = `insert into ohrm_timesheet_item (timesheet_item_id, date, timesheet_id, employee_id, activity_id, project_id, duration, comment)`;

      const firstDay = new Date("2021-12-27 00:00:00");

      const countDay = Math.floor((i - 1) / 2000);
      // console.log("countDay: ", countDay)

      const date = dateformat.addDays(firstDay, countDay);
      const timesheetId = ((i - 1) % 2000) + 1 + Math.floor((i - 1) / (2000 * 7)) * 2000;
      // console.log("timesheetId: ", timesheetId)
      const employeeNum = ((timesheetId - 1) % 2000) + 1;
      const projectId = ((activityId - 1) % 100) + 1;

      let duration = 0;
      if (date.getDay() == 6 || date.getDay() == 0) {
         duration = 0;
      } else {
         const max = 10;
         const min = 0;
         const durationIndex = Math.floor(Math.random() * (len - 0)) + 0;

         duration = durationMocks[durationIndex] * 3600;

         if (duration === 0) {
            // console.log(`${employeeNum} in ${dateformat.format(date,"YYYY-MM-DD 00:00:00")}`);
            // employeeOff[employeeNum].push(date);
            if (employeeOff[employeeNum]) employeeOff[employeeNum].push(date);
            else {
               employeeOff[employeeNum] = [date];
            }
         }
      }

      let insertSqlValue = `values (${i}, '${dateformat.format(
         date,
         "YYYY-MM-DD 00:00:00"
      )}', ${timesheetId}, ${employeeNum}, ${activityId}, ${projectId}, ${duration}, ' ');`;

      activityId++;
      if (activityId > 1000) activityId = 1;

      let insertSql = insertSqlPre + " " + insertSqlValue;

      insertSqls = insertSqls + insertSql;
      insertSqls = insertSqls + "\n";
      // insertSqls.push(insertSql);
   }

   const employeeOff12 = [];
   let employeeOff12Str = "";
   let employeeOffStr = "";

   console.log("Nhan duration 0 la: ");
   Object.keys(employeeOff).forEach((employeeKey, index) => {
      // console.group("employee: ", employeeKey);

      const dates = employeeOff[employeeKey];
      employeeOffStr = employeeOffStr + `${employeeKey}: ${dates.length} \n`;

      dates.forEach((d) => {
         //  console.log("date: ", dateformat.format(d, "YYYY-MM-DD 00:00:00"));
         employeeOffStr = employeeOffStr + dateformat.format(d, "YYYY-MM-DD") + "\n";
      });

      employeeOffStr = employeeOffStr + "\n\n";

      if (dates.length > 12) {
         employeeOff12.push(employeeKey);
      }

      // console.groupEnd();
   });

   employeeOff12.forEach((emp) => {
      // console.log(`emp: ${emp}: ${employeeOff[emp].length} `);

      const dates = employeeOff[emp];
      employeeOff12Str = employeeOff12Str + `${emp}: ${dates.length} \n`;
      dates.forEach((d) => {
         //  console.log("date: ", dateformat.format(d, "YYYY-MM-DD 00:00:00"));
         employeeOff12Str = employeeOff12Str + dateformat.format(d, "YYYY-MM-DD") + "\n";
      });

      employeeOff12Str = employeeOff12Str + "\n\n";
   });

   //  await write.sync("employeeOff.txt", employeeOffStr, { newline: true });

   //  console.log("employeeOffStr: ");
   //  console.log(employeeOffStr);
   //  console.log("employeeOff12Str: ", employeeOff12.length);
   //  console.log(employeeOff12Str);

   await write.sync("timesheetItem.sql", insertSqls, { newline: true });

   await write.sync("employeeOff.txt", "employeeOffStr \n" + employeeOffStr, { newline: true });
   await write.sync(
      "employeeOff12Str.txt",
      `employeeOff12Str: ${employeeOff12.length} \n` + employeeOff12Str,
      {
         newline: true
      }
   );

   res.render("timesheetitem", { title: "Express" });
});

module.exports = router;
