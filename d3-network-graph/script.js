/* globals draw_network_graph */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { draw_network_graph } from './network-graph.js';

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetch('miserables.json').then(response => response.json());
    const options = {
        "selector": "#network-graph",
        "width": 800,
        "height": 600,
        "marginTop": 10,
        "marginBottom": 10,
        "marginLeft": 10,
        "marginRight": 10,
    }

    const pre_process_data = (data) => {
        let nodes = data.nodes.map(function(d){
            d["connected_nodes_list"] = data.links.filter(l => l.source === d.id || l.target === d.id).map(l => l.source === d.id ? l.target : l.source);
            return d;
        });
        let links = data.links.map(d => d);
        return { nodes, links };
    }

    draw_network_graph(pre_process_data(data), options);

    const $search = document.querySelector('#search');
    const $results = document.querySelector('#search-results');

    $search.addEventListener('input', (event) => {
        const value = event.target.value.toLowerCase();
        $results.innerHTML = ''; // Clear previous results

        if (value === "") {
            d3.selectAll('circle').attr('fill', '#00f').attr("stroke", "#00f");
            d3.selectAll('line').style('stroke', '#999');
            return;
        }
    
        d3.selectAll('circle').attr('fill', null).attr("stroke", "#fff");
        d3.selectAll('line').style('stroke', null);
    
        d3
            .selectAll('circle')
            .filter((d, i) => d.id.toLowerCase().includes(value) || d.connected_nodes_list.some(node => node.toLowerCase().includes(value)))
            .attr("stroke", "red")
            .attr("fill", "red");


        const matchedLines = d3
            .selectAll('line')
            .filter((d, i) => d.source.id.toLowerCase().includes(value) || d.target.id.toLowerCase().includes(value))
            .style("stroke", "red");

        matchedLines.each(function(d) {
            const resultItem = document.createElement('li');
            resultItem.innerHTML = `<strong>${d.source.id}</strong> -> <strong>${d.target.id}</strong> -: ${d.value}`;
            $results.appendChild(resultItem);
        });
    });
});
