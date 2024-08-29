import { BeforeInsert, BeforeUpdate,Column, Entity, OneToMany, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities/user.entity";

@Entity( { name: 'products'} )
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
         unique:true,
    })
    title:string;

    @Column('float', {
        default:0
    })
    price: number;

    @Column({
        type: 'text',
        nullable:true,
    })
    description: string;

    @Column({
        type: 'text',
        unique:true,
    })
    slug: string;

    @Column('int', {
        default:0
    })
    stock: number;

    @Column('text',{
        array: true
    })
    sizes: string[];
	
    @Column('text')
    gender: string;

    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];
  

    //image: esto no es una columna es una relacion
    @OneToMany(
       () => ProductImage,
       (productImage) => productImage.product,
       { cascade: true, eager:true } //eager permite que se cargue los valores d ela sentidades asociadas
    )
    images?: ProductImage[];

    //relacion de mucho a uno con usuario, un usuario puede crear muchos productos
    @ManyToOne(
        () => User,
        ( user ) => user.product,
        {eager:true} //podra mostrar quien realizo el producto.
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
       if( !this.slug )
        {
            this.slug = this.title;
        }
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
    }
    
    //@BeforeUpdate()
    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }
}