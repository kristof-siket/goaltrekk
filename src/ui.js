class UI {
  constructor() {
    this.title = document.querySelector("#goal-title");
    this.details = document.querySelector("#goal-details");
    this.submitGoal = document.querySelector("#goal-submit");
    this.goals = document.querySelector(".goals");
  }

  // show the goals in the list
  showGoals(goals) {
    const goalsList = this.goals.children[0];
    let listContent = "";

    goals.forEach(goal => {
      const goalItem = document.createElement("li");
      goalItem.className =
        "list-group-item d-flex justify-content-between align-items-center";
      goalItem.innerText = goal.title;
      goalsList.appendChild(goalItem);
    });
  }
}

export const ui = new UI();
