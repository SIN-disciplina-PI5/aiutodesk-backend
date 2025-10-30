import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

export enum TenantStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    subdomain?: string;

    // @ManyToOne(() => Plan, { nullable: false, eager: true })
    // plan: Plan;

    @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.ACTIVE })
    status: TenantStatus;

    @Column({ type: 'timestamp' })
    activation_date: Date;

    @Column({ type: 'jsonb', nullable: true })
    custom_settings?: Record<string, any>;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
