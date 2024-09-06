
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function draw_network_graph(data, options) {
    const { selector, width, height, marginTop, marginBottom, marginLeft, marginRight } = options;
    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-20))
        .force("center", d3.forceCenter(width / 2, height / 2));
    
    
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }



    const link = g.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("classed", "show")
        .attr("data-src", d => d.source.id)
        .attr("data-tgt", d => d.target.id)
        .attr("data-src-value", d => d.source.id)
        .attr("data-tgt-value", d => d.target.id)
        .attr("data-distance", d => d.value)
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = g.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("classed", "show")
        .attr("data-id", d => d.id)
        .attr("data-value", d => d.id)
        .attr("data-connected-nodes", d => d.connected_nodes_list.join(","))
        .attr("r", 5)
        .attr("fill", "#00f");

    node.append("title")
        .text(d => d.id);
    
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
    return svg.node();
}

export { draw_network_graph };

