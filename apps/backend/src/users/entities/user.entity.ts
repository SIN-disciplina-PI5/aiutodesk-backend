import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    //@Index()
    //@Column()
    //tenant_id: number;

    @Column()
    name: string;

    @Index({ unique: true })
    @Column({ length: 255})
    email: string;

    @Column({ length: 255})
    password: string;

    @Column()
    is_active: boolean;

  @Column({
    type: "enum",
    enum: ["user", "admin", "master"],
    default: "user"
  })
  role: string;
}