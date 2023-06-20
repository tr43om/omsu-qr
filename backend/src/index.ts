import express, { Request, Response } from "express";
import cors from "cors";

import {
  generateQR,
  upload,
  parseDocument,
  generatePDF,
  convertDocxToHtml,
} from "./services/index.js";
import { attachQrToDocument } from "./utils/attachQrToDocument.js";

// dependencies for auth

import mysql from "mysql-await";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import validator from "express-validator";
import { DocumentTypes } from "./types/index.js";
import { addImageToPdf } from "./utils/attachQrToPdf.js";

const app = express();
app.use(cors());

const documentStyles = ` 
  h1,h2,h3 {
    font-weight: bold;
    text-align: center;
    display: block;
    font-size: 12pt;
  }
  
  table, td {
    border: 1px solid black;
    border-collapse: collapse;
  }

  body {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 1in;
  }

  ul, ol {
    margin-left: 1.25in;
  }
`;

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;

app.post(
  "/upload",
  upload.single("document"),
  async (req: Request, res: Response) => {
    const { buffer } = req.file as Express.Multer.File;
    const fileType = req.file?.mimetype as string;
    try {
      const { paymentInfo, content } = await parseDocument(buffer, fileType);

      const { svg, png } = await generateQR(paymentInfo);
      let pdf = "";

      if (fileType === DocumentTypes.doc) {
        // Convert buffer of document to html
        const { html } = await convertDocxToHtml(buffer);

        // Attach QR code at the end of the document and at the beginning of the document
        attachQrToDocument(html, png);

        // Attach styles to the document
        const style = html.createElement("style");
        style.textContent = documentStyles;
        html.head.appendChild(style);

        // Generate PDF using Puppeteer
        const { pdfBuffer } = await generatePDF(html);
        pdf = pdfBuffer.toString("base64");
      } else if (fileType === DocumentTypes.pdf) {
        console.log("pdf");
        const modifiedPdfBytes = await addImageToPdf(buffer, png, 0, 0, 100);
        console.log(modifiedPdfBytes);

        pdf = Buffer.from(modifiedPdfBytes).toString("base64");
      }

      res.json({
        qr: { svg, png },
        pdf,
        paymentInfo,
        content,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

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

app.get("/", async (req: Request, res: Response) => {
  if (!req.signedCookies.login || !req.signedCookies.password) {
    return res.redirect("/login");
  } else {
    console.log(req.signedCookies.login);
    console.log(req.signedCookies.login.type);
    console.log(req.signedCookies.password);
    console.log(req.signedCookies.password.type);
    const db = await pool.awaitGetConnection();
    let result, message;
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
  async (req: Request, res: Response) => {
    const db = await pool.awaitGetConnection();
    let result;
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
  async (req: Request, res: Response) => {
    const db = await pool.awaitGetConnection();
    let result;
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

app.listen(3001, async () => {
  // const db = await pool.awaitGetConnection();
  // await db.awaitQuery(
  //   "CREATE TABLE IF NOT EXISTS users (" +
  //     "    id INTEGER AUTO_INCREMENT PRIMARY KEY," +
  //     "    login VARCHAR(50)," +
  //     "    password VARCHAR(50)" +
  //     ");"
  // );
  console.log("Server started on port 3001");
});
