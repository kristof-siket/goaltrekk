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
  const formInput = ui.getInputData();
  const postData = createGoalFromForm(formInput);

  http
    .post("http://localhost:3000/goals", postData)
    .then(data => {
      getGoals();
      ui.clearForm();
    })
    .catch(err => console.log(err));

  e.preventDefault();
}

// TODO: when category is implemented on form, add it to the object
function createGoalFromForm(formInput) {
  return {
    title: formInput.title,
    description: formInput.description,
    date: formInput.date,
    deadline: formInput.date,
    category: "General",
    action_items: [],
    closed: "false",
    conclusion: ""
  };
}
