
var activate = function(selector, json_url, w, h, curvy) {

    // establish color scale, and initalize its domain. 
    var color = d3.scale.category20();
    for (var i = 1; i < 21; i++) {
	color(i);
    }
    // get the data
    d3.json(json_url, function(error, data) {
	    var links = data.links;
	    var nodes = {}
	    data.nodes.forEach(function(node) {
		    nodes[node['id']] = node;
		    console.log(node);
		});

	    // Compute the distinct nodes from the links.
	    links.forEach(function(link) {
		    link.source = nodes[link.source];
		    link.target = nodes[link.target];
		    link.value += 1;
		});

	    var width = w,
	    height = h;

	    var circle_size = function(group) {
		if (group == 9)
		    return 15;
		else
		    return 10;
	    };

	    var replacer = function(key, value) {
		console.log(value);
		if (typeof value == 'string') {
		    console.log(value);
		    return value.replace(/\n/g, '<br>');
		}
		return value;
    
	    };

	    var force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
	    .size([width, height])
	    .linkDistance(60)
	    .charge(-300)
	    .on("tick", tick)
	    .start();


	    var svg = d3.select(selector).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "figure");

	    var tip = d3.tip()
	    .attr('class', 'd3-tip')
	    .offset([-10, 0])
	    .html(function(d) {
		    return "<span style='color:white'>" + d.simple_name + "</span>" + (d.def.length == 0 ? '' : "<p class='explain'>" + JSON.stringify(d.def, replacer, 2) + "</p>");
		});

	    svg.call(tip);

	    // build the arrow.
	    svg.append("svg:defs").selectAll("marker")
	    .data(["end"])  // Different link/path types can be defined here
	    .enter().append("svg:marker")  // This section adds in the arrows
	    .attr("id", String)
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 15)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	    .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5");

	    // add the links and the arrows
	    var path = svg.append("svg:g").selectAll("path")
	    .data(force.links())
	    .enter().append("svg:path")
	    //.attr("class", function(d) { return "link " + d.type; })
	    .attr("class", "link")
	    .attr("marker-end", "url(#end)");

	    // define the nodes
	    var node = svg.selectAll(".node")
	    .data(force.nodes())
	    .enter().append("g")
	    .attr("class", "node")
	    .call(force.drag)
	    .on('mouseover', tip.show)
	    .on('mouseout', tip.hide)
	    .on('mousedown', tip.show);

	    node.append("circle")
	    .attr("r", function(d) { return circle_size(d.group)})
	    .attr("fill", function(d) { return color(d.group); });
    
	    function tick() {
		path.attr("d", function(d) {
			var dx = d.target.x - d.source.x,
			    dy = d.target.y - d.source.y,
			    dr = (curvy ? Math.sqrt(dx * dx + dy * dy) : 0);
			    //    dr = Math.sqrt(dx * dx + dy * dy);
			// straight lines: dr = 0;
			return "M" + 
			    d.source.x + "," + 
			    d.source.y + "A" + 
			    dr + "," + dr + " 0 0,1 " + 
			    d.target.x + "," + 
			    d.target.y;
		    });

		node
		    .attr("transform", function(d) { 
			    return "translate(" + d.x + "," + d.y + ")"; });
	    }

	});

};