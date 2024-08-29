import { Product } from "src/products/entities";
import { BeforeInsert,BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, length: 255,
     })
    email: string;

    @Column({ type: 'varchar', length: 255, select:false})
    password: string;

    @Column({ type: 'varchar', length: 255 })
    fullName: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column('text',{ array: true, default: ['user'] })
    roles: string[];

    //relacion de uno a mucho con producto: un usuario crea muchos productos
    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product

    @BeforeInsert()
    checkFieldsBeforeInsert()
    {
        this.email = this.email.toLocaleLowerCase().trim();        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate()
    {
        this.email = this.email.toLocaleLowerCase().trim();        
    }
}