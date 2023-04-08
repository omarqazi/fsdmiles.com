const startMiles = 130000000.0;
const startDateString = "2023-04-06T20:00:00Z";
const milesPerDay = 1000000.0;

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

function updateMilesCounter() {
  const milesCounter = document.getElementById("miles-counter");

  const update = () => {
    const currentMiles = getCurrentMiles(startMiles, startDateString, milesPerDay);
    milesCounter.textContent = Math.round(currentMiles).toLocaleString();
  };

  setInterval(update, 100); // Update 100 times a second
}

document.addEventListener("DOMContentLoaded", () => {
  updateMilesCounter();
});
