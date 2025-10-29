import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';

@Entity('tenants')
export class Tenant { }
