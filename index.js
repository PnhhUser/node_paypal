require("dotenv").config();

const express = require("express");
const { createOrder, capturePaypal } = require("./services/pay");

const PORT = process.env.PORT;

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/pay", async (req, res) => {
  try {
    const url = await createOrder();

    res.redirect(url);
  } catch (err) {
    res.send(err);
  }
});

app.get("/complete-order", async (req, res) => {
  try {
    await capturePaypal(req.query.token);
    res.send("thanh toan thanh cong");
  } catch (err) {
    res.send(err);
  }
});

app.get("/cancel-order", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running port: ${PORT}`);
});
