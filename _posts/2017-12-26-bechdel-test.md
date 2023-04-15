---
layout: post
title:  "The Bechdel Test, FiveThirtyEight, Rotten Tomatoes"
date:   2017-12-26 00:00:01 -0700
categories: latency ping icmp ttl rtt aws cloud server d3.js map 
published: false
---
<link rel="stylesheet" type="text/css" href="/assets/bechdel/style.css">
### TL;DR

<div id="bechdel-1"></div>

Each point in this figure represents one of the top 50 grossing films of 2016, positioned to reflect the number of positive reviews it recieved from top critics (x-axis), and negative reviews (y-axis), both according to [Rotten Tomatoes](https://www.rottentomatoes.com/).[^1] 

Points are further colored to reflect whether the film passes the [Bechdel Test](https://bechdeltest.com).[^2] Mouseover any point to see the film's name, and additional details.

### Introduction

[FiveThirtyEight](https://www.fivethirtyeight.com) recently published a [revisitation of the Bechdel Test](https://projects.fivethirtyeight.com/next-bechdel/)[^3]--a litmus for Womens' representation in film--in which they invited contributors to re-imagine the test, using new criteria.

The canonical Bechdel Test asks whether a film counts at least two named female characters in its cast, and whether they converse about subjects other than men. A rather low bar!

FiveThirtyEight's proposed variants consider the representation of other groups (e.g. Latinas), the role of female supporting cast, and the makeup of the film's crew.

How does a film's performance on the Bechdel Test compare with its critical reception? FiveThirtyEight scored the top-50 grossing films of 2016, on each of its Bechdel Test variants. This post joins those data with critical scores collected from Rotten Tomatoes.

### Rotten Tomatoes and Critical Opinion

Do top critics--those who write for large audiences, according to Rotten Tomatoes--prefer films that pass the Bechdel Test? Do they not? This sample suggests little preference, either way.

<div id="bechdel-2"></div>

What if a more inclusive sample of critics is consulted? Again, little preference is shown.

<div id="bechdel-3"></div>

### Critical Consensus

It's also worth wondering how well the two groups of critics agree, in general, since the ability to choose between them is a prominant feature of Rotten Tomatoes.

<div id="bechdel-4"></div>

They agree fairly well, at least for these 50 commercially successful films.

### Variations of the Bechdel Test

What about FiveThirtyEight's proposed Bechdel Test variations? Select a variant from the menu below to update the graph. For descriptions of each test, see [the article](https://projects.fivethirtyeight.com/next-bechdel/) on FiveThirtyEight.

<select onchange="testchange()" id="testselect">
	<option value="bechdel">Bechdel</option>
	<option value="peirce" selected="selected">Peirce</option>
	<option value="landau">Landua</option>
	<option value="feldman">Feldman</option>
	<option value="villareal">Villareal</option>
	<option value="hagen">Hagen</option>
	<option value="ko">Ko</option>
	<option value="villarobos">Villarobos</option>
	<option value="waithe">Waithe</option>
	<option value="koeze_dottle">Koeze-Dottle</option>
	<option value="uphold">Uphold</option>
	<option value="white">White</option>
	<option value=rees_davies>Rees-Davies</option>
</select>

<div id="bechdel-5"></div>

### Conclusion

The Bechdel Test, and its variations are a useful litmus to use when selecting a film. Combined with critical consensus, it offers a convenient means of avoiding the worst and most redundant films of the year.

Nevertheless, It's worth noting that the Bechdel Test alone is no guaruntee of quality.

**Comment** and **Suggestion** to **<mailto:patrick.mcmurchie@gmail.com>**

[^1]: [https://www.rottentomatoes.com/](https://www.rottentomatoes.com/)
[^2]: [http://bechdeltest.com/](http://bechdeltest.com/)
[^3]: [https://projects.fivethirtyeight.com/next-bechdel/](https://projects.fivethirtyeight.com/next-bechdel/)

<script src="https://d3js.org/d3.v4.js"></script>
<script src="https://d3js.org/d3-geo.v1.min.js"></script>
<script src="/assets/echo-locate-1/d3-tip.js"></script>
<!--<script src="/assets/bechdel/bechdel.js"></script>-->

<script>
var b1 = function(selector) {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 45, left: 55},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("/assets/bechdel/bechdel.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.top_up   = +d.top_up;
      d.top_down = +d.top_down;
      d.bechdel  = (+d.bechdel == 0) ? true : false;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.top_up; }));
  y.domain(d3.extent(data, function(d) { return d.top_down; }));

  var color = d3.scaleOrdinal(d3['schemeCategory10']);

  // setup tooltips
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
          return '<span class="t">' + d.movie + ': ' + d.top_critics + '%</span><br><span class="t">Bechdel Test: ' + ((d.bechdel) ? "passed" : "failed") + '</span>';
      });
  svg.call(tip);


  
  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.top_up); })
      .attr("cy", function(d) { return y(d.top_down); })
      .attr("fill", function(d) { return color(d.bechdel); } )
      .attr("opacity", 0.75)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Positive Reviews (Top Critics)");

   });


  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Negative Reviews");      
};


b1("#bechdel-1");
b1("#bechdel-2")

var b2 = function(selector) {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 45, left: 55},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("/assets/bechdel/bechdel.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.all_up   = +d.all_up -d.top_up;
      d.all_down = +d.all_down -d.top_down;
      d.bechdel  = (+d.bechdel == 0) ? true : false;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.all_up; }));
  y.domain(d3.extent(data, function(d) { return d.all_down; }));

  var color = d3.scaleOrdinal(d3['schemeCategory10']);


  // setup tooltips
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
          return '<span class="t">' + d.movie + ': ' + d.all_critics + '%</span><br><span class="t">Bechdel Test: ' + ((d.bechdel) ? "passed" : "failed") + '</span>';
      });
  svg.call(tip);

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.all_up); })
      .attr("cy", function(d) { return y(d.all_down); })
      .attr("fill", function(d) { return color(d.bechdel); } )
      .attr("opacity", 0.75)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Positive Reviews (All Critics)");

   });


  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Negative Reviews");      
};


b2("#bechdel-3");



var b3 = function(selector) {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 45, left: 55},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("/assets/bechdel/bechdel.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.top_critics   = +d.top_critics;
      d.all_critics = +d.all_critics;
      d.bechdel  = (+d.bechdel == 0) ? true : false;
  });

  // Scale the range of the data
  x.domain([0, 100]);
  y.domain([0, 100]);

  var color = d3.scaleOrdinal(d3['schemeCategory10']);


  // setup tooltips
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
          return '<span class="t">' + d.movie + ': ' + d.all_critics + '%</span><br><span class="t">Bechdel Test: ' + ((d.bechdel) ? "passed" : "failed") + '</span>';
      });
  svg.call(tip);

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.top_critics); })
      .attr("cy", function(d) { return y(d.all_critics); })
      .attr("fill", function(d) { return color(d.bechdel); } )
      .attr("opacity", 0.75)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Top Critics (% Positive)");

   });

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("All Critics (% Positive)");      
};


b3("#bechdel-4");

//
//



var b5 = function(selector) {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 45, left: 55},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("/assets/bechdel/bechdel.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.top_critics   = +d.top_critics;
      d.all_critics = +d.all_critics;
      d.bechdel  = (+d.bechdel == 0) ? true : false;
      d.peirce  = (+d.peirce == 0) ? true : false;
      d.landau  = (+d.landau == 0) ? true : false;
      d.feldman  = (+d.feldman == 0) ? true : false;
      d.villareal  = (+d.villareal == 0) ? true : false;
      d.hagen  = (+d.hagen == 0) ? true : false;
      d.ko  = (+d.ko == 0) ? true : false;
      d.villarobos  = (+d.villarobos == 0) ? true : false;
      d.waithe  = (+d.waithe == 0) ? true : false;
      d.koeze_dottle  = (+d.koeze_dottle == 0) ? true : false;
      d.uphold  = (+d.uphold == 0) ? true : false;
      d.white  = (+d.white == 0) ? true : false;
      d.rees_davies  = (+d['rees-davis'] == 0) ? true : false;
  });

  // Scale the range of the data
  x.domain([0, 100]);
  y.domain([0, 100]);

  var color = d3.scaleOrdinal(d3['schemeCategory10']);


  testchange = function() {
    var e = document.getElementById("testselect");
    var test = e.options[e.selectedIndex].value;
    console.log(e.options[e.selectedIndex].text);

    svg.selectAll("circle").data([]).exit().remove();


  // setup tooltips
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
          return '<span class="t">' + d.movie + ': ' + d.all_critics + '%</span><br><span class="t">' + test + ' test: ' + ((d[test]) ? "passed" : "failed") + '</span>';
      });
  svg.call(tip);

    svg.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.top_critics); })
      .attr("cy", function(d) { return y(d.all_critics); })
      .attr("fill", function(d) { return color(d[test]); } )
      .attr("opacity", 0.75)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
      

}

      testchange();

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Top Critics (% Positive)");

   });

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("All Critics (% Positive)");

};


b5("#bechdel-5");




</script>

