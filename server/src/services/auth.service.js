const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const googleClient = require("../config/google");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

const generateVerificationToken = require("../utils/generateVerificationToken");
const generateResetToken = require("../utils/generateResetToken");

const registerUser = async (data) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create(data);

  // Send verification email
  await sendVerificationEmail(user);

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
  throw new ApiError(
    403,
    "Please verify your email before logging in."
  );
}

  return user;
};
const saveRefreshToken = async (userId, refreshToken) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.refreshToken = refreshToken;

    await user.save();

};
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = generateResetToken();

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
      <h2>Flora Password Reset</h2>

      <p>You requested a password reset.</p>

      <a href="${resetURL}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: "Flora Password Reset",
    message,
  });
};

const resetPassword = async (token, password) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
        throw new ApiError(400, "Reset token is invalid or has expired");
    }

    user.password = password;

    user.resetPasswordToken = "";

    user.resetPasswordExpire = undefined;

    await user.save();

};

const sendVerificationEmail = async (user) => {
  const token = generateVerificationToken();

  user.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  user.emailVerificationExpire =
    Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  const verifyURL =
    `${process.env.CLIENT_URL}/verify-email/${token}`;

  const message = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
</head>

<body style="
margin:0;
padding:0;
background:#F8F8F8;
font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table
width="600"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
margin:40px auto;
border-radius:18px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.08);
">

<tr>
<td
style="
background:#F33B7D;
padding:35px;
text-align:center;
color:white;
"
>

<h1 style="margin:0;font-size:32px;">
Flora
</h1>

<p style="margin-top:10px;font-size:16px;">
Women's Health Companion
</p>

</td>
</tr>

<tr>
<td style="padding:45px;">

<h2
style="
margin-top:0;
color:#222;
font-size:28px;
"
>
Welcome to Flora!
</h2>

<p
style="
font-size:16px;
line-height:1.7;
color:#555;
"
>
Hi,
</p>

<p
style="
font-size:16px;
line-height:1.7;
color:#555;
"
>
Thank you for creating your Flora account.

Before you can start using Flora, please verify your email address.

This helps us keep your account secure.
</p>

<div style="text-align:center;margin:40px 0;">

<a
href="${verifyURL}"
style="
display:inline-block;
padding:16px 40px;
background:#F33B7D;
color:white;
text-decoration:none;
border-radius:12px;
font-size:16px;
font-weight:bold;
"
>
Verify Email
</a>

</div>

<p
style="
font-size:15px;
line-height:1.7;
color:#666;
"
>
This verification link will expire in
<strong>24 hours.</strong>
</p>

<p
style="
font-size:15px;
line-height:1.7;
color:#666;
"
>
If you didn't create a Flora account, you can safely ignore this email.
</p>

<hr
style="
margin:35px 0;
border:none;
border-top:1px solid #eee;
"
/>

<p
style="
font-size:13px;
color:#999;
line-height:1.7;
"
>

Need help?
Reply to this email or contact the Flora support team.

</p>

</td>
</tr>

<tr>
<td
style="
background:#FFF5F8;
padding:18px;
text-align:center;
font-size:13px;
color:#888;
"
>

© ${new Date().getFullYear()} Flora • Empowering Women's Health

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  await sendEmail({
    email: user.email,
    subject: "Verify your Flora account",
    message,
  });
};
const verifyEmail = async (token) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");


  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(
      400,
      "Verification token is invalid or has expired"
    );
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;

  await user.save();

  return user;

};
const resendVerificationEmail = async (email) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isEmailVerified) {
        throw new ApiError(400, "Email is already verified");
    }

    await sendVerificationEmail(user);

};

const loginWithGoogle = async (idToken) => {

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const {
    sub,
    email,
    name,
    picture,
    email_verified,
  } = payload;

  if (!email_verified) {
    throw new ApiError(
      401,
      "Google account email is not verified."
    );
  }

  let user = await User.findOne({ email });

  if (!user) {

    user = await User.create({
      fullName: name,
      email,
      googleId: sub,
      provider: "google",
      profilePicture: picture,
      isEmailVerified: true,
    });

  } else {

    if (!user.googleId) {
      user.googleId = sub;
    }

    user.provider = "google";

    if (!user.profilePicture) {
      user.profilePicture = picture;
    }

    user.isEmailVerified = true;

    await user.save();
  }

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  await saveRefreshToken(
    user._id,
    refreshToken
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
  saveRefreshToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
};