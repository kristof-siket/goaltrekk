class UI {
  constructor() {
    this.id = document.querySelector("#id");
    this.title = document.querySelector("#goal-title");
    this.details = document.querySelector("#goal-details");
    this.submitGoal = document.querySelector("#goal-submit");
    this.goals = document.querySelector(".goals");
    this.back = document.querySelector("#goal-back");
    this.action_summary = document.querySelector("#action-summary");
  }

  // show the goals in the list
  showGoals(goals) {
    let listItemHtml = "";

    goals.forEach(goal => {
      const goalItem = this.buildGoalItem(
        goal.title,
        goal.description,
        goal.date,
        goal.id
      );

      listItemHtml += goalItem;
    });

    this.goals.innerHTML = listItemHtml;
  }

  // fill the form with a goal data
  fillForm(formData) {
    this.id.value = formData.id;
    this.title.value = formData.title;
    this.details.value = formData.description;

    this.changeFormState("edit");
  }

  changeFormState(selectedMode) {
    if (selectedMode === "edit") {
      this.submitGoal.textContent = "Update Goal";
      this.submitGoal.className = "btn btn-warning btn-block";

      this.back.style = "display: block";
    } else if (selectedMode === "add") {
      this.submitGoal.textContent = "Add Goal";
      this.submitGoal.className = "btn btn-primary btn-block";
      this.back.style = "display: none";

      // clear the id to represent "nothing is selected" mode
      this.id.value = "";

      // also clear the form
      this.clearForm();
    }
  }

  // show notification in a selected style and with a selected message
  showNotification(message, className) {
    // if there is already an alert, remove it
    if (document.querySelector(".alert")) {
      this.clearAlert();
    }

    // Find the location on the UI
    const container = document.querySelector(".mainFormContainer");

    // Build up the notification
    const notification = document.createElement("div");
    notification.className = `alert alert-dismissible ${className}`;

    notification.innerHTML = `
      <button type="button" class="close" data-dismiss="alert">&times;</button>
      <strong>${message}</strong>
    `;

    // Add the notification to the DOM
    container.insertBefore(notification, this.goals);

    // Remove the noti with timeout
    setTimeout(() => this.clearAlert(), 3000);

    // Scroll to the top
    window.scrollTo(0, 0);
  }

  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }

  getInputData() {
    return {
      id: this.id.value,
      title: this.title.value,
      description: this.details.value,
      date: new Date().toJSON()
    };
  }

  getActionSummary() {
    return this.action_summary.value;
  }

  clearForm() {
    this.title.value = "";
    this.details.value = "";
  }

  // Build up a goal list item
  buildGoalItem(title, description, date, id) {
    if (!date) {
      date = new Date();
    }

    const listElement = `
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">${title}</h4>
          <h6 class="card-subtitle mb-2 text-muted">Last modified on <p class="text-muted">${date}</p></h6>
          <p class="card-text">${description}</p>
          <a href="#" class="remove-goal card-link" data-id="${id}" data-toggle="tooltip" data-placement="top" title="Remove goal">
            <i style="color: red" class="fa fa-remove"></i>
          </a>
          <a href="#" class="edit-goal card-link" data-id="${id}" data-toggle="tooltip" data-placement="top" title="Edit goal">
            <i style="color: blue" class="fa fa-pencil"></i>
          </a>
          <a href="#" data-toggle="modal"
              data-target="#basicExampleModal" class="add-action card-link" data-id="${id}" data-toggle="tooltip" data-placement="top" title="Add action item">
            <i style="color: green" class="fa fa-plus"></i>
          </a>
        </div>
      </div><br>`;

    return listElement;
  }
}

export const ui = new UI();
