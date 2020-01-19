import { http } from "./http";
import { ui } from "./ui";

// Get posts on DOM load
document.addEventListener("DOMContentLoaded", getGoals);

// Listen for Add Goal
document
  .querySelector("#goal-submit")
  .addEventListener("click", handleGoalSubmit);

// Listen for Delete Goal
document.querySelector(".goals").addEventListener("click", handleGoalDelete);

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

// Handle removing an existing goal
function handleGoalDelete(e) {
  if (e.target.parentNode.classList.contains("remove-goal")) {
    const id = parseInt(e.target.parentNode.dataset.id);

    // Todo: add ui response for successful delete.
    if (id && confirm("Are you sure?")) {
      http
        .delete(`http://localhost:3000/goals/${id}`)
        .then(data => {
          getGoals();
          // ui.showNotification("Goal deleted successfully.", style);
        })
        .catch(err => console.log(err));
    }
  }

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
