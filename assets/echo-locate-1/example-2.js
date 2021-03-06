
var example2 = function (selector, map_url) {

    var width=500;
    var height=300;

    var svg = d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    d3.json(map_url, function(err, geojson) {
	var projection = d3.geoMercator()
            .fitSize([width,height], geojson)
    
	var path = d3.geoPath()
            .projection(projection);


	svg.append('path')
            .attr('d', path(geojson));

        var color = d3.scaleOrdinal(d3['schemeCategory20']);

        var circles = [
            { 'lat' : 35.9940,
            'lng' : -78.8986,
            'rtt' : 6.0,
            'r' : 550*1.60934*1000,
            'name' : 'MX'
            }
        ];

        // setup tooltips
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return '<span>' + 'MX: 3ms timeout' + '</span>';
            });
        svg.call(tip);

        var highlight = function(d) {
            console.log(d);
            svg.selectAll('path.area')
                .data([d], function (d) {
                    return (d && d.name) || d3.select(this).attr("name");
                })
                .attr('opacity', '0.5')
                .exit()
                .attr('opacity', '0');

            tip.show(d);
        }

        var unhighlight = function(d) {
            tip.hide(d);
            svg.selectAll('path.area')
                .data(circles)
                .attr('opacity', '0.3')
        }

        for (var i in circles) {
            var elt = circles[i];
            var circumference = 6371000 * Math.PI * 2;

            // datacenter location
            var angle = 29000 / circumference * 360;
            elt.dc = d3.geoCircle().center([elt.lng,elt.lat]).radius(angle);

            // ping-derived area
            var angle = elt.r / circumference * 360;
            elt.area = d3.geoCircle().center([elt.lng,elt.lat]).radius(angle);

        }
	
	// use up some blue
	color(1);
	color(2);
	
        // ping-derived areas
        svg.selectAll('path.area')
            .data(circles)
            .enter()
            .append('path')
            .attr('class', 'area')
            .attr('name', function(d) { return d.name; })
            .attr('d', function(d) { return path(d.area()); })
            .attr('fill', function(d) { return color(d.name);} )
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '2,2')
            .attr('stroke-width', '2')
            .attr('opacity', '0.5');

        // datacenters
        svg.selectAll('path.dc')
            .data(circles)
            .enter()
            .append('path')
            .attr('class', 'dc')
            .attr('name', function(d) { return d.name; })
            .attr('d', function(d) { return path(d.dc()); })
            .attr('fill', function(d) { return color(d.name);} )
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('opacity', '1.0')
            .on('mouseover', highlight);

	var ex = document.querySelector(selector);
	var dc = ex.querySelector('path.dc');
	tip.show(circles[0], dc);



    })

}
