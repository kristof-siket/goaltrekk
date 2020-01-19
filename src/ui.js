class UI {
  constructor() {
    this.title = document.querySelector("#goal-title");
    this.details = document.querySelector("#goal-details");
    this.submitGoal = document.querySelector("#goal-submit");
    this.goals = document.querySelector(".goals");
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

  showNotification(message, className) {
    // Find the location on the UI
    const formEnd = document.querySelector(".formEnd");
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
      title: this.title.value,
      description: this.details.value,
      date: new Date().toJSON()
    };
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
          <h6 class="card-subtitle mb-2 text-muted">Created on <p class="text-muted">${date}</p></h6>
          <p class="card-text">${description}</p>
          <a href="#" class="remove-goal card-link" data-id="${id}">
            <i style="color: red" class="fa fa-remove"></i>
          </a>
        </div>
      </div><br>`;

    return listElement;
  }
}

export const ui = new UI();
