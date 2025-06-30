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
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = 800;
    const height = 600;

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight));

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', '#0070f3')
      .call(
        d3.drag<SVGCircleElement, UINode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', 'white');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.from.x!)
        .attr('y1', d => d.from.y!)
        .attr('x2', d => d.to.x!)
        .attr('y2', d => d.to.y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

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
