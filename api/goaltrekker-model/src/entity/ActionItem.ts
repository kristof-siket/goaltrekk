import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm"

@Entity()
export class ActionItem {
    @ObjectIdColumn()
    id: ObjectID

    @Column({ type: 'timestamp with time zone' })
    action_date: Date

    @Column()
    action_summary: string
}