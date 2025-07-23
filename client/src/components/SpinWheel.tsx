// src/components/SpinWheel.tsx

import React, { useState } from "react";
import "./SpinWheel.css";
import rewardCodes from "./rewardCodes";  // should export an array of Google Pay codes, e.g. ['GPAY1001', 'GPAY1002', …]

let spinCount = 0;
let wheelAngle = 0;
const angles = [0, 90, 180, 270];
const rewards = ["₹100", "Try Again", "Try Again", "Try Again"];

const SpinWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [rewardCode, setRewardCode] = useState("");

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult("");
    setShowPopup(false);

    spinCount++;
    // Every 20th spin → ₹100 guaranteed
    const rewardIndex =
      spinCount % 20 === 0 ? 0 : Math.floor(Math.random() * 3) + 1;

    // Randomize rounds between 3–5
    const rounds = 3 + Math.floor(Math.random() * 3);
    const selectedAngle =
      wheelAngle + rounds * 360 + angles[rewardIndex];

    const wheel = document.getElementById("wheel");
    if (!wheel) return;

    // Reset transition & starting position
    wheel.style.transition = "transform 0s";
    wheel.style.transform = `rotate(${wheelAngle % 360}deg)`;

    // In two consecutive frames, apply the spin
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wheel.style.transition = "transform 2.5s ease-out";
        wheel.style.transform = `rotate(${selectedAngle}deg)`;
      });
    });

    wheelAngle = selectedAngle;

    // After animation ends
    setTimeout(() => {
      const outcome = rewards[rewardIndex];
      setResult(outcome);
      setIsSpinning(false);

      if (outcome === "₹100") {
        // Pick a random Google Pay redeem code
        const code =
          rewardCodes[Math.floor(Math.random() * rewardCodes.length)];
        setRewardCode(code);
        setShowPopup(true);
      }
    }, 2600);
  };

  return (
    <div className="spin-container">
      <h2 className="spin-title">
        🎯 Try your luck and get ₹100 Google Pay redeem code!
      </h2>

      <div className="wheel-wrapper">
        <div className="wheel" id="wheel">
          <div className="segment" style={{ background: "#4dd2ff" }}>
            Try Again
          </div>
          <div className="segment" style={{ background: "#4fff4d" }}>
            Try Again
          </div>
          <div className="segment" style={{ background: "#ffeb4d" }}>
            ₹100
          </div>
          <div className="segment" style={{ background: "#ff4444" }}>
            Try Again
          </div>
        </div>
        <div className="pointer"></div>
      </div>

      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </button>

      {result && <div className="result-text">🎁 {result}</div>}

      {showPopup && (
        <div className="popup animated">
          <div className="popup-content">
            <h3>🎉 Congratulations!</h3>
            <p>
              You’ve won a ₹100 Google Pay redeem code. Use it at checkout!
            </p>
            <div className="code-box">{rewardCode}</div>
            <button
              className="close-btn"
              onClick={() => setShowPopup(false)}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
