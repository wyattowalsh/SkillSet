import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Visualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 1024;
    const height = 768;

    const force = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(60).strength(2.5))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    d3.csv('/assets/test-data/mySkills.csv').then((links) => {
      const nodes: any = {};

      links.forEach((link: any) => {
        link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
        link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
        link.value = +link.value;
      });

      const path = svg.append('g')
        .selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .attr('class', (d: any) => `link ${d.type}`)
        .attr('marker-end', 'url(#end)');

      const node = svg.selectAll('.node')
        .data(Object.values(nodes))
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
          .on('start', (event: any, d: any) => {
            if (!event.active) force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event: any, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event: any, d: any) => {
            if (!event.active) force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }));

      node.append('circle')
        .attr('r', 5)
        .style('fill', (d: any) => d3.scaleOrdinal(d3.schemeCategory10)(d.name));

      node.append('text')
        .attr('x', 14)
        .attr('dy', '.45em')
        .text((d: any) => d.name);

      force.nodes(Object.values(nodes))
        .on('tick', () => {
          path.attr('d', (d: any) => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
          });

          node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        });

      svg.append('defs').selectAll('marker')
        .data(['end'])
        .enter()
        .append('marker')
        .attr('id', String)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -1.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5');
    });
  }, []);

  return (
    <svg ref={svgRef} width="1024" height="768"></svg>
  );
};

export default Visualization;
