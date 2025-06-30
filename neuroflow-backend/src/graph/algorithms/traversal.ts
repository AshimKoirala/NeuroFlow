import {Node} from '../entities/node.entity'

export class GraphTraversal{
    //dfs -- resursive

    static dfs(start:Node, visited= new Set<string>(), result:Node[]=[]): Node[]{
        if(!start || visited.has(start.id)) return result;

        visited.add(start.id);
        result.push(start);

        for (const edge of start.outgoing ?? []){ //null-safe
            this.dfs(edge.to, visited, result);
        }

        return result;
    }

    //bfs --iterative

    static bfs(start:Node): Node[]{
        if (!start) return [];

        const visited = new Set<string>();
        const result: Node[]=[];
        const queue: Node[] =[start];

        while (queue.length >0){
            const current = queue.shift()!;
            if(visited.has(current.id)) continue;

            visited.add(current.id);
            result.push(current);

            for(const edge of current.outgoing ?? []){ //null-safe
                if(!visited.has(edge.to.id)) queue.push(edge.to);
            }
        }

        return result;
    }

}