class UI {
  constructor() {
    this.title = document.querySelector("#goal-title");
    this.details = document.querySelector("#goal-details");
    this.submitGoal = document.querySelector("#goal-submit");
    this.goals = document.querySelector(".goals");
  }

  // show the goals in the list
  showGoals(goals) {
    const listGroup = document.createElement("ul");
    listGroup.className = "list-group";

    goals.forEach(goal => {
      const goalItem = this.buildGoalItem(
        goal.title,
        goal.description,
        goal.date
      );

      listGroup.appendChild(goalItem);
    });

    this.goals.innerHTML = listGroup.innerHTML;
  }

  addGoal(input) {
    const goalsList = this.goals.children[0];
    const newGoal = this.buildGoalItem(input.title, input.description);
    goalsList.appendChild(newGoal);
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
  buildGoalItem(title, description, date) {
    if (!date) {
      date = Date.now();
    }
    // Build the list item
    const goalItem = document.createElement("a");
    goalItem.setAttribute("href", "#");
    goalItem.className =
      "list-group-item list-group-item-action flex-column align-items-start";

    // Build the title div
    const titleContainer = document.createElement("div");
    titleContainer.className = "d-flex w-100 justify-content-between";

    const goalItemTitle = document.createElement("h5");
    goalItemTitle.className = "mb-2 h5";
    goalItemTitle.innerText = title;

    const goalItemCreationDate = document.createElement("small");
    goalItemCreationDate.innerText = `Created on ${date.toString()}`;

    titleContainer.appendChild(goalItemTitle);
    titleContainer.appendChild(goalItemCreationDate);

    // Build the description
    const goalItemDetails = document.createElement("p");
    goalItemDetails.className = "mb-2";
    goalItemDetails.textContent = description;

    // Put together
    goalItem.appendChild(titleContainer);
    goalItem.appendChild(goalItemDetails);

    return goalItem;
  }
}

export const ui = new UI();
