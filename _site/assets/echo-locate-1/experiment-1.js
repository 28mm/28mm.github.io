var experiment1 = function (selector, map_url) {

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

        var circles = [{'name': 'ap-northeast-1', 'rtt': 136, 'r': 13630463, 'lat': 35.673540799999998, 'lng': 139.57030169999999}, {'name': 'ap-northeast-2', 'rtt': 166, 'r': 16647275, 'lat': 37.565289399999997, 'lng': 126.84946399999998}, {'name': 'ap-south-1', 'rtt': 261, 'r': 26092336, 'lat': 19.082522300000001, 'lng': 72.741098300000004}, {'name': 'ap-southeast-1', 'rtt': 190, 'r': 19012038, 'lat': 1.3143393999999999, 'lng': 103.70416180000001}, {'name': 'ap-southeast-2', 'rtt': 201, 'r': 20125467, 'lat': -33.847356700000006, 'lng': 150.65178380000003}, {'name': 'ca-central-1', 'rtt': 112, 'r': 11199047, 'lat': 45.498699999999999, 'lng': -73.579300000000003}, {'name': 'eu-central-1', 'rtt': 173, 'r': 17365677, 'lat': 50.121347899999996, 'lng': 8.4964796000000007}, {'name': 'eu-west-1', 'rtt': 165, 'r': 16531155, 'lat': 53.324443099999996, 'lng': -6.3857878000000001}, {'name': 'eu-west-2', 'rtt': 158, 'r': 15809655, 'lat': 51.5287352, 'lng': -0.38178270000000003}, {'name': 'sa-east-1', 'rtt': 186, 'r': 18608117, 'lat': -23.5505, 'lng': -46.633299999999998}, {'name': 'us-east-1', 'rtt': 85, 'r': 8550680, 'lat': 37.400859400000002, 'lng': -79.318590499999999}, {'name': 'us-east-2', 'rtt': 89, 'r': 8992874, 'lat': 40.103706000000003, 'lng': -83.199872999999997}, {'name': 'us-west-1', 'rtt': 27, 'r': 2781674, 'lat': 36.7468, 'lng': -119.7726}, {'name': 'us-west-2', 'rtt': 14, 'r': 1482573, 'lat': 44.058199999999999, 'lng': -121.31529999999999}];

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
                .attr('opacity', '0.1')
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
            .attr('opacity', '0.1');

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