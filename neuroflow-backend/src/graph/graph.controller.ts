import { Body, Controller, Get, Post } from '@nestjs/common';
import { GraphService } from './graph.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { CreateEdgeDto } from './dto/create-edge.dto';

@Controller('graph')
export class GraphController {
    constructor(private readonly graphService: GraphService ){}

    @Post('node')
    createNode(@Body() dto: CreateNodeDto){
        return this.graphService.createNode(dto);
    }
    @Post('edge')
    createEdge(@Body() dto: CreateEdgeDto){
        return this.graphService.createEdge(dto);
    }

    @Get('nodes')
    findAllNodes() {
        return this.graphService.findAllNodes();
    }

    @Get('edge')
    findAllEdges() {
        return this.graphService.findAllEdges();
    }    
}
