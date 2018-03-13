---
layout: post
title:  "Comparing Randonneur Bags and Panniers"
date:   2018-03-13 00:00:01 -0700
categories: randonneur bag "rando bag" pannier comparison
---

<link rel="stylesheet" type="text/css" href="/assets/rando-bags/datatables.min.css">
<script src="/assets/rando-bags/jquery.min.js"></script>
<script src="/assets/rando-bags/datatables.min.js"></script>
<style>
    .dt-right {
        text-align: right;
    }
</style>

This is a quick post about randonneur bags and panniers, containing some overblown criticisms of product review sites, as well as some dubious comparisons of my own.

### A Critique of Outdoor Gear Lab

Outdoor Gear Lab publish methodical reviews of outdoor equipment in various categories (carabiners, ropes, and cams for climbers; frames, tires, and bags for cyclists). 

In general, Outdoor Gear Lab do a pretty good job. I place greater weight on their reviews because of their policy of buying equipment for review (instead of accepting gifts, which might influence their assessments).

But they make their money from affiate links--a form of sales commission only offered by the largest outdoor retailers. If a product isn't available on Amazon or REI, for instance, Outdoor Gear Lab pretend it doesn't exist.

In some categories--headlamps for instance--this isn't a problem: there aren't a lot of smaller companies making them, or relying on direct sales.

But in a category like bike bags, smaller operations--*Swift Industries*, *North St.*, and *Gilles Berthoud*, to name a few--make some of the best, and a lot is lost by ignoring them.

### Quantitative Comparisons

Rigid handlebar bags (aka rando bags) are probably the most useful bags you can put on a bike, because they're so easily accessed while riding. But per unit of capacity, they tend to cost more than other options, and may weigh more as well.

There may be ways to minimize those differences--larger rando bags might be expected to offer better value, and weigh less per Liter of capacity. How do a range of randonneur bags, in different sizes, compare with panniers and bikepacking-style framebags?

The table below contains 30+ bags from Ortlieb, Gilles Berthoud, Apidura, Revelate, Swift Industries, and North St. You can sort according to Dollars-per-Liter and Liters-per-Ounce, which I think make particularly useful comparisons.  

<table id="table1">
<thead>
<tr>
<th>maker</th>
<th>type</th>
<th>bag</th>
<th>material</th>
<th>Oz</th>
<th>L</th>
<th>$</th>
<th>L/Oz</th>
<th>$/L</th>
</tr>
</thead>
</table>

Okay, whoah, that's a lot of bags. I'd like to offer a couple of observations. The Apidura and Revelate bags clearly offer the best deal in terms of Liters-per-Ounce, but aren't really in the same category as the other handlebar bags, which are rigid and easily accessible. 

In other words: I'm a patient guy, but there's a limit to how long I'm willing to spend searching for my Cliff Bar (and zero chance I'll dismount my bike to look for it). Bikepacking-style handlebar bags aren't really for me.

Also, Larger randonneur bags, like the Hinterland Ozette from Swift Industries weigh as little per Little as conventional Ortlieb rear panniers. Pretty surprising! (Worth noting that mounting hardware--racks and decaleurs--aren't included in the comparison.)

### Aesthetics

What's most striking to me in the comparisons above, is how similar these bags all are. For a given type of bag, and capacity, there isn't a whole lot of variation in weight or price. So what should really drive the choice of a new bag? Probably aesthetics. Your bags ought to look correct. 

For me that suggests bags made from newfangled materials like X-Pac, but in woodsy colors; whereas for Eroica types, that probably means leather and waxed canvas.

**Comments and Suggestions** to <mailto:patrick.mcmurchie@gmail.com>





<script>

$(document).ready(function() {
    $('#table1').DataTable( {
        "ajax": { 'url' : '/assets/rando-bags/all-bags.txt',
            "dataSrc" : 'data' },
        'paging' : false,
        'info' : false,
        'searching' : true,
        'columns' :  [
            { 'visible' : false }, // make
            { 'visible' : false }, // type
            { 'width' : '20%'}, // bag
            { 'visible' : false }, // material
            { 'className': 'dt-right', 'render' : $.fn.dataTable.render.number(',', '.', 0, '') }, // weight
            { 'className': 'dt-right', 'render' : $.fn.dataTable.render.number(',', '.', 1, '') }, // capacity
            { 'className': 'dt-right', 'render' : $.fn.dataTable.render.number( ',','.', 0, '$') }, // cost
            { 'className': 'dt-right', 'render' : $.fn.dataTable.render.number(',', '.', 2, '') },
            { 'className': 'dt-right','render' : $.fn.dataTable.render.number( ',','.', 2, '$') },
        ]
    } );
} );

</script>