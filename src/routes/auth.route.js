const { signUp, confirmEmail, resendOTP, login, forgetPassword, resetPassword } = require("../controllers/auth.controller")

const router = require("express").Router()

router.route("/signup").post(signUp)
router.route("/confirm-email").post(confirmEmail)
router.route("/resend-otp").post(resendOTP)
router.route("/login").post(login)
router.route("/forget-password").post(forgetPassword)
router.route("/reset-password").post(resetPassword)
router.route("/reset-password/:token").post(resetPassword)

module.exports = router