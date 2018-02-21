var activate = function(selector, json_url, w, h) {

    // establish color scale, and initalize its domain. 
    var color     = d3.scaleOrdinal(d3['schemeCategory20']);

    // get the data
    d3.json(json_url, function(error, data) {
	    var nodes = []
	    data.nodes.forEach(function(node) {
		    nodes[node['id']] = node;
        });
        console.log(nodes);
        
        //var links = data.edges;
        var links = [];
        data.edges.forEach(function(edge) {
            edge.source = nodes[edge.source];
            edge.target = nodes[edge.target];
        });
        var links = data.edges;

	    var width = w,
	    height = h;

        var circle_size = function() {
            return 5;
        }

        var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

	    var svg = d3.select(selector).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "figure");

        var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.freq); });
  
        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", function(d) { return color(d.provider); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
  
        node.append("title")
            .text(function(d) { return d.id; });
    
        simulation
            .nodes(nodes)
            .on("tick", ticked);
    
        simulation.force("link")
            .links(links);
    
        function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        }
    });
    
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}