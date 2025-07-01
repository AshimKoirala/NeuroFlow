import { Body, Controller, Get, Param, Post,Delete } from '@nestjs/common';
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

    @Get('edges')
    findAllEdges() {
        return this.graphService.findAllEdges();
    }    

    @Get('dfs/:startId')
    traverseDFS(@Param('startId')startId:string){
        return this.graphService.traverseDFS(startId);
    }

     @Get('bfs/:startId')
    traverseBFS(@Param('startId')startId:string){
        return this.graphService.traverseBFS(startId);
    }

    @Get('rank')
    getRanking(){
        return this.graphService.getSementicRanking();
    }

    @Delete('node/:id')
    deleteNode(@Param('id') id: string) {
        return this.graphService.deleteNode(id);
    }
    
    @Delete('edge/:id')
    deleteEdge(@Param('id') id: string) {
    return this.graphService.deleteEdge(id);
    }
}
