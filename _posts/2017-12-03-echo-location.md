---
layout: post
title:  "IP Geolocation with ICMP (ECHO-location)"
date:   2017-12-03 00:00:01 -0700
categories: latency ping icmp ttl rtt aws cloud server d3.js map 
---
<!--<link rel="stylesheet" type="text/css" href="/assets/terraform-graphs-3/style.css">-->
<link rel="stylesheet" type="text/css" href="/assets/echo-locate-1/style.css">
### TL;DR

Network latency is a measure of time, but also a proxy for distance. Using this property, it's possible to geolocate a server by measuring the round-trip-time (rtt) of packets sent from multiple locations. This post explores that idea, using the AWS public cloud.

<div id="example1"></div>

As an illustration, mouseover one of the datacenters in the above figure to see how far it's requests may have travelled to reach [www.washington.edu](https://www.washington.edu) (whose servers are presumably in Seattle, or nearby).

### Introduction

I became intested in this topic after reading the the apocryphal *[case of the 500-mile email](https://www.ibiblio.org/harris/500milemail.html),*[^1] which concerns a *Sendmail* administrator, in Durham, North Carolina, whose users complain that they cannot send email farther than 500 miles. A preposterous limitation.


<div id="example2"></div>

He determines that *Sendmail* is aborting connections that take longer than 3 milliseconds to establish. Recalling that the speed of light is 2.998e+8 m/s, 3 ms equates to roughly 560 miles. Roughly the distance cited in the users' reports!

I've always liked this story; I suspect because computer networks are often very abstract, and layer 1 can feel a long way down. Revisiting it recently, I began thinking about other uses of the same principle, and geolocation in particular.

### A First Experiment

I am writing this from a desk in Seattle, but what if I didn't know that? Could I establish my own location if I were amnesiac and unwilling to ask? What if I only had *Ping* and a map of the world?

To get started I borrowed a list of public IP addresses associated with various AWS regions from the *[EC2 Reachability Test](https://ec2-reachability.amazonaws.com)[^2]*, and plotted the distance suggested by the least measured rtt from my desk to each one.[^3]

<div id="experiment1"></div>

This experiment places me within 921 miles of AWS' us-west-2 region. An answer that's neither wrong, precise, nor all that bad.

### Around The World In 6.912e+9 Milliseconds

The global presence of cloud services like AWS, GCP, and Azure makes it both inexpensive and convenient to test latency from various points around the world.

The map below presents a sample of datacenters from AWS and Google Cloud Platform with the caveat that they may be slightly misplaced, because their precise locations aren't always known. (Or, aren't known to *me*.)

<div id="example3"></div>

What's needed, now, is a mechanism for launching vm instances in a selection of these datacenters. *[Terraform](https://www.terraform.io/)*[^4] provides this, serving as a kind of *Make* for cloud infrastructure; and one that supports multiple vendors.

In a follow-up post, I'll pursue this idea, using Terraform to manage instances in multiple public clouds at once, to measure latency from various points around the world. *Stay tuned...*

**Comment** and **Suggestion** to **<mailto:patrick.mcmurchie@gmail.com>**



[^1]: [https://www.ibiblio.org/harris/500milemail.html](https://www.ibiblio.org/harris/500milemail.html)
[^2]: [http://ec2-reachability.amazonaws.com](http://ec2-reachability.amazonaws.com)
[^3]: I am using the speed of light in a vacuum (*c*) multiplied by 2/3 to correct for its slower passage through fiber optic media. 
[^4]: I've written about Terraform in two previous posts: [part one](https://28mm.github.io/notes/d3-terraform-graphs), [part two](https://28mm.github.io/notes/d3-terraform-graphs-2), [part three](/notes/terraform-graphs-3). The project that resulted from these posts is called *[Blast Radius](https://www.github.com/28mm/blast-radius)*, and is available on GitHub.

<script src="https://d3js.org/d3.v4.js"></script>
<script src="https://d3js.org/d3-geo.v1.min.js"></script>
<script src="/assets/echo-locate-1/d3-tip.js"></script>
<script src="/assets/echo-locate-1/example-1.js"></script>
<script src="/assets/echo-locate-1/example-2.js"></script>
<script src="/assets/echo-locate-1/example-3.js"></script>
<script src="/assets/echo-locate-1/experiment-1.js"></script>

<script>
// use the oldest version of svg_activate
example1('div#example1', 
    '/assets/echo-locate-1/world-map.json');
example2('div#example2', 
    '/assets/echo-locate-1/usa-map.json');
experiment1('div#experiment1', 
    '/assets/echo-locate-1/world-map.json');
example3('div#example3',
    '/assets/echo-locate-1/world-map.json');

</script>

