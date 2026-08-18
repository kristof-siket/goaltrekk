import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm"
import { ActionItem } from "./ActionItem"

@Entity()
export class Goal {

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    title: string

    @Column()
    description: string

    @Column({ type: 'timestamp with time zone' })
    date: Date

    @Column({ type: 'timestamp with time zone' })
    deadline: number

    @Column()
    category: string

    @Column()
    action_items: ActionItem[]

    @Column()
    closed: boolean

    @Column()
    conclusion: string
}
