import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FaTruck } from "react-icons/fa";
import { loginSuccess, otpCheck } from "../../store/actions";

const Otpverify = (props) => {
  const { mobileno } = useParams();
  const [otp, setOtp] = useState("");
  const [verifyClicked, setVerifyClicked] = useState(false);
  const navigate = useNavigate();

  const handleOTPVerification = async () => {
    setVerifyClicked(true);
    await props.otpCheck({ mobile: mobileno, otp });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleOTPVerification();
  };

  useEffect(() => {
    if (verifyClicked && props.error === "success") {
      const timer = setTimeout(() => {
        navigate("/dashboard/tours");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [props.error, props.message]);

  const isSuccess = props.error === "success";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 p-2.5 rounded-xl">
              <FaTruck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GoodMove</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify OTP</h1>
            <p className="text-gray-500 text-sm">
              Enter the 4-digit code sent to{" "}
              <span className="font-semibold text-gray-700">{mobileno}</span>
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                One-Time Password
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="• • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <button
              onClick={handleOTPVerification}
              className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-150 text-sm tracking-wide"
            >
              Verify & Continue
            </button>

            {props.message && (
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                  isSuccess
                    ? "bg-brand-50 text-brand-700 border border-brand-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                <span>{isSuccess ? "✓" : "✕"}</span>
                <span>{props.message}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} GoodMove. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { error, message } = state.Login;
  return { error, message };
};

export default connect(mapStateToProps, { otpCheck })(Otpverify);
