import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Edge } from './edge.entity';

@Entity()
export class Node {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    label:string;

    @Column({nullable:true})
    description:string;

    @OneToMany(()=> Edge, (edge)=>edge.from)
    outgoing:Edge[];

    @OneToMany(()=> Edge,(edge)=>edge.to)
    incoming:Edge[];

}
