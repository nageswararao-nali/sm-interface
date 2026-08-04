import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Logo from "../../images/light_- vertical.png";
import { userCheck, apiError, socialLogin, checkUserMobile, otpCheck, logoutUserSuccess } from "../../store/actions";
import { FaTruck } from "react-icons/fa";

const Login = (props) => {
  const navigate = useNavigate();
  const [mobno, setMobno] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("mobile"); // "mobile" | "otp"
  const [verifyClicked, setVerifyClicked] = useState(false);

  // Step 1: mobile found → send OTP and show OTP input
  useEffect(() => {
    if (props.isUserFound && mobno.length > 0) {
      props.checkUserMobile({ mobile: mobno });
      setStep("otp");
    }
  }, [props.isUserFound]);

  // Step 2: OTP verified → navigate to dashboard
  useEffect(() => {
    if (verifyClicked && props.error === "success") {
      const timer = setTimeout(() => {
        navigate("/dashboard/tours");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [props.error, props.message]);

  const handleSendOtp = async () => {
    if (mobno.length < 10) return;
    await props.userCheck({ mobile: mobno, user_type: "Manager" });
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) return;
    props.logoutUserSuccess(); // resets error → "" so the next success is a real state change
    setVerifyClicked(true);
    props.otpCheck({ mobile: mobno, otp });
  };

  const handleMobileKeyDown = (e) => { if (e.key === "Enter") handleSendOtp(); };
  const handleOtpKeyDown   = (e) => { if (e.key === "Enter") handleVerifyOtp(); };

  const isOtpSuccess = verifyClicked && props.error === "success";

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 bg-brand-500 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <FaTruck size={28} className="text-white" />
          <span className="text-white text-2xl font-bold tracking-tight">GoodMove</span>
        </div>
        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Manage your fleet<br />smarter, faster.
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Real-time tracking, bookings, and driver management — all in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Tours", "Live Tracking", "Invoices", "Analytics"].map((f) => (
            <span key={f} className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 md:hidden">
            <img src={Logo} alt="GoodMove" className="h-12 object-contain" />
          </div>

          <div className="bg-white rounded-2xl shadow-card-lg p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {step === "mobile" ? "Welcome back" : "Verify OTP"}
              </h1>
              <p className="text-gray-500 text-sm">
                {step === "mobile"
                  ? "Enter your mobile number to continue"
                  : `Code sent to ${mobno}`}
              </p>
            </div>

            <div className="space-y-4">
              {/* Mobile field — always visible, locked after OTP step */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={mobno}
                    disabled={step === "otp"}
                    onChange={(e) => setMobno(e.target.value)}
                    onKeyDown={handleMobileKeyDown}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition
                      ${step === "otp"
                        ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 text-gray-900 placeholder-gray-400"}`}
                  />
                  {step === "otp" && (
                    <button
                      onClick={() => { setStep("mobile"); setOtp(""); setVerifyClicked(false); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-xs font-semibold hover:text-brand-600"
                      style={{ width: "auto", padding: "0", background: "none", color: "#30A46C" }}
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              {/* OTP field — shown only in step 2 */}
              {step === "otp" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    One-Time Password
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter OTP"
                    value={otp}
                    autoFocus
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={handleOtpKeyDown}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-center text-xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
              )}

              {/* Action button */}
              {step === "mobile" ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-150 text-sm tracking-wide"
                >
                  Send OTP
                </button>
              ) : (
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-150 text-sm tracking-wide"
                >
                  {isOtpSuccess ? "✓ Verified! Redirecting..." : "Verify & Continue"}
                </button>
              )}

              {/* Error / status message */}
              {props.message && step === "otp" && (
                <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                  isOtpSuccess
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  <span>{isOtpSuccess ? "✓" : "✕"}</span>
                  <span>{props.message}</span>
                </div>
              )}

              {step === "mobile" && props.message && (
                <p className="text-red-500 text-xs text-center font-medium">{props.message}</p>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} GoodMove. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { error, isUserFound, message } = state.Login;
  return { error, isUserFound, message };
};

export default connect(mapStateToProps, {
  userCheck,
  apiError,
  socialLogin,
  checkUserMobile,
  otpCheck,
  logoutUserSuccess,
})(Login);

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  socialLogin: PropTypes.func,
  userCheck: PropTypes.func,
  checkUserMobile: PropTypes.func,
  otpCheck: PropTypes.func,
  isUserFound: PropTypes.bool,
  message: PropTypes.string,
};
