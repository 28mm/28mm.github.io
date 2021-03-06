---
layout: post
title:  "Exploring Terraform Graphs With D3.js Part 3"
date:   2017-12-02 00:00:00 -0700
categories: terraform devops d3 d3.js graphs graph blast-radius blast radius
---
<link rel="stylesheet" type="text/css" href="/assets/terraform-graphs-3/style.css">

### TL;DR

This is the third in a series of posts exploring methods of visualizing Terraform dependency graphs, with the goal of producing a tool useful for learning and documentation.

<div id="demo1"></div>

Above is a representative example. Roll your mouse over one of the nodes to see its definition and to highlight its dependencies. For further information, refer to [part one](/notes/d3-terraform-graphs), [part two](/notes/d3-terraform-graphs-2), [part three](/notes/terraform-graphs-3), or [part four](/notes/d3-terraform-graphs-4) of this series; or to [GitHub](https://www.github.com/28mm/blast-radius), where *[Blast Radius](/blast-radius-docs)* is hosted.

### Terraform Modules

Modules greatly simplify Terraform administration, by isolating reusable components. Earlier versions of *[Blast Radius](https://www.github.com/28mm/blast-radius)*[^1] didn't handle modules very well, or at all.

For a [recent project](https://28mm.github.io/notes/echo-location),[^2] I wanted to launch a single AWS instance in a large number of AWS regions; a perfect fit for modules. Here is a single instance of that module, launched in the AWS `us-east-1` region, and named the same.

<div id="demo2"></div>

Here's the same module reused to launch copies of that instance in both `us-east-1` (Northern Virginia), and `ap-northeast-2` (Seoul).


<div id="demo3"></div>

And, here is the same module reused to launch instances in seven regions. This graph in particular highlights the limitations of the visual language used: it is *too* colorful, and *too* broad. Illegible, in other words.

<div id="demo4"></div>

Something like Terraform's `--module-depth` parameter would simplify larger diagrams like this one. Better handling of the module registry and other remote sources, is needed as well... but it's a start.  

### Narrowing (Some) Figures

In previous posts, I've described the tendency for Graphviz layouts of Terraform graphs to sprawl sideways. Some of this is unavoidable, but gains can be realized at the expense of vertical scrolling.

*Variable* resources often share a parent. Rather than lay these variables out side by side, they could be "stacked," one atop the other, without sacrificing clarity.

<div id="demo11"></div>

(*Output* resources often share the same (single) dependency, and parent, and can be "stacked" in the same way. This figure demonstrates that possibility, as well.)

### Code & Examples

The code used to produce these figures can be found on GitHub, as the *[Blast Radius](https://www.github.com/28mm/blast-radius)* project.

Further examples--most of them borrowed from examples/ directories in the Terraform provider ecosystem--can be found on the project's [documentation](/blast-radius-docs/) page.

If you're interested in testing *[Blast Radius](https://www.github.com/28mm/blast-radius)* in your environment, you can obtain an experimental distribution from the Python Package Index.

````bash
[...]$ brew install graphviz
[...]$ pip3 install blastradius
````

Or clone the GitHub repository, and install an edtitable copy (via `pip3 -e`).

````bash
[...]$ git clone https://github.com/28mm/blast-radius.git
[...]$ cd blast-radius
[...]$ pip3 install -e .
````

*[Blast Radius](https://www.github.com/28mm/blast-radius)* requires an `init`-ed Terraform project to run.

````bash
[...]$ cd path/to/terraform/project
[...]$ terraform init
[...]$ blast-radius --serve
````

### Conclusion

While I'm pleased *[Blast Radius](https://www.github.com/28mm/blast-radius)*, as an exploratory project, more work is needed to make it generally useful. In particular, I'd like to shore up module support, do smarter tooltip layouts, and make it easier to embed figures.

What do you think?
**Comment** and **Suggestion** to **<mailto:patrick.mcmurchie@gmail.com>**


[^1]: [https://www.github.com/28mm/blast-radius](https://www.github.com/28mm/blast-radius)
[^2]: This project attempts to geolocate IPs by measuring latency from points around the world. [https://28mm.github.io/notes/echo-location](https://28mm.github.io/notes/echo-location)

<script src="https://d3js.org/d3.v4.js"></script>
<script src="/assets/terraform-graphs-2/js/d3-tip.js"></script>
<script src="/assets/terraform-graphs-3/terraform-graph.js"></script>
<script src="/assets/terraform-graphs-3/categories.js"></script>

<script>

// use the oldest version of svg_activate
svg_activate('div#demo1', 
    '/assets/terraform-graphs-3/demo-1.svg', 
    '/assets/terraform-graphs-3/demo-1.json',
    '65%');


svg_activate('div#demo2', 
    '/assets/terraform-graphs-3/demo2.svg', 
    '/assets/terraform-graphs-3/demo2.json',
    '100%');

svg_activate('div#demo3', 
    '/assets/terraform-graphs-3/demo3.svg', 
    '/assets/terraform-graphs-3/demo3.json',
    '100%');

svg_activate('div#demo4', 
    '/assets/terraform-graphs-3/demo4.svg', 
    '/assets/terraform-graphs-3/demo4.json',
    '100%');

svg_activate('div#demo11', 
    '/assets/terraform-graphs-3/demo11.svg', 
    '/assets/terraform-graphs-3/demo11.json',
    '65%');


</script>