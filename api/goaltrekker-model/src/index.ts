import { AppDataSource } from "./data-source"
import { ActionItem, Goal } from "./entity"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new goal into the database...")
    const goal = new Goal()
    goal.title = "Test goal"
    goal.description = "This is a test goal"
    goal.date = new Date()
    goal.deadline = new Date().getTime() + (1000 * 60 * 60 * 24 * 7)
    goal.category = "Test"
    goal.action_items = [
    ]
    goal.closed = false
    goal.conclusion = ""


    // Push some actions to the goal
    const actionItem1 = new ActionItem()
    actionItem1.action_date = new Date()
    actionItem1.action_summary = "Test action item 1"
    goal.action_items.push(actionItem1)

    const actionItem2 = new ActionItem()
    actionItem2.action_date = new Date()
    actionItem2.action_summary = "Test action item 2"
    goal.action_items.push(actionItem2)
    

    await AppDataSource.manager.save(goal)
    console.log("Saved a new goal with id: " + goal.id)

    console.log("Loading goals from the database...")
    const goals = await AppDataSource.manager.find(Goal)
    console.log("Loaded goals: ", goals)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
