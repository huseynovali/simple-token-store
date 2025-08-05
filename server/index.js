const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
const pool = require("./config/db");

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connect Success:", res.rows[0]);
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

testConnection();
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
