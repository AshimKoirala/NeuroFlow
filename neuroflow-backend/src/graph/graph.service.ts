import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './entities/edge.entity';
import { Node } from './entities/node.entity';
import { CreateEdgeDto } from './dto/create-edge.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { GraphTraversal } from './algorithms/traversal';
import { PageRank } from './algorithms/ranking';

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

    async traverseDFS(startId: string){
        const start = await this.nodeRepo.findOne({
            where:{id:startId},
            relations:['outgoing','incoming','outgoing.to'],
        });
        if (!start) throw new Error('Start node not found');

        const result = GraphTraversal.dfs(start);
        return result;
    }

    async traverseBFS(startId:string){
        const start = await this.nodeRepo.findOne({
            where:{id: startId},
            relations:['outgoing','incoming','outgoing.to'],
        });
        if (!start) throw new Error('Start node not found');
        const result = GraphTraversal.bfs(start);
        return result;
    }

    async getSementicRanking(){
        const nodes = await this.nodeRepo.find({
            relations: ['outgoing', 'outgoing.to'],
        });

        const result = PageRank.compute(nodes);

        //return with node labels
        const output = nodes.map((node)=>({
            id: node.id,
            label: node.label,
            rank: result.get(node.id),
        }));

        // sort rank descending
        return output.sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0)); 
    }
}



