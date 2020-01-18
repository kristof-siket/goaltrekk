import { http } from "./http";
import { ui } from "./ui";

// Fetch all the goals onload
// Get posts on DOM load
document.addEventListener("DOMContentLoaded", getGoals);

// Listen for Add Goal
document
  .querySelector("#goal-submit")
  .addEventListener("click", handleGoalSubmit);

// Fetch the goals to initialize the app
function getGoals() {
  http
    .get("http://localhost:3000/goals")
    .then(data => ui.showGoals(data))
    .catch(err => console.log(err));
}

// Handle submitting a new goal
function handleGoalSubmit(e) {
  console.log(e.target);
  e.preventDefault();
}
