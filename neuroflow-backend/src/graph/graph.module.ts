import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Node} from './entities/node.entity';
import {Edge} from './entities/edge.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Node, Edge])],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
