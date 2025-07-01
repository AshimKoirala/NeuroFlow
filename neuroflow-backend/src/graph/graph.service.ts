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
  ) {}

  async createNode(dto: CreateNodeDto) {
    const node = this.nodeRepo.create({ label: dto.label });
    return this.nodeRepo.save(node);
  }

  createEdge(dto: CreateEdgeDto) {
    return this.edgeRepo.save({
      from: { id: dto.fromId },
      to: { id: dto.toId },
      weight: dto.weight ?? 1,
    });
  }

  findAllNodes() {
    return this.nodeRepo.find({ relations: ['outgoing', 'incoming'] });
  }

  findAllEdges() {
    return this.edgeRepo.find({ relations: ['from', 'to'] });
  }

  async deleteNode(id: string) {
    await this.edgeRepo.delete({ from: { id } });
    await this.edgeRepo.delete({ to: { id } });
    return this.nodeRepo.delete(id);
  }

  async deleteEdge(id: string) {
    return this.edgeRepo.delete(id);
  }

  async traverseDFS(startId: string) {
    const start = await this.nodeRepo.findOne({
      where: { id: startId },
      relations: ['outgoing', 'incoming', 'outgoing.to'],
    });

    if (!start) throw new Error('Start node not found');
    return GraphTraversal.dfs(start);
  }

  async traverseBFS(startId: string) {
    const start = await this.nodeRepo.findOne({
      where: { id: startId },
      relations: ['outgoing', 'incoming', 'outgoing.to'],
    });

    if (!start) throw new Error('Start node not found');
    return GraphTraversal.bfs(start);
  }

  async getSementicRanking() {
    const nodes = await this.nodeRepo.find({
      relations: ['outgoing', 'outgoing.to'],
    });

    const result = PageRank.compute(nodes);

    return nodes
      .map((node) => ({
        id: node.id,
        label: node.label,
        rank: result.get(node.id),
      }))
      .sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0));
  }
}
