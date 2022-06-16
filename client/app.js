import { http } from "./http";
import { ui } from "./ui";

// Load api base url from env
const apiBaseUrl = process.env.API_BASE_URL ?? 'https://0.0.0.0:5000';

// Get posts on DOM load
document.addEventListener("DOMContentLoaded", getGoals);

// Listen for Add Goal
document
  .querySelector("#goal-submit")
  .addEventListener("click", handleGoalSubmit);

// Listen for Delete Goal
document.querySelector(".goals").addEventListener("click", handleGoalDelete);

// Listen for Edit Goal
document.querySelector(".goals").addEventListener("click", handleGoalEdit);

// Listen for add action item
document.querySelector(".goals").addEventListener("click", handleGoalAddAction);

// Listen for submitting the action modal
document
  .querySelector(".action-submit")
  .addEventListener("click", handleGoalActionSubmit);

// Listen for Back from edit
document.querySelector("#goal-back").addEventListener("click", e => {
  ui.changeFormState("add");
  e.preventDefault();
});

// Fetch the goals to initialize the app
function getGoals() {
  http
    .get(`${apiBaseUrl}/goals`)
    .then(data => ui.showGoals(data))
    .catch(err => console.log(err));
}

// Handle submitting a new goal
function handleGoalSubmit(e) {
  const formInput = ui.getInputData();
  if (formInput.description !== "" && formInput.title !== "") {
    const postData = createGoalFromForm(formInput);

    if (formInput.id === "") {
      http
        .post(`${apiBaseUrl}/goals`, postData)
        .then(data => {
          getGoals();
          ui.clearForm();
          ui.showNotification("Goal added successfully.", "alert-success");
        })
        .catch(err =>
          ui.showNotification(
            "Something went wrong, goal could not be added. Please, try again.",
            "alert-danger"
          )
        );
    } else {
      // set the date to the current one (to update modification date)
      postData.date = new Date().toJSON();

      http
        .put(`${apiBaseUrl}/goals/${formInput.id}`, postData)
        .then(data => {
          getGoals();
          ui.changeFormState("add");
          ui.showNotification("Goal updated successfully.", "alert-success");
        })
        .catch(err =>
          ui.showNotification(
            "Something went wrong, goal could not be updated. Please, try again.",
            "alert-danger"
          )
        );
    }
  } else {
    ui.showNotification("Please, fill out both fields!", "alert alert-danger");
  }

  e.preventDefault();
}

// Handle removing an existing goal
function handleGoalDelete(e) {
  if (e.target.parentNode.classList.contains("remove-goal")) {
    const id = e.target.parentNode.dataset.id;
    console.log(id);

    if (id && confirm("Are you sure?")) {
      http
        .delete(`${apiBaseUrl}/goals/${id}`)
        .then(data => {
          getGoals();
          ui.showNotification("Goal deleted successfully.", "alert-success");
        })
        .catch(err =>
          ui.showNotification(
            "Something went wrong, goal could not be deleted. Please, try again.",
            "alert-danger"
          )
        );
    }
  }

  e.preventDefault();
}

// Handle UI request for editing an existing goal
function handleGoalEdit(e) {
  if (e.target.parentNode.classList.contains("edit-goal")) {
    const id = parseInt(e.target.parentNode.dataset.id);

    if (id) {
      // Spike: search for a better way to do complex traversing
      const title =
        e.target.parentElement.previousElementSibling.previousElementSibling
          .previousElementSibling.previousElementSibling.textContent;

      const description =
        e.target.parentElement.previousElementSibling.previousElementSibling
          .textContent;

      const formData = {
        id,
        title,
        description
      };

      ui.fillForm(formData);

      // Scroll to the top
      window.scrollTo(0, 0);
    }
  }

  e.preventDefault();
}

function handleGoalAddAction(e) {
  if (e.target.parentNode.classList.contains("add-action")) {
    const id = parseInt(e.target.parentNode.dataset.id);
    const actionSubmitButton = document.querySelector(".action-submit");

    actionSubmitButton.dataset.id = id;
    console.log(actionSubmitButton);
  }
  e.preventDefault();
}

function handleGoalActionSubmit(e) {
  const id = parseInt(e.target.dataset.id);

  http
    .get(`${apiBaseUrl}/goals/${id}`)
    .then(data => {
      data.action_items.push({
        action_date: new Date(),
        action_summary: ui.getActionSummary()
      });
      http
        .put(`${apiBaseUrl}/${id}`, data)
        .then(data => {
          getGoals();
          ui.changeFormState("add");
          ui.showNotification(
            "Action item added successfully.",
            "alert-success"
          );
        })
        .catch(err =>
          ui.showNotification(
            "Something went wrong, goal could not be updated. Please, try again.",
            "alert-danger"
          )
        );
    })
    .catch(err => ui.showNotification(err, "alert-danter"));
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
