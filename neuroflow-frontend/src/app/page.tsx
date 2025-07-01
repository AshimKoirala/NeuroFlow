'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import GraphCanvas from '@/components/GraphCanvas';
import { UINode, UIEdge } from '@/types/graph';

export default function HomePage() {
  const [nodes, setNodes] = useState<UINode[]>([]);
  const [edges, setEdges] = useState<UIEdge[]>([]);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [weight, setWeight] = useState(1);

  // Fetch data from backend
  const fetchGraph = async () => {
    setLoading(true);
    const [nodeRes, edgeRes, rankRes] = await Promise.all([
      api.get('/graph/nodes'),
      api.get('/graph/edges'),
      api.get('/graph/rank'),
    ]);

    const rankMap = new Map<string, number>();
    rankRes.data.forEach((r: any) => rankMap.set(r.id, r.rank));

    const nodes: UINode[] = nodeRes.data.map((n: any) => ({
      id: n.id,
      label: n.label,
      rank: rankMap.get(n.id) || 0.1,
    }));

    const edges: UIEdge[] = edgeRes.data.map((e: any) => ({
      id: e.id,
      from: { id: e.from.id, label: e.from.label },
      to: { id: e.to.id, label: e.to.label },
      weight: e.weight,
    }));

    setNodes(nodes);
    setEdges(edges);
    setLoading(false);
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  // create node
  const handleAddNode = async () => {
    if (!label.trim()) return;
    await api.post('/graph/node', { label });
    setLabel('');
    fetchGraph();
  };

  // delete node
  const handleDeleteNode = async (id: string) => {
    await api.delete(`/graph/node/${id}`);
    fetchGraph();
  };

  //add edge
  const handleAddEdge = async () => {
    if (!fromId || !toId || fromId === toId) return alert("Invalid selection");
  
    await api.post('/graph/edge', {
      fromId,
      toId,
      weight,
    });

    setFromId('');
    setToId('');
    setWeight(1);
    fetchGraph();
  }; 
  
  const handleDeleteEdge = async (id: string) => {
    await api.delete(`/graph/edge/${id}`);
    fetchGraph();
  };
  
  return (
    <main className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">NeuroFlow 🧠 – Plot your idea into graph</h1>

      {/* Add Node UI */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter idea label"
          className="text-black px-3 py-2 rounded"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button
          onClick={handleAddNode}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Node
        </button>
      </div>

      {/* Add Edge UI */}
      <div className="flex gap-2 mb-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm mb-1">From</label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="text-black px-2 py-1 rounded"
          >
            <option value="">Select node</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">To</label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="text-black px-2 py-1 rounded"
          >
            <option value="">Select node</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Weight</label>
          <input
            type="number"
            value={weight}
            min={1}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="text-black px-2 py-1 rounded w-20"
          />
        </div>

        <button
          onClick={handleAddEdge}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Edge
        </button>
      </div>


      {/* List & Delete Nodes */}
      <div className="mb-6 max-h-60 overflow-y-auto">
        <h2 className="font-semibold mb-2 text-lg">Existing Nodes:</h2>
        <ul className="space-y-2">
          {nodes.map((node) => (
            <li key={node.id} className="flex items-center justify-between bg-zinc-800 px-3 py-2 rounded">
              <span>{node.label}</span>
              <button
                onClick={() => handleDeleteNode(node.id)}
                className="text-red-400 hover:text-red-600 transition"
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* List & Delete Edges */}
      <div className="mb-6 max-h-60 overflow-y-auto">
        <h2 className="font-semibold mb-2 text-lg">Existing Edges:</h2>
        <ul className="space-y-2">
          {edges.map((edge) => (
            <li
              key={edge.id}
              className="flex items-center justify-between bg-zinc-800 px-3 py-2 rounded"
            >
              <span>
                {edge.from.label} ➝ {edge.to.label} (weight: {edge.weight})
              </span>
              <button
                onClick={() => handleDeleteEdge(edge.id)}
                className="text-red-400 hover:text-red-600 transition"
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      </div>


      {/* Graph */}
      {!loading ? (
        <GraphCanvas nodes={nodes} edges={edges} />
      ) : (
        <p className="text-gray-400">Loading graph...</p>
      )}
    </main>
  )
}