import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { GraphModule } from './graph/graph.module';
import {Node} from './graph/entities/node.entity';
import {Edge} from './graph/entities/edge.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...TypeOrmConfig,
      entities: [Node, Edge],
    }),
    GraphModule,
  ],
})
export class AppModule {}
