---
layout: post
title:  "Exploring Terraform Graphs With D3.js Part 1"
date:   2017-10-22 00:00:00 -0700
categories: terraform devops d3 d3.js graphs
---

### TL;DR

As a newcomer to Terraform (and to AWS), I sometimes find it difficult to reason about the many available resource types, and the dependencies that can exist between them. Especially when coming to terms with larger configurations.

To address this difficulty, I want a tool to help me explore dependency graphs, and resource definitions, interactively. This is the first in a series ([part two](notes/d3-terraform-graphs-2)) of posts about building such a tool, using d3.js, starting with the simple example below[^1], and building upon it.

<script src="/assets/terraform-graphs/js/d3.v3.js"></script>
<script src="/assets/terraform-graphs/js/d3-tip.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/terraform-graphs/style.css">
<div id="demo-1"></div>

### Terraform and Dependency Graphs, Introduced

Terraform is a remarkable piece of software; it's like Make for infrastructure. Rather than transforming source into libraries and executables, Terraform transforms resource definitions (such as vm instances, dns records, s3 buckets) into running infrastructure. 

Like Make, Terraform walks a dependency graph to determine the order in which it should create resources, to identify what can be done in parallel, and to re-create resources affected by changes.

Consider the following example, a straightforward Terraform graph--the same as above--laid out by the graphviz package.[^2]

<img src="/assets/terraform-graphs/demo-1.svg" class="figure">

This graph is easy to understand because it has only a handful of nodes, and an obvious structure. You can easily find the single instance, its provider (aws, in this case), and the few variables they depend on. Here is a slighly more complex example.[^3]

<img src="/assets/terraform-graphs/demo-2.svg" class="figure">

This is graph remains fairly legible. But larger examples tend to sprawl, making resources harder to find, and dependencies harder to trace.[^4]

<img src="/assets/terraform-graphs/docker-demo-3.svg" class="figure">


### Interactive Dependency Graphs

These visualizations could be improved in various ways. Adding color, and varying the shapes used, for instance, as well as collapsing less interesting parts of the graph. But an interactive visualization offers these possibilities and more.

As a reminder of how this might work, here is the first example, again. The root node is made larger than its dependencies, and nodes of different types are assigned colors, according to an arbitrary scheme.

<div id="demo-2"></div>  

And here is is the second. This example is worryingly dense, compared with the Graphviz version, but being able to call up resource definititions with the mouse is a striking advantage.

<div id="demo-3"></div>

One possible improvement here is to use curved edges, so that their direction is more obvious. (Tracing an edge in the clockwise direction brings you to a dependency.)

<div id="demo-4"></div>

That's an encouraging result, but what about a much larger graph, like the sprawling third example?

<div id="demo-5"></div>

This version is harder to make sense of than the Graphviz version! It contains so many types of resource, for example, that it exhausts the 20-color palette, used previously. 

Additionally, many of the edges overlap, or are drawn so close together, that they become hard to distinguish.

### Conclusion

So far this has been a fun exercise, and I'm satisfied with it as a proof of concept. However, larger configurations remain a problem. In the next post, I plan to take up this problem, and explore possible solutions to it.

Have a suggestion? <mailto:patrick.mcmurchie@gmail.com>

[^1]: `.tf` files borrowed from Udemy's Terraform course materials, [here](https://github.com/wardviaene/terraform-course/tree/master/demo-1).
[^2]: Terraform directly supports this type of visualization, through its `graph` argument: `terraform graph | dot -Tsvg > graph.svg`.
[^3]: `.tf` files borrowed from Hashicorp's aws provider examples, [here](https://github.com/terraform-providers/terraform-provider-aws).
[^4]: `.tf` files borrowed from Udemy's Terraform course materials [here](https://github.com/wardviaene/terraform-course/tree/master/docker-demo-3)

<script src="/assets/terraform-graphs/js/terraform-graph.js"></script>
<script>
activate('#demo-1', '/assets/terraform-graphs/demo-1.json', 580, 300, false);
activate('#demo-2', '/assets/terraform-graphs/demo-1.json', 580, 300, false);
activate('#demo-3', '/assets/terraform-graphs/demo-3.json', 580, 400, false);
activate('#demo-4', '/assets/terraform-graphs/demo-3.json', 580, 400, true);
activate('#demo-5', '/assets/terraform-graphs/docker-demo-3.json', 580, 600, true);
</script>
