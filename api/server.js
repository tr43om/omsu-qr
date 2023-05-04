const express = require("express");
const cors = require("cors");
const upload = require("./scripts/uploadDocument");
const parseDocument = require("./scripts/parseDocument");
const generateQR = require("./scripts/generateQR");
const puppeteer = require("puppeteer");

const mammoth = require("mammoth");
const { JSDOM } = require("jsdom");

// dependencies for auth
const mysql = require("mysql-await");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");

const app = express();
app.use(cors());

const documentStyles = `
  strong {
    text-align: center;
    display: block;
  }

  table, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
`;

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "host.docker.internal",
  user: "root",
  password: MYSQL_ROOT_PASSWORD,
  database: MYSQL_DATABASE,
});

app.set("strict routing", true);
app.set("view engine", "ejs");
app.use(cookieParser(SECRET_KEY));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  if (!req.signedCookies.login || !req.signedCookies.password) {
    return res.redirect("/login");
  } else {
    console.log(req.signedCookies.login);
    console.log(req.signedCookies.login.type);
    console.log(req.signedCookies.password);
    console.log(req.signedCookies.password.type);
    const db = await pool.awaitGetConnection();
    try {
      result = await db.awaitQuery(
        "SELECT `id` FROM `users` WHERE `login` = ? AND `password` = ? LIMIT 1",
        [req.signedCookies.login, req.signedCookies.password]
      );
      if (result.length === 1) {
        if (result[0].id === 1) {
          message = "admin";
        } else {
          message = "id " + result[0].id;
        }
      } else {
        message = "Ошибка";
      }
    } catch (e) {
      message = "Ошибка";
    } finally {
      db.release();
      res.render("index", { message });
    }
  }
});

app.get("/login", (req, res) => {
  res.render("login", { error: "" });
});

app.post(
  "/login",
  [
    validator.body("login").isString().isLength({ max: 64 }).trim(),
    validator.body("password").isString().isLength({ max: 64 }),
  ],
  async (req, res) => {
    const db = await pool.awaitGetConnection();
    try {
      validator.validationResult(req).throw();
      result = await db.awaitQuery(
        "SELECT `id` FROM `users` WHERE `login` = ? AND `password` = ? LIMIT 1",
        [req.body.login, req.body.password]
      );
      if (result.length === 1) {
        res.cookie("login", req.body.login, { signed: true });
        res.cookie("password", req.body.password, { signed: true });
        return res.redirect("/");
      } else {
        return res.render("login", { error: "Неправильный логин или пароль" });
      }
    } catch (e) {
      return res.render("login", { error: "Ошибка" });
    } finally {
      db.release();
    }
  }
);

app.get("/signup", (req, res) => {
  res.render("signup", { error: "" });
});

app.post(
  "/signup",
  [
    validator.body("login").isString().isLength({ max: 64 }).trim(),
    validator.body("password").isString().isLength({ max: 64 }),
  ],
  async (req, res) => {
    const db = await pool.awaitGetConnection();
    try {
      validator.validationResult(req).throw();
      result = await db.awaitQuery(
        "SELECT `id` FROM `users` WHERE `login` = ?",
        [req.body.login]
      );
      if (result.length != 0)
        return res.render("signup", { error: "Пользователь уже найден" });
      result = await db.awaitQuery(
        "INSERT INTO `users` (`login`, `password`) VALUES (?, ?)",
        [req.body.login, req.body.password]
      );
      res.cookie("login", req.body.login, { signed: true });
      res.cookie("password", req.body.password, { signed: true });
      return res.redirect("/");
    } catch (e) {
      return res.render("signup", { error: "Ошибка" });
    } finally {
      db.release();
    }
  }
);

app.get("/logout", (req, res) => {
  res.clearCookie("login");
  res.clearCookie("password");
  return res.redirect("/signup");
});

app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { paymentInfo } = await parseDocument(req.file.buffer);
    const { svg, png } = await generateQR(paymentInfo);

    const data = await mammoth.convertToHtml(
      { buffer: req.file.buffer },
      { includeDefaultStyles: true }
    );

    const dom = new JSDOM(data.value);
    const htmlDoc = dom.window.document;

    // Attach QR code at the end of the document
    const img = htmlDoc.createElement("img");
    img.style.cssText = "float: right; margin: 10px;";
    img.src = png;
    htmlDoc.body.appendChild(img);

    // Attach styles to the document
    const style = htmlDoc.createElement("style");
    style.textContent = documentStyles;
    htmlDoc.head.appendChild(style);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 595, height: 842 });

    await page.setContent(htmlDoc.documentElement.outerHTML);
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.json({
      qr: { svg, png },
      pdf: pdfBuffer.toString("base64"),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(3001, async () => {
  const db = await pool.awaitGetConnection();
  await db.awaitQuery(
    "CREATE TABLE IF NOT EXISTS users (" +
      "    id INTEGER AUTO_INCREMENT PRIMARY KEY," +
      "    login VARCHAR(50)," +
      "    password VARCHAR(50)" +
      ");"
  );
  console.log("Server started on port 3001");
});
