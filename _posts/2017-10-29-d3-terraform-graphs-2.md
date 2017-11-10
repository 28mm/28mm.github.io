---
layout: post
title:  "Exploring Terraform Graphs With D3.js Part 2"
date:   2017-10-29 00:00:00 -0700
categories: terraform devops d3 d3.js graphs
---
<link rel="stylesheet" type="text/css" href="/assets/terraform-graphs-2/style.css">

### TL;DR

This is the second in a series of posts exploring methods of visualizing Terraform dependency graphs, with the goal of producing a tool useful for learning and documentation. ([part one](/notes/d3-terraform-graphs), [part two](/notes/d3-terraform-graphs-2), [code](https://www.github.com/28mm/blast-radius).)

<div id="demo1"></div>

The [first post](/notes/d3-terraform-graphs)[^1] presented experiments with Graphviz and D3.js, resulting in a promising prototype. Posting these to [r/devops](https://www.reddit.com/r/devops/comments/783prc/exploring_terraform_graphs_with_d3js/)[^2] led to some interesting discussions (online and off), and thoughts about future work.

This post takes up the problems of horizontal sprawl, better tooltips, meaningful coloration, and animations; starting with diagrams like the one above, and introducing a series of refinements.

### Reconciling Graphviz and D3.js

Graphviz has one thing going for it, so far: its layouts. It can place nodes in order of their dependencies (top to bottom, in this case), whereas the D3.js experiments sometimes became crowded and disorderly.

However, compared with D3.js, its output is static, dated (1970s, I'd venture), and given to sprawling sideways. What about a combination of the two, using graphviz for layout and D3.js for interactions?

<style>
div#demo1 > svg {
       height: 400px;
       display: block;
       margin: auto;
}

</style>
<div id="demo3"></div>

Not bad. Moving resource types to seperate headings reduces overall figure width by 25%, on average, and coloration draws the eye to related resources, regardless of layout.

### Better Tooltips

Tooltips present further opportunities for improvement. Thus far, they've shown resource definitions, only. It might be nice if they were extended with clear labels, and a list of direct dependencies.

<div id="tooltip-demo-1"></div>
<style>
div#tooltip-demo-1 > svg {
       height: 600px;
       display: block;
       margin: auto;
}
</style>

Tooltips could also link to pertinent documentation, implement syntax highlighting, condense verbose definitions (e.g. security groups).

### Meaningful Coloration

Another question concerns the use of color. Until now, color assignments have been arbitrary, and for the most part, each type of resource has enjoyed its own. 

But this is not entirely satisfying. After a certain threshold, the palette becomes confusing; new colors are not easily distinguished from old ones. 

Grouping resources of related types might help. The aws provider alone supports 320 distinct types of resource in close to 50 categories,[^5] but typical configurations probably draw from fewer categories. 

<div id="demo4"></div>

Here, resources of type `aws_route`, `aws_internet_gateway`, `aws_security_group`, `aws_subnet`, and `aws_vpc` all have the same color because they belong to the `vpc` group. Hopefully this will clarify larger diagrams.

### First Animations

With provisional answers to the questions of layout, tooltips, and coloration, animations present new and intriguing possibilities. In the figure below, mousing over a resource highlights its dependencies, only.

<div id="demo6"></div>


### Conclusion

Compared with the proofs of concept presented the [last post](/notes/d3-terraform-graphs), these are starting to look useful. 

Aaaand, It's exciting to begin thinking about further uses of animation, such as presenting `terraform apply` progress in realtime, or highlighting the subgraphs affected by a commit. 

Have a Suggestion? <mailto:patrick.mcmurchie@gmail.com> / [about](/about)

[^1]: [http://28mm.github.io/notes/d3-terraform-graphs](/notes/d3-terraform-graphs)
[^2]: [https://www.reddit.com/r/devops/comments/783prc/exploring_terraform_graphs_with_d3js/](https://www.reddit.com/r/devops/comments/783prc/exploring_terraform_graphs_with_d3js/)
[^5]: Per the documentation, [here](https://www.terraform.io/docs/providers/aws/index.html)

<script src="https://d3js.org/d3.v4.js"></script>
<script src="/assets/terraform-graphs-2/js/fisheye.js"></script>
<script src="/assets/terraform-graphs-2/js/d3-tip.js"></script>
<script src="/assets/terraform-graphs-2/js/terraform-graph.js"></script>

<script>

// use the oldest version of svg_activate
svg_activate_old('div#demo1', 
    '/assets/terraform-graphs-2/demo-1.svg', 
    '/assets/terraform-graphs-2/demo-1.json');

svg_activate_old('div#demo2',
    '/assets/terraform-graphs-2/demo-2.svg', 
    '/assets/terraform-graphs-2/demo-2.json');

svg_activate_old('div#demo3',
    '/assets/terraform-graphs-2/demo-3.svg', 
    '/assets/terraform-graphs-2/demo-3.json');


// use the naive color version of svg_activate w/ tooltips
svg_activate_simple('div#tooltip-demo-1',
	'/assets/terraform-graphs-2/tooltip-demo-1.svg',
	'/assets/terraform-graphs-2/tooltip-demo-1.json')


// better-colors version of svg_activate w/tooltips
svg_activate_color('div#demo4',
    '/assets/terraform-graphs-2/demo-3.svg',
    '/assets/terraform-graphs-2/demo-3.json');

//svg_activate_color('div#demo5',
//    '/assets/terraform-graphs-2/demo-5.svg', 
//    '/assets/terraform-graphs-2/demo-5.json');

// current version of svg_activate w/colors w/tooltips w/animations
svg_activate('div#demo6',
    '/assets/terraform-graphs-2/demo-3.svg',
    '/assets/terraform-graphs-2/demo-3.json');


</script>


<!--
 Below is the default output for a simple configuration.
<img src="/assets/terraform-graphs/demo-1.svg">
--> 
