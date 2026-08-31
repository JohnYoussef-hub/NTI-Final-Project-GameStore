const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const { customAlphabet } = require("nanoid");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const {
  template,
  passwordResetOtpTemplate,
  emailVerificationTemplate,
} = require("../utils/emailTemplate");

const jwtSign = promisify(jwt.sign);

// exports.signUp = catchAsync(async (req,res,next) => {
//     const {email,password,name,image} = req.body
//     // check if email is exist
//     const findUser = await User.findOne({isDeleted:false , email})
//     if(findUser) return next(new AppError(400 , "This email is already exist"))
//     // hashing password
//     const hashedPassword = await bcrypt.hash(password,+process.env.SALT_ROUND)
//     // send otp to email
//     const otp = customAlphabet("0123456789",6)()
//     const hashedOTP = await bcrypt.hash(otp,+process.env.SALT_ROUND)
//     const OTPExpire = Date.now() + 10 * 60 * 1000
//     // save user
//     const user = await User.create({email,password:hashedPassword,name,image,confirmOTP:hashedOTP,OTPExpire})
//     sendEmail(email , "Confirm Email" , template(otp,name,"Confirm Email"))
//     user.password = undefined
//     user.confirmOTP = undefined
//     user.OTPExpire = undefined
//     user.role = undefined
//     user.isDeleted = undefined
//     res.status(200).json({
//         success : true ,
//         data : user
//     })
// })

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check account
  const user = await User.findOne({ email });
  if (user) return next(new AppError(500, "this email already exist"));
  // hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // OTP
  const OTP = customAlphabet("0123456789", 6)();
  const confirmOTP = await bcrypt.hash(OTP, 10);
  const OTPExpire = Date.now() + 10 * 60 * 1000;
  const findUser = await User.create({
    ...req.body,
    password: hashPassword,
    confirmOTP,
    OTPExpire,
  });
  const emailTemplate = emailVerificationTemplate(OTP, req.body.name || "User");
  await sendEmail(email, "Confirm Your Email Address", emailTemplate);
  res.status(200).json({
    sucess: true,
    data: findUser,
  });
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const { email, confirmOTP } = req.body;
  // check if email is exist
  const findUser = await User.findOne({ isDeleted: false, email }).select(
    "+confirmOTP",
  );
  if (!findUser)
    return next(new AppError(400, "This is email isn't exist please signup"));
  // check if email is active
  if (findUser.isActive)
    return next(new AppError(400, "This email is already active"));
  // check otp
  const check = await bcrypt.compare(confirmOTP, findUser.confirmOTP);
  if (!check || !confirmOTP || findUser.OTPExpire < Date.now())
    return next(new AppError(400, "Invalid OR Expired OTP"));
  findUser.isActive = true;
  findUser.confirmOTP = undefined;
  findUser.OTPExpire = undefined;
  await findUser.save();
  res.status(200).json({
    success: true,
    message: "Email is confirmed Successfully",
  });
});

exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError(400, "Email is required"));
  }

  const findUser = await User.findOne({ isDeleted: false, email });
  if (!findUser) {
    return next(new AppError(400, "This user is not found"));
  }

  if (findUser.isActive) {
    return next(new AppError(400, "This email is already active"));
  }

  const OTP = customAlphabet("0123456789", 6)();
  const confirmOTP = await bcrypt.hash(OTP, 10);
  const OTPExpire = Date.now() + 10 * 60 * 1000;

  findUser.confirmOTP = confirmOTP;
  findUser.OTPExpire = OTPExpire;
  await findUser.save();

  const emailTemplate = emailVerificationTemplate(OTP, findUser.name);
  await sendEmail(email, "Confirm Your Email Address", emailTemplate);

  res.status(200).json({
    success: true,
    message: "New OTP sent successfully",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email, isDeleted: false }).select(
    "+password",
  );
  if (!findUser) return next(new AppError(400, "Invalid Credential"));
  if (!findUser.isActive)
    return next(
      new AppError(400, `This email isn't active please check your email`),
    );
  const check = await bcrypt.compare(password, findUser.password);
  if (!check) return next(new AppError(400, "Invalid Credential"));
  const token = await jwtSign({ id: findUser._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.status(200).json({
    success: true,
    data: {
      accessToken: token,
      user: {
        id: findUser._id,
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
        isActive: findUser.isActive,
        image: findUser.image,
        createdAt: findUser.createdAt,
        updatedAt: findUser.updatedAt,
      },
    },
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const findUser = await User.findOne({ isDeleted: false, email });
  if (!findUser) return next(new AppError(400, "This user is not found"));

  const OTP = customAlphabet("0123456789", 6)();
  const hashedOTP = await bcrypt.hash(OTP, 10);
  const OTPExpire = Date.now() + 10 * 60 * 1000;

  findUser.resetOTP = hashedOTP;
  findUser.resetOTPExpire = OTPExpire;
  findUser.resetToken = undefined;
  await findUser.save();

  const emailTemplate = passwordResetOtpTemplate(OTP, findUser.name);
  await sendEmail(email, "Reset Password OTP", emailTemplate);

  res.status(200).json({
    success: true,
    message: "Reset OTP is sent to your email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const { token } = req.params;

  if (token) {
    const findUser = await User.findOne({
      isDeleted: false,
      resetToken: token,
    });
    if (!findUser)
      return next(new AppError(400, "The reset token is invalid or expired"));
    if (password.length < 6)
      return next(new AppError(400, "Password must 6 char or more"));

    const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUND);
    findUser.password = hashedPassword;
    findUser.resetToken = undefined;
    await findUser.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  }

  if (!email || !otp || !password)
    return next(new AppError(400, "Email, OTP and password are required"));

  const findUser = await User.findOne({ isDeleted: false, email }).select(
    "+password +resetOTP +resetOTPExpire",
  );
  if (!findUser) return next(new AppError(400, "This user is not found"));

  const check = await bcrypt.compare(otp, findUser.resetOTP || "");
  if (
    !check ||
    !findUser.resetOTP ||
    !findUser.resetOTPExpire ||
    findUser.resetOTPExpire < Date.now()
  )
    return next(new AppError(400, "Invalid or expired OTP"));

  if (password.length < 6)
    return next(new AppError(400, "Password must 6 char or more"));

  const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUND);
  findUser.password = hashedPassword;
  findUser.resetOTP = undefined;
  findUser.resetOTPExpire = undefined;
  await findUser.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
