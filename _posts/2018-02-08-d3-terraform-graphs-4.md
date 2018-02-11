---
layout: post
title:  "Exploring Terraform Graphs With D3.js Part 4"
date:   2018-02-10 00:00:01 -0700
categories: terraform graph visualization d3 
---

<script src="/assets/terraform-graphs-4/jquery.slim.min.js"></script>
<!--<script src="/assets/terraform-graphs-4/bootstrap.min.js"></script>-->
<script src="/assets/terraform-graphs-4/fontawesome-all.min.js"></script>

<script src="/assets/terraform-graphs-4/d3.v4.js"></script>
<script src="/assets/terraform-graphs-4/d3-tip.js"></script>
<script src="/assets/terraform-graphs-4/blast-radius.js"></script>
<script src="/assets/terraform-graphs-4/categories.js"></script>
<script src="/assets/terraform-graphs-4/svg-pan-zoom.js"></script>
<script src="/assets/terraform-graphs-4/selectize.js"></script>

<!--<link rel="stylesheet" type="text/css" href="/assets/terraform-graphs-4/bootstrap.min.css">-->
<link rel="stylesheet" type="text/css" href="/assets/terraform-graphs-4/selectize.css">
<link rel="stylesheet" type="text/css" href="/assets/terraform-graphs-4/style.css">



### TL;DR

This is the fourth in a series of posts about *[Blast Radius](/blast-radius-docs/)*, a tool for producing interactive visualizations of *Terraform* dependency graphs.

Part three (parts: [one](/notes/d3-terraform-graphs), [two](/notes/d3-terraform-graphs-2), [three](/notes/terraform-graphs-3), [four](/notes/d3-terraform-graphs-4)) introduced module support, and a marginal improvement in the width of some figures, but stopped short of capably handling large real-world graphs.

<img src="/assets/terraform-graphs-4/7-modules.svg">

The figure above (with interactions *disabled*) demonstrates the issue: when configurations grow beyond a certain threshold, relationships between resources become harder to follow. This post considers several partial solutions.

### Pan and Zoom

Thus far the best way of navigating larger graphs has been the browser's scrolling and zoom features. But these are mind-meltingly awkward, for our purpose.

One issue is that browser-zoom applies globally, magnifying unrelated features to grotesque proportions, or causing them to vanish&mdash;just as the graph comes fully into view.

And the less said about horizontal scrolling, the better. *[svg-pan-zoom.js](https://github.com/ariutta/svg-pan-zoom)* implements click-and-drag panning, as well as various zooming mechanisms--the scrollwheel seems most natural to me.

<button id="pz-zoom-out" class="btn"><i class="fas fa-search-minus"></i></button>
<button id="pz-zoom-in" class="btn"><i class="fas fa-search-plus"></i></button>
<button id="pz-download" class="btn"><i class="fas fa-download"></i></button>
<div id="pz"></div>

This example is somewhat hampered by its small size and mail-slot proportions. Better examples, on broader canvas, such as [this](https://28mm.github.io/blast-radius-docs/examples/terraform-provider-aws/networking/) are available [here](https://28mm.github.io/blast-radius-docs/examples/)

(These features are badly broken on mobile, now, where pan and zoom gestures had worked well-enough, previously. Apologies if you are reading this on a phone or tablet!)

### Search

Pan and zoom work best when the resource of interest along with resources related to it are already selected. Until then, panning isn't a very efficient means of exploration.

<form class="form-inline my-2 my-lg-0" id="graph-search-form" >
<select style="width: 100%" id="graph-search"></select>
</form>
<button id="graph-zoom-out" class="btn"><i class="fas fa-search-minus"></i></button>
<button id="graph-zoom-in" class="btn"><i class="fas fa-search-plus"></i></button>
<button id="graph-download" class="btn"><i class="fas fa-download"></i></button>
<div id="graph"></div>

There are some rough edges to be worked out, but it does what's needed.

### Prune to Sub-Graph

Here is the same graph, again (with interactions *disabled*). 

<img src="/assets/terraform-graphs-4/7-modules.svg">

And below is the same graph with a single resource highlighted, along with its dependencies and dependents. This is an improvement, especially with pan and zoom, but less helpful in cases where the subgraph is not as contained in one region of the figure.

<img src="/assets/terraform-graphs-4/7-modules-selected.svg">

The *prune to selection* button generates a new figure with only the selected resource's dependencies and dependents.

<img src="/assets/terraform-graphs-4/7-modules-pruned.svg">

Sub-graphs retain the color scheme from the larger diagram, but their layout differs (often dramtically). Unfortunately, it isn't easily possible to bias *Graphviz* in favor of its previous layout; nodes jump around with abandon.


### Docker Support

One annoyance often met by new users is *Blast Radius*' reliance on recent versions of Python (3.5+), and Graphviz. Docker is a convenient way to hide the sordid details of Python versioning and package management. 

An update image is available from the docker registry as `28mm/blast-radius`. If the current working directory contains a terraform project, invoke it like so:

````bash
[...]$ docker run --cap-add=SYS_ADMIN -it --rm -p 5000:5000 -v $(pwd):/workdir:ro 28mm/blast-radius
````

Further discussion can be found in the README. Thanks to Buc and Daniel for contributing this.

### Performance

A further limitation--beyond layout and navigability--for larger graphs is performance. I've had reports of graphs taking 10+ minutes to generate! A lower bound for runtime is `terraform graph | dot -Tsvg`, since *Blast Radius* depends on both these programs.

Some testing with larger projects would be useful. (If anyone reading this, who has an especially large project, wishes to help: I'm interested in `time terraform graph | dot -Tsvg` vs `time blast-radius --svg`)

### Conclusion And Next Steps

Thus concludes a somewhat delayed chronicle of incremental progress. Thanks for reading this far, and as always:

 **Comment** and **Suggestion** to **<mailto:patrick.mcmurchie@gmail.com>**.

<script>


blastradius('#pz', '/assets/terraform-graphs-4/pz-demo.svg', '/assets/terraform-graphs-4/pz-demo.json');


blastradius('#graph', '/assets/terraform-graphs-4/search-demo.svg', '/assets/terraform-graphs-4/search-demo.json');

</script>