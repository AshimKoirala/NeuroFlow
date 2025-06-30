import { Node } from "../entities/node.entity";

export class PageRank{
    static compute(nodes:Node[], iterations=20, damping=0.85): Map<string, number>{
       const N =nodes.length;
       const scores = new Map<string, number>();

       //initialize score of each node to 1/N
       nodes.forEach((node)=> scores.set(node.id, 1/N));

       for (let i=0; i< iterations; i++){
        const newScores= new Map<string, number>();

        nodes.forEach((node)=>{
            let rankSum =0;

            nodes.forEach((otherNode)=>{
                let rankSum=0;

                nodes.forEach((otherNode)=>{
                    const isLinked = otherNode.outgoing.some((e)=> e.to.id ===node.id);
                    if (isLinked){
                        const outDegree = otherNode.outgoing.length || 1;
                        rankSum += scores.get(otherNode.id)! / outDegree;
                    }
                });

                const newScore =(1- damping)/ N + damping * rankSum;
                newScores.set(node.id, newScore);
            });
            newScores.forEach((v,k)=> scores.set(k,v));
        })
       }

       return scores;
    }
}