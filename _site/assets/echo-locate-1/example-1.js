
var example1 = function (selector, map_url) {

    var width=500;
    var height=300;

    var svg = d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var projection = d3.geoMercator()
        .scale(width/2/Math.PI)
        .translate([width/2, height/2]);

    var path = d3.geoPath()
        .projection(projection);

    d3.json(map_url, function(err, geojson) {
        svg.append('path')
            .attr('d', path(geojson));

        var color = d3.scaleOrdinal(d3['schemeCategory20']);

        var circles = [
            { 'lat' : 44.0582,
            'lng' : -121.3153,
            'rtt' : 29.0,
            'r' : 1800*1.60934*1000,
            'name' : 'us-west-2'
            },
            { 'lat' : 36.7468,
            'lng' : -119.7726,
            'rtt' : 27.2,
            'r' : 1689*1.60934*1000,
            'name' : 'us-west-1'
            },
            {
                'lat' : 37.4008594,
                'lng' : -79.3185905,
                'rtt' : 71.0,
                'r' : 4408*1.6093*1000,
                'name' : 'us-east-1'
            },
            {
                'lat' : 40.103706,
                'lng' : -83.199873,
                'rtt' : 68.7,
                'r' : 4265*1.60934*1000,
                'name' : 'us-east-2'
            },
            {
                'lat' : 1.3143394,
                'lng' : 103.7041618,
                'rtt' : 184.0,
                'r' : 11425*1.60934*1000,
                'name' : 'ap-southeast-1'
            },
            {
                'lat' : 45.4987,
                'lng' : -73.5793,
                'rtt' : 83.8,
                'r'   : 5203*1.60934*1000,
                'name' : 'ca-central-1'
            },
            {
                'lat' : 37.5652894,
                'lng' : 126.849464,
                'rtt' : 83.8,
                'r'   : 8258*1.60934*1000,
                'name' : 'ap-northeast-2'
            }
        ];

        // setup tooltips
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return '<span>' + d.name + ': ' + d.rtt + 'ms' + '</span>';
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
            var angle = 200000 / circumference * 360;
            elt.dc = d3.geoCircle().center([elt.lng,elt.lat]).radius(angle);

            // ping-derived area
            var angle = elt.r / circumference * 360;
            elt.area = d3.geoCircle().center([elt.lng,elt.lat]).radius(angle);

        }
        console.log(circles);
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
            .attr('opacity', '0.3');

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
            .on('mouseover', highlight)
            .on('mouseout', unhighlight);






    })

}