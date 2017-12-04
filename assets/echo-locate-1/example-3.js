var example3 = function (selector, map_url) {
    
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
                .attr('d', path(geojson))
	        .attr('opacity', '0.8');
    
            //var color = d3.scaleOrdinal(d3['schemeCategory20']);    
	    var color = function(d) {
		if (d == 'aws')
		    return '#FF9900';
		else if (d == 'google')
		    return '#008744';
		else
		    return '#007fff';	
	    }
	    // aws
            var aws = [{"lat": 37.4008594, "lng": -79.3185905, "name": "us-east-1", "provider": "aws"}, {"lat": 40.103706, "lng": -83.199873, "name": "us-east-2", "provider": "aws"}, {"lat": 36.7468, "lng": -119.7726, "name": "us-west-1", "provider": "aws"}, {"lat": 44.0582, "lng": -121.3153, "name": "us-west-2", "provider": "aws"}, {"lat": 45.4987, "lng": -73.5793, "name": "ca-central-1", "provider": "aws"}, {"lat": 53.324443099999996, "lng": -6.3857878, "name": "eu-west-1", "provider": "aws"}, {"lat": 51.5287352, "lng": -0.38178270000000003, "name": "eu-west-2", "provider": "aws"}, {"lat": 35.6735408, "lng": 139.5703017, "name": "ap-northeast-1", "provider": "aws"}, {"lat": 37.5652894, "lng": 126.84946399999998, "name": "ap-northeast-2", "provider": "aws"}, {"lat": 19.0825223, "lng": 72.7410983, "name": "ap-south-1", "provider": "aws"}, {"lat": 50.121347899999996, "lng": 8.4964796, "name": "eu-central-1", "provider": "aws"}, {"lat": 1.3143394, "lng": 103.70416180000001, "name": "ap-southeast-1", "provider": "aws"}, {"lat": -33.847356700000006, "lng": 150.65178380000003, "name": "ap-southeast-2", "provider": "aws"}, {"lat": -23.5505, "lng": -46.6333, "name": "sa-east-1", "provider": "aws"}];
	    
	    // google
	    var gcp = [{"lat": 45.5946, "lng": -121.1787, "name": "us-west1", "provider": "google"}, {"lat": 41.2619, "lng": -95.8608, "name": "us-central1", "provider": "google"}, {"lat": 39.0438, "lng": -77.4874, "name": "us-east4", "provider": "google"}, {"lat": 33.196, "lng": 80.0131, "name": "us-east1", "provider": "google"}, {"lat": -23.5505, "lng": -46.6333, "name": "southamerica-east1", "provider": "google"}, {"lat": 50.4491, "lng": 3.8184, "name": "europe-west1", "provider": "google"}, {"lat": 51.5074, "lng": -0.1278, "name": "europe-west2", "provider": "google"}, {"lat": 50.1109, "lng": 8.6821, "name": "europe-west3", "provider": "google"}, {"lat": 19.076, "lng": 72.8777, "name": "asia-south1", "provider": "google"}, {"lat": 1.3521, "lng": 103.8198, "name": "asia-southeast1", "provider": "google"}, {"lat": 23.6978, "lng": 120.9605, "name": "asia-east1", "provider": "google"}, {"lat": 35.6895, "lng": 139.6917, "name": "asia-northeast1", "provider": "google"}, {"lat": -33.8688, "lng": 151.2093, "name": "australia-southeast1", "provider": "google"}];
	    
	    var circles = aws.concat(gcp);

            // setup tooltips
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return '<span>' + '('+ d.provider + ') '+ d.name + '</span>';
                });
            svg.call(tip);
    
            var highlight = function(d) {
		tip.show(d);
            }
    
            var unhighlight = function(d) {
                tip.hide(d);
            }
	    
            for (var i in circles) {
                var elt = circles[i];
                var circumference = 6371000 * Math.PI * 2;
    
                // datacenter location
                var angle = 200000 / circumference * 360;
                elt.dc = d3.geoCircle().center([elt.lng,elt.lat]).radius(angle);
    
            }
    
            // datacenters
            svg.selectAll('path.dc')
                .data(circles)
                .enter()
                .append('path')
                .attr('class', 'dc')
		.attr('provider', function(d) { return d.provider; } )
                .attr('name', function(d) { return d.name; })
                .attr('d', function(d) { return path(d.dc()); })
                .attr('fill', function(d) { return color(d.provider); } )
                .attr('stroke-width', 1)
                .attr('stroke', 'black')
                .attr('opacity', '1.0')
                .on('mouseover', highlight)
                .on('mouseout', unhighlight);
    
    
    
    
    
    
        })
    
    }
