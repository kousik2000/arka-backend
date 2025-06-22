const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(cors({
  origin: ['http://192.168.0.104:4200', 'https://arka-nest-designs.netlify.app'],  // Allowed domains
  methods: ['GET', 'POST'],  // Allowed HTTP methods
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', uploadRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Express Cloudinary API is running');
});

app.post('/send-email', async (req, res) => {
  // console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS )
  const { name, phone, email, message,requirementType,areaValue,areaUnit } = req.body;
  
  const templatePath = path.join(__dirname, 'replyemail.html');
  let contactmail = fs.readFileSync(templatePath, 'utf-8');
  contactmail = contactmail.replace('{{name}}', name);
  contactmail = contactmail.replace('{{phone}}', phone);
  contactmail = contactmail.replace('{{email}}', email);
  contactmail = contactmail.replace('{{message}}', message);
  contactmail = contactmail.replace('{{requirementType}}', requirementType);
  contactmail = contactmail.replace('{{areaValue}}', areaValue);
  contactmail = contactmail.replace('{{areaUnit}}', areaUnit);
  // Email to the business (from user's email)
  const mailToBusiness = {
    from: 'kousik.ramachandruni@gmail.com',
    to: 'arkanestdesigns@gmail.com',
    subject: `New Contact Form Submission from ${name}`,
    html: contactmail
  };

  try {
    await transporter.sendMail(mailToBusiness);
    await sendReplyEmail(name, phone, email, message,requirementType,areaValue,areaUnit);

    // Respond with success message
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email: ', error);
    return res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

const sendReplyEmail = async (name, phone, email, message,requirementType,areaValue,areaUnit) => {
  const templatePath = path.join(__dirname, 'replyemail.html');
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');
  htmlContent = htmlContent.replace('{{name}}', name);
  htmlContent = htmlContent.replace('{{name}}', name);
  htmlContent = htmlContent.replace('{{phone}}', phone);
  htmlContent = htmlContent.replace('{{email}}', email);
  htmlContent = htmlContent.replace('{{message}}', message);
  htmlContent = htmlContent.replace('{{requirementType}}', requirementType);
  htmlContent = htmlContent.replace('{{areaValue}}', areaValue);
  htmlContent = htmlContent.replace('{{areaUnit}}', areaUnit);
  const mailToUser = {
    from: 'contact@garchitectsanddevelopers.in', // Set the valid from address
    to: 'kousik.ramachandruni@gmail.com', 
    subject: 'Thank You for Contacting Us!',
    html:htmlContent 
  };

  try {
    await transporter.sendMail(mailToUser);
    console.log('Reply email sent successfully');
  } catch (err) {
    console.error('Error sending reply email: ', err);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
