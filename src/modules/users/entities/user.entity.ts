import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean' })
  is_active: boolean;
  
  @Column({
    type: "enum",
    enum: ["user", "admin", "master"],
    default: "user"
  })
  role: string;

  // @ManyToOne(() => Tenant, tenant => tenant.users, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'tenant_id' })
  // tenant: Tenant;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
