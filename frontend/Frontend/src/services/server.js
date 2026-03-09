import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {

  const { name, email, messageType, message } = req.body;

  if (!name || !email || !messageType || !message) {
    return res.status(400).json({
      success: false,
      message: "Hiányzó adatok"
    });
  }

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cashentis@gmail.com",
        pass: "wimv adwz zcpr okjk"
      }
    });

    const mailOptions = {
      from: "cashentis@gmail.com",
      to: "cashentis@gmail.com",
      subject: `Új üzenet (${messageType})`,
      html: `
        <h2>Új üzenet érkezett az oldalról</h2>

        <p><strong>Név:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Típus:</strong> ${messageType}</p>

        <h3>Üzenet:</h3>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Email küldési hiba"
    });

  }

});

app.listen(5000, () => {
  console.log("📧 Email szerver fut: http://localhost:5000");
});