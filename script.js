const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const setButton = document.getElementById("set");
const quickFiveButton = document.getElementById("quickFive");
const minuteDisplay = document.getElementById("minuteDisplay");
const secondDisplay = document.getElementById("secondDisplay");
const statusText = document.getElementById("status");
const progressBar = document.getElementById("progress");

let totalSeconds = getInputSeconds();
let remainingSeconds = totalSeconds;
let timerId = null;

function getInputSeconds() {
  const m = clamp(parseInt(minutesInput.value, 10) || 0, 0, 999);
  const s = clamp(parseInt(secondsInput.value, 10) || 0, 0, 59);
  minutesInput.value = m;
  secondsInput.value = s;
  return m * 60 + s;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  minuteDisplay.textContent = String(minutes).padStart(2, "0");
  secondDisplay.textContent = String(seconds).padStart(2, "0");

  const ratio = totalSeconds === 0 ? 0 : (totalSeconds - remainingSeconds) / totalSeconds;
  progressBar.style.width = `${Math.min(100, ratio * 100)}%`;
}

function setTimer() {
  stopTimer();
  totalSeconds = getInputSeconds();
  remainingSeconds = totalSeconds;
  updateDisplay();
  statusText.textContent = totalSeconds === 0 ? "1秒以上に設定してください。" : "時間をセットしました。";
  startButton.textContent = "スタート";
}

function tick() {
  if (remainingSeconds <= 0) {
    stopTimer();
    statusText.textContent = "完了！";
    pulse();
    return;
  }
  remainingSeconds -= 1;
  updateDisplay();
}

function toggleTimer() {
  if (timerId) {
    stopTimer();
    statusText.textContent = "一時停止中";
    startButton.textContent = "再開";
  } else {
    if (remainingSeconds === 0) {
      remainingSeconds = totalSeconds || 0;
    }
    if (remainingSeconds === 0) {
      statusText.textContent = "1秒以上に設定してください。";
      return;
    }
    timerId = setInterval(tick, 1000);
    statusText.textContent = "カウント中...";
    startButton.textContent = "一時停止";
    tick();
  }
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function resetTimer() {
  stopTimer();
  remainingSeconds = totalSeconds;
  updateDisplay();
  statusText.textContent = "リセットしました。";
  startButton.textContent = "スタート";
}

function pulse() {
  progressBar.style.width = "100%";
  progressBar.animate(
    [
      { transform: "scaleX(1)", filter: "drop-shadow(0 0 0px rgba(6, 182, 212, 0.6))" },
      { transform: "scaleX(1.02)", filter: "drop-shadow(0 0 16px rgba(6, 182, 212, 0.8))" },
      { transform: "scaleX(1)" }
    ],
    {
      duration: 700,
      iterations: 2
    }
  );
}

startButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);
setButton.addEventListener("click", setTimer);
quickFiveButton.addEventListener("click", () => {
  minutesInput.value = 5;
  secondsInput.value = 0;
  setTimer();
});

minutesInput.addEventListener("change", setTimer);
secondsInput.addEventListener("change", setTimer);

updateDisplay();
