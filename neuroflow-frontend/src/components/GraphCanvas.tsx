'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { UINode, UIEdge } from '@/types/graph';

interface Props {
  nodes: UINode[];
  edges: UIEdge[];
}

export default function GraphCanvas({ nodes, edges }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // render graph only if nodes exist; edges can be empty
    if (!ref.current || nodes.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = 800;
    const height = 600;

    const sizeScale = d3.scaleLinear()
      .domain([0, d3.max(nodes, (d) => d.rank || 0.1)!])
      .range([10, 50]);

    // convert edges to D3 format
    const flatEdges = edges.length > 0 ? edges.map(e => ({
      source: e.from.id,
      target: e.to.id,
      weight: e.weight,
    })) : [];

    // setup force simulation with nodes and edges
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(flatEdges).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // draw edges
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(flatEdges)
      .enter()
      .append('line')
      .attr('stroke-width', (d) => Math.sqrt(d.weight));

    // draw nodes
    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => sizeScale(d.rank || 0.1))
      .attr('fill', '#0070f3')
      .call(
        d3.drag<SVGCircleElement, UINode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // draw labels
    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', 'white')
      .style('text-shadow', '0 0 2px white')
      .style('pointer-events', 'none')
      .style('font-size', '12px');

    // update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);

      label
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);
    });

    // drag event handlers
    function dragstarted(event: any, d: UINode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: UINode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: UINode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [nodes, edges]);

  return (
    <svg
      ref={ref}
      width="100%"
      height="600"
      className="border rounded bg-zinc-900"
    />
  );
}
