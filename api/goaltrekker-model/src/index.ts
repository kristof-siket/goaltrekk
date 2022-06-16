import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { ObjectID } from "typeorm"
import { AppDataSource } from "./data-source"
import { ActionItem, Goal } from "./entity"
import { API_PORT } from "./utils/environment"

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

    console.log("Setting up Fastify...")

    const fastify = Fastify({
        logger: true,
    })

    fastify.register(cors, {
        origin: "*",
    })

    fastify.get('/goals', async (request, reply) => {
        const goals = await AppDataSource.manager.find(Goal)
        reply.send(goals)
    })

    fastify.get<{Params: {id: ObjectID }}>('/goals/:id',  async (request, reply) => {
        const id = request.params.id
        const goal = await AppDataSource.manager.findOne(Goal, {
            where: {
                id: id
            }
        })
        reply.send(goal)
    })

    fastify.post<{Body: Goal}>('/goals', async (request, reply) => {
        const goal = request.body
        await AppDataSource.manager.save(goal)
        reply.send(goal)
    })

    fastify.put<{Params: {id: ObjectID}, Body: Goal}>('/goals/:id', async (request, reply) => {
        const id = request.params.id
        const goal = request.body
        await AppDataSource.manager.update(Goal, id, goal)
        reply.send(goal)
    })

    fastify.delete<{Params: {id: ObjectID}}>('/goals/:id', async (request, reply) => {
        const id = request.params.id
        await AppDataSource.manager.delete(Goal, id)
        reply.send({})
    })


    const start = async () => {
        try {
          await fastify.listen({ port: parseInt(API_PORT) })
          console.log(`server listening on ${API_PORT}`)
        } catch (err) {
          fastify.log.error(err)
          process.exit(1)
        }
      }
      start()

}).catch(error => console.log(error))
