---
layout: post
title:  "Finding New Music: Two Experiments"
date:   2018-01-22 00:00:01 -0700
categories: music spotify youtube python scripting playlists
---

### TL;DR

A summary of my frustrations with Spotify, followed by a description of two software experiments meant to improve my experience finding new music.

<img src="/assets/the-problem-with-spotify/splicr-screenshot.png">

### Introduction

Is good music becoming harder to find, or am I growing lazy? Or, more specifically: are Spotify playlists as bad as they seem, or am I older and less receptive to new things? Something is definitely wrong, but what is to blame?

Part of the problem, I've decided, is down to the way Spotify's more popular playlists are produced: by employing hipsters (twenty-somethings?) to curate and adjust them according to their measured performance with audiences.

If listeners skip a particular song, that song is cut from the playlist and replaced with something expected to perform better. Its oddly democratic. Odd because the participants aren't necessarily aware of their influence, and because good taste is not a democracy.

Like a centrist politician, the ideal Spotify playlist is meant to appeal broadly and never to offend its audience. Like a politician, it shifts to represent the majority view, in scrupulously anodyne terms.

Personally, I prefer the benevolent despotism of college radio, where feedback is less direct, less precise, and seemingly less of a consideration. DJs on non-commercial radio have a freer hand, and their playlists are often very good. 

### Experiment #1: KEX.Py

A first problem with radio, as I see it, is that I don't own one. Depending on the station, it can be difficult to access archival radio programs online, or even the most recent broadcasts.

My local independent music station (90.3FM KEXP) makes archival playlists available through a web interface, but not recordings more than a week old. 

I wanted a way to import these playlists into Spotify, so that I could listen to old programs--minus radio banter--and sift for new music. [KEX.Py](https://github.com/28mm/KEX.Py) is the tool I wrote to do this.

And it works pretty well, given its modest goal. Pictured below is a typical playlist, produced by [KEX.Py](https://github.com/28mm/KEX.Py). (Not shown are the tracks it got wrong!)


<img src="/assets/the-problem-with-spotify/spotify-screenshot.png">

### Experiment #2: Splicr

A second experiment revisits the problem (well, my problem) of listening to a narrowing canon of recordings, most of them discovered a long time ago.

At some point after Napster (and AudioGalaxy, Limewire, and Soulseek) collapsed, but before Spotify (and Apple Music, and Tidal), I listened to music primarily through Youtube. 

A the time, this seemed like a great hastle: Youtube seldom hosted the official album recording of songs, what it did have was often accompanied by ponderous video montage, and its catalog was always shifting to comply with copyright claims.

But now that Spotify makes albums easily available, the comparative anarchy of Youtube presents an appealling contrast. What would it be like to listen to the most popular versions of songs, in album-order?

This is what [Splicr](https://github.com/28mm/Splicr) facilitates: "splicing" a playlist together from the most popular version of each song on a given album. But how well does it work?

<img src="/assets/the-problem-with-spotify/splicr-screenshot.png">

As you might expect, mileage varies, and sometimes for obscure reasons. For instance: certain artists prohibit Youtube from carrying their recordings, so instead Splicr plays covers by amateur musicians. 

Its impossible to know in advance how far one of Splicr's playlists will deviate from the album it's based on. But in general, I find it adds a lot of charm to the otherwise predictable experience of listening to old favorites. 

### Conclusion

That's it: just a couple of experiments meant to address my lack of a radio, and tendency to listen to old music. What am I wrong about? What have I missed?

**Comment** and **Suggestion** to **<mailto:patrick.mcmurchie@gmail.com>**