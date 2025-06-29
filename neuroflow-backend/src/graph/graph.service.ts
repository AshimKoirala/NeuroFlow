import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './entities/edge.entity';
import { Node } from './entities/node.entity';
import { CreateEdgeDto } from './dto/create-edge.dto';
import { CreateNodeDto } from './dto/create-node.dto';

@Injectable()
export class GraphService {
    constructor(
        @InjectRepository(Node)
        private nodeRepo: Repository<Node>,
        @InjectRepository(Edge)
        private edgeRepo: Repository<Edge>,
    ){}

    createNode(dto: CreateNodeDto){
        const node = this.nodeRepo.create(dto);
        return this.nodeRepo.save(node);
    }

    createEdge(dto: CreateEdgeDto){
        return this.edgeRepo.save({
            from:{ id: dto.fromId},
            to: {id: dto.toId},
            weight: dto.weight ?? 1,
        });
    }

    findAllNodes(){
        return this.nodeRepo.find({ relations:['outgoing','incoming']});
    }

    findAllEdges(){
        return this.edgeRepo.find();
    }
}



