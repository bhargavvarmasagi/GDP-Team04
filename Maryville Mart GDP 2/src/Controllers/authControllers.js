const db = require('../Database/db.js');
const { generateToken, verifyToken } = require('../Utils/jwtUtils.js');
const { sendResetPasswordEmail } = require('../Utils/emailService.js');
const bcrypt = require('bcryptjs');


const register = async (req, res) => {
  const { firstName, lastName, email, contact, password, address } = req.body;
  if(!firstName || !lastName || !email || !password || !address){
    res.status(404).send({ data : { message: "Please fill all fields" } })
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.execute(
      'INSERT INTO Customers (FirstName, LastName, Email, PhoneNumber, PasswordHash, Address) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, contact, hashedPassword, address]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("Error while register: ", error);
    res.status(500).json({ error: 'Error registering user' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM Customers WHERE Email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user[0].PasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user[0].id);
    res.status(200).json({ token, CustomerID : user[0].CustomerID, email: user[0].Email, number: user[0].PhoneNumber });
  } catch (error) {
    console.log("Error while login : ", error)
    res.status(500).json({ error: 'Error logging in' });
  }
};


const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM Customers WHERE Email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = generateToken(user[0].CustomerID);
    const resetLink = `http://localhost:${process.env.PORT}/resetPassword.html?token=${resetToken}`;

    await sendResetPasswordEmail(email, resetLink);
    res.status(200).json({ message: 'Reset password link sent to your email' });
  } catch (error) {
    console.log("Error while reset password : ", error);
    res.status(500).json({ error: 'Error sending reset password link' });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = verifyToken(token);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute('UPDATE Customers SET PasswordHash = ? WHERE CustomerID = ?', [
      hashedPassword,
      decoded.id,
    ]);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log("Error while reset password : ", error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};

module.exports = { register, login, requestResetPassword, resetPassword };