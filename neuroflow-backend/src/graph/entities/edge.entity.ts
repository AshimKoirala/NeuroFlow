import {
    Entity, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Column,
    LimitOnUpdateNotSupportedError,
} from 'typeorm';
import {Node} from './node.entity'

 @Entity()
 export class Edge{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>Node, (node) => node.outgoing, {eager: true})
    @JoinColumn({name: 'fromId'})
    from: Node;

    @ManyToOne(()=>Node, (node) => node.incoming, {eager: true})
    @JoinColumn({name: 'toId'})
    to: Node;

    @Column({ default:1 })
    weight:number;
 }