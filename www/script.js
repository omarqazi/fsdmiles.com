const startMiles = 150000000.0;
const startDateString = "2023-04-19T20:00:00Z";
const milesPerDay = 1538461.0;
const fsdCrashesPerMillionMiles = 0.31;
const manualTeslaCrashesPerMillionMiles = 0.68;
const usFleetCrashesPerMillionMiles = 1.53;

function getMilesPerSecond(milesPerDay) {
  const secondsInADay = 24 * 60 * 60;
  return milesPerDay / secondsInADay;
}

function getCurrentMiles(startMiles, startDateString, milesPerDay) {
  const startDate = new Date(startDateString);
  const currentTime = new Date();
  const millisecondsSinceStart = currentTime - startDate;
  const secondsSinceStart = millisecondsSinceStart / 1000;
  const milesPerSecond = getMilesPerSecond(milesPerDay);
  return startMiles + (milesPerSecond * secondsSinceStart);
}

function crashesPrevented(milesDriven) {
  var millionMilesDriven = milesDriven / 1000000.0;
  var crashesIfHumanDriven = millionMilesDriven * manualTeslaCrashesPerMillionMiles;
  var crashesOnAutopilot = millionMilesDriven * fsdCrashesPerMillionMiles;
  var crashesPrevented = crashesIfHumanDriven - crashesOnAutopilot;
  return crashesPrevented;
}

function updateMilesCounter() {
  const milesCounter = document.getElementById("miles-counter");
  const crashesCounter = document.getElementById("crashes-counter");

  const update = () => {
    const currentMiles = getCurrentMiles(startMiles, startDateString, milesPerDay);
    const currentCrashesPrevented = crashesPrevented(currentMiles);
    milesCounter.textContent = Math.round(currentMiles).toLocaleString();
    crashesCounter.textContent = Math.floor(currentCrashesPrevented).toLocaleString() + " crashes prevented";
  };

  setInterval(update, 100); // Update 100 times a second
}

document.addEventListener("DOMContentLoaded", () => {
  updateMilesCounter();
});
