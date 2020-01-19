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
