import { sendEmailContactUs } from "../middlewares/SendEmail.js";

export const contactUsController = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log(name, email, phone, message);
    const toSend = `New message from ${name},\n
                      <p>phone: ${phone}</p>
                      <p>email:${email}</p>
                      <p>${message}</p>`;

    sendEmailContactUs(email, `New message from ${name}`, toSend);

    res.status(200).send({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Contact us",
    });
  }
};
