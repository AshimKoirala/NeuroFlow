'use client'

import GraphCanvas from "@/components/GraphCanvas";
import api from "@/lib/api";
import { UIEdge, UINode } from "@/types/graph";
import { useEffect, useState } from "react";

export default function HomePage(){
  const [nodes, setNodes] = useState<UINode[]>([]);
  const [edges, setEdges] = useState<UIEdge[]>([]);

  useEffect(()=>{
    const fetchGraph = async()=>{
      const [nodeRes,edgeRes]= await Promise.all([
        api.get('/graph/nodes'),
        api.get('/graph/edges'),

      ]);

      const nodes:UINode[] = nodeRes.data.map((n: any)=>({
        id: n.id,
        label:n.label,
      }));

      const edges: UIEdge[] = edgeRes.data.map((e:any)=>({
        id:e.id,
        from:{ id: e.from.id, label:e.from.label },
        to:{id:e.to.id, label: e.to.label },
        weight:e.weight,
      }));

      setNodes(nodes);
      setEdges(edges);
    };
    fetchGraph();
  },[]);

  return(
    <main className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Neuroflow🧠 - Idea Graph</h1>
      <GraphCanvas nodes={nodes} edges={edges}/>
    </main>
  )
}