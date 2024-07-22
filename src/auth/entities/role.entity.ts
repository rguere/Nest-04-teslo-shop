import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity'

@Entity('Roles')
export class Role{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'varchar', unique:true, length:255})
    name: string;

    @ManyToMany( () => User, user =>user.roles)
    users: User[];
}