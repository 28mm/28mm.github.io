---
layout: post
title:  "A Quixotic Apartment Search (in Seattle)"
date:   2017-05-23 00:00:00 -0700
categories: photos apartments seattle rent 
---

  1. [Introduction](#introduction)
  1. [Lease-less In Seattle](#lease-less-in-seattle)
  1. [How Many NPR Moments is Too Many?](#how-many-npr-moments-is-too-many)
  1. [What Does Walkability Measure?](#what-does-walkability-measure)
  1. [Eyes On The Street](#eyes-on-the-street)
  1. [Conclusion](#conclusion)

## Introduction

Finding an apartment is a chore like few others. For one thing, it can be difficult to recognize a good deal, without closely following the market. For another, realtors often misrepresent their properties in an effort to make them more attractive.[^1] It can be exhausting to evaluate the thousands of apartments listed in a busy market, but renting an apartment is *significant*.

For most of us, rent constitutes a large fraction of income, while our address determines the amount of time we lose commuting, and if we can reasonably bike to work. For these reasons alone, it is worth making a deliberate, rather than improvised search, for a next apartment. Where to start?

Services like Craigslist and Zillow are like a firehose of listings, brimming with useful information, including: price, area (ft<sup>2</sup>), floorplan, neighborhood, and pet-tolerance. Perhaps collecting data from these services could help characterize the rental market, and inform an apartment search?

## Lease-less In Seattle

A couple years ago, the blog [Predictably Noisy](http://chrisholdgraf.com/quick-craigslist-data-analysis/) carried an analysis of Bay Area rents--based on Craigslist data--with a series of figures showing the relationship between apartment size and price per square foot, as well as the distribution of these two variables. To get started, I reproduced those plots for Seattle.[^2]

<img src="{{site.url}}/assets/seattle-apartments/see-ppsf-by-bedrooms.png" class="figure">

In this figure, price per square foot is plotted against area, and the most common floorplans are assigned a color. Space tends to become cheaper, per unit area, as you rent more of it.

<img src="{{site.url}}/assets/seattle-apartments/see-ppsf-dist.png" class="figure">

Here we see that apartments of each type are available at a wide range of prices per square foot. (And that studios command sometimes astonishing rents.)

Immediately north of Seattle, Snohomish County provides an interesting counterpoint. Fewer apartments are listed here, but only a handful cost more than $3/ft<sup>2</sup>. In fact a majority are available for around $2/ft<sup>2</sup>, or less. 

<img src="{{site.url}}/assets/seattle-apartments/sno-ppsf-by-bedrooms.png" class="figure">

## How Many NPR Moments Is Too Many?

Apartments in Snohomish County are offered for reliably low rates, but another feature they share is a long, dystopian commute into seattle. Jean Luc Godard's 1967 film, *Weekend*, neatly captures the experience.

<img src="{{site.url}}/assets/seattle-apartments/weekend.jpg" alt="Weekend - Jean Luc Godard (1967)">

Is a comparison to *Weekend* hyperbolic? The [WSDOT](http://www.wsdot.com) publish estimated travel times between Lynnwood and Downtown Seattle. I collected these estimates for the first two weeks of May, 2017, and plotted them, below.

<img src="{{site.url}}/assets/seattle-apartments/traffic.png" class="figure">

And this is only southbound traffic. Actual commute times from Snohomish County likely exceed these, because most apartments are neither adjacent to the freeway, nor close to Lynnwood.[^3]

### Is Distance A Reliable Proxy For Commute Duration?

So far, Craigslist data have been enough to get a general picture of the apartment rental market, and WSDOT traffic estimates have been enough to to rule-out Snohomish County, altogether. But, Seattle's crosstown traffic is no picnic, either. 

Neighborhood and distance are commonly used as proxies for commute duration, which we assume increases with distance. But, how much influence do the vagaries of Seattle's arterial, and public transit infrastructure, exert?

To understand these effects, we need greater location precision. On craigslist, the location field is often empty, or uselessly vague. Zillow, on the other hand, is a more reliable source of addresses, and other structured data.[^4]

The [Google Directions API](https://developers.google.com/maps/documentation/directions/) estimates trip duration, between arbitrary locations. It supports a variety of transit modes (walking, biking, driving, public transit), and can factor expected traffic into its calculations. 

Since I am currently interviewing for jobs,[^5] I was interested in the expected commute times from available rentals to prospective offices. I wanted to test the assumption that a nearby apartment offers a shorter commute.

To that end, the following figures show expected commutes from Zillow-listed apartments in Seattle, to an office in Ballard, by 9:00 AM on a weekday morning. Walking trips are shown in blue; bus trips are colored according to the number of transfers needed, following an obvious pattern.

<img class="figure" src="{{site.url}}/assets/seattle-apartments/distance-vs-commute-by-legs.png">

Here we see the expected linear relationship between distance and commute duration. However, there is quite a bit of variance (r<sup>2</sup> = 0.794). We can conclude that proximity alone is a dubious predictor of time lost riding and transferring between buses.

### What About Nearby Apartments?

<img src="{{site.url}}/assets/seattle-apartments/dvc-small.png" class="figure" />

For commutes shorter than 1.7 km, distance more reliably predicts commute duration. Perhaps a walking tour within this radius would locate a suitable apartment more quickly? This approach would be considerably less complicated.

Ideally, I would find an apartment featuring a short commute (less than a half hour) for less than $2.5/ft<sup>2</sup>. The figure below presents listings in three adjacent postal codes.

<img src="{{site.url}}/assets/seattle-apartments/zip-search.png" class="figure">

98107 encompases lower Ballard, and the neighborhood realtors have dubbed *Frelard*. Unsurprisingly, it seems to offer the best commute. 98103 extends from Lake Union, in Fremont, to N. 100<sup>th</sup> St, in Greenwood, and also offers reasonable commutes.

98199 is a different story. Queen Anne and Magnolia are separated from Ballard and Fremont by only the Ship Canal. These are *long* commutes, so I am better off looking North of the Ship Canal.

## What Does Walkability Measure?

Rents and commute durations have proven easy quantities to obtain. And, because of their importance, they form a good basis for comparing listings. But, given a choice, few of us would rent an apartment because it optimized *just* these variables. 

In practice, we are concerned with a lot else. For instance, we might want an apartment located close to friends, or one with trustworthy management. But, individually, few of these concerns are as significant, or as easily quantified.

With that said, I live close to several independent cafés--this being Seattle--and rather enjoy my options. Access to cafés, like these, as well as to grocers, laundromats, and other everyday businesses, is important to me. In realtors' parlance, I prize *walkability*.

Walkability indices summarize certain of these secondary concerns in a single comparable quantity. To the extent that they succeed, in this, they promise to reduce the tedium of prioritizing listings.

### Walk Score

[Walk Score](https://www.walkscore.com/), along with the related Bike and Transit Scores, is a proprietary metric promoted by the real estate company, Redfin. The Walk Score associated with an address estimates how easily everyday errands can be accomplished there, without a car.

Walk Scores are a function of the distances to ammentities in various categories. [Wikipedia](https://en.wikipedia.org/wiki/Walk_Score#cite_note-7) have a dated (2013) run-down of the algorthim. My (limited) efforts did not turn up a more recent or authoratative description.   

The following scale is used for interpretation. E.g. since my apartment has a Walk Score of 85, I should be able to accomplish most errands on foot. Evidently my neighborhood is missing something.[^6]

| Score  | Interpretation                              |
|:-------|:--------------------------------------------|
| 90-100 | Everyday errands are possible without a car |
| 70-89  | Most errands can be accomplished on foot    |
| 50-60  | Some errands can be accomplished on foot    |
| 25-49  | Most errands require a car                  |
| 0-24   | Almost all errands require a car            |

I had hoped to do more with Walk Score, perhaps using it to exclude certain listings, or give priority to others. Because I wasn't granted an API key, I decided to look elsewhere. &#x1F937;

### The EPA Walkability Index

I have to admit that I was feeling just a little let down by the private sector, so I turned, instead, to Uncle Sam. The EPA calculate a [walkability index](https://developer.epa.gov/walkability-index-2/) for each of the 2010 census block groups.[^7] 

So, how does walkability vary between census block groups, in Seattle, and what does it measure?

<img src="{{site.url}}/assets/seattle-apartments/map.png" class="figure">

Outside of a few neighborhoods: Downtown, Belltown, Fremont, Wallingford, parts of Ballard, and Capitol Hill, the EPA estimate middling walkability across Seattle. 

Certainly, the highest ranked neighborhoods *are* walkable, but I expected others to score higher than they did. Just what are we looking at? Certainly not *my* assessments. The EPA walkability index is a weighted combination of terms drawn from the EPA's [Smart Location Database](https://www.epa.gov/smartgrowth/smart-location-mapping#walkability).

The full documentation is worth reading, but I will briefly highlight four terms of interest.

  1. [Density](#density)
  2. [Land use diversity](#land-use-diversity)   
  3. [Distance to fixed-guideway transit](#distance-to-fixed-guideway-transit)
  4. [Destination accessibility](#destination-accessibility)

<a name="density">
#### 1. Density 

Here, density can refer to housing units per acre, or residents per acre, in areas where development *can* occur. Because public parks, zoos, beaches, and cemeteries cannot be developed, their area is subtracted from the total area of the block group.

The exclusion of protected areas from the density term may explain the otherwise surprising coloration of the block groups containing *Seward*, *Discovery*, and *Carkeek* Parks.

<a name="land-use-diversity">
#### 2.Land use diversity 
    
Jane Jacobs advocated for neighborhoods that support diverse uses, i.e. both residential, and commercial. Employment and population aggregates combine to measure this diversity.

$$ E = [\sum_{i=1}^{4} P_{i}*ln(P_{i})] /ln(n)$$

Values of $$P_{i}$$ reflect the number of jobs in 3 sectors, and the number of residents: (1) commercial, industrial, and instituational jobs, (2) retail jobs, (3) recreational jobs, and (4) resdients. 

<a name="distance-to-fixed-guideway-transit">
#### 3. Distance to fixed-guideway transit

Fixed guideway, here, refers to rail, light rail, subways, ferries, and trollies, but *not* buses. Rather than a distance, this metric counts the number of fixed-guideway transit stations within 1/4 mile, and 1/2 mile.

Seattle is interesting because it has many more bus routes (including so-called *bus rapid transit*) than it has fixed-guideway routes. Additionally, its street cars and monorail are completely useless (although some will disagree).

<a name="destination-accessibility">
#### 4. Destination accessibility

Destination accessibility measures, on the one hand, how many working age residents of nearby census tracts can access jobs in a given block group via different modes of transportation. On the other it measures the accessability of jobs in nearby census tracts to residents of the given block group.

#### Application of the EPA walkability index

The EPA walkability index is a good case study in the creation of such an index, and is probably useful to its intended audience of city planners. However, it isn't well suited to helping choose between apartments.

For one thing, the calculated walkability of neighboring block groups often varies. What would happen if their borders moved, or shrank? Esepcially along the borders of census block groups, these differences give a distorted picture of actual walkability.

The data are old. The last census was taken in 2010, and Seattle has changed, considerably, since then. For starters, its density has increased, and more fixed guideway transit exists.

Nevertheless, it has nice qualities. Not least of these: it's derived from easily understood terms. As I think about what I want from a walkable neighborhood, I am glad to have adaptable public domain tools, where I might otherwise depend on proprietary solutions, like Walk Score.

## Eyes On The Street

We can see many of Jane Jacobs' views reflected in tools like Walk Score and The EPA's Walkability Index, but her methods are at least as interesting. 

Essentially, Jacobs advocated for close observation. The illustation credit to her *Death and Life of Great American Cities*, reads:

<blockquote>
"The scenes that illustrate this book are all about us. For illustrations, please look closely at real cities. While you are looking, you might as well listen, linger, and think about what you see."
</blockquote>

And, in the following pages, she offers a suggestion about what we can hope to discover, by paying attention to the *look of things*, namely: *the way they work*. 

<blockquote>
 "the look of things and the way they work are inextricably bound together..."
</blockquote>

Measures of walkability depend on demographics, land use, and transit, in part because these quanitities are readily available, and easy to work with. They can't as easily consider *the look of things*. 

Compared with measures like these, field observations would be expensive to make, and confounding to work with. Thats an oft repeated assumption, at least, but recent advances in computer vision could challange it.

### General Image Classification

For a first experiment, I collected several hundred pictures each, of three distinctive neighborhoods: the *<font color="#4e73b0">Lower East Side</font>*, *<font color="#68ae7c">Le Marais</font>*, and San Francisco's *<font color="#c45155">Mission District</font>*. I wanted to know if a general image classifier would identify the unique visual character of these neighborhoods. 

<img src="{{site.url}}/assets/seattle-apartments/google-tsne.png" class="figure">

In the figure above, each picture was processed by Google's [Cloud Vision API](https://cloud.google.com/vision/)[^8] to produce a vector of confidence scores (i.e. the confidence that a picture depicts a given subject). *In other words, they're grouped by subject, to the extent that an image classifier has made sense of them.*[^9]


Because I sampled pictures from Bing Image Search, they reflect what people have found interesting in each neighborhood. In the *<font color="#c45155">Mission District</font>*, murals make a popular subject (you can see this cluster in the lower left), while fire escapes feature in many photographs of the *<font color="#4e73b0">Lower East Side</font>*.

It's worth noting that Google's Cloud Vision API lacks some of Jacobs' descriptive genius. Where Jacobs saw "promenades that go from no place to nowhere, and have no promenaders," software might instead report *buildings*, and *atmospheric phenomena*.

In some places, as with murals in the *<font color="#c45155">Mission</font>*, pictures of a certain neighborhood cluster together. Isolated clusters indicate something unique, either about that neighborhood or the pictures chosen to represent it. 

Conversely, areas where pictures from different neighborhoods overlap suggest more generic subjects that might be found in any neighborhood: *buildings*, *people*, and *cars*, for instance.


And what of Seattle's *<font color="#4e73b0">Capitol Hill</font>*, *<font color="#68ae7c">Belltown</font>*, and *<font color="#c45155">Ballard</font>* neighborhoods? I would've hoped for more distinct groupings. For example, old brick buildings get grouped with new ones.

<img src="{{site.url}}/assets/seattle-apartments/google-tsne-seattle.png" class="figure">

A general image classifier may be the wrong tool. A human observer given the same task would likely identify different features in each picture, and arrange them according to a different logic. 

A more fruitful approach might involve a domain specific model, trained to identify features of particular interest: distinguishing between different kinds of building, for instance, or registering eyesores of various description.

## Conclusion

It took just a little code to scrape and interrogate an interesting dataset, with considerable relevance to my daily life. Happily, my initial focus on rents and commuting yielded the most benefit for the least work.

Looking past these first experiments, towards the complexities of neighborhoods and urban design, has been no less interesting. However, for a greater investment of effort, I have less to show. Neighborhood trivia, and a few GIS tricks, for instance, but nothing directly useful.

A lot could still be done, in this more quixotic direction. Urban life raises many intriguing questions; public-ish data and simple methods may answer some of them. 

However, in the face of diminishing returns, I exect I'll move my apartment search back into meatspace--- knowing, at least, that I won't have my time wasted by as many bogus listings.


[^1]: Realtors engage in photographic trickery, commonly using fisheye lenses and manipulated colors, to give false impressions. Furthermore, they often mis-state the proximity of their properties to public transportation, popular neighborhoods, and major employers.

[^2]: To collect enough listings for this project, I used [python-cragislist](https://github.com/juliomalegria/python-craigslist), and [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) to retrieve and parse them, and a [sqlite](https://www.sqlite.org/) database, for persistent storage.

[^3]: In fact, most apartments in Lynnwood are listed on the see (Seattle) Craigslist, rather than the sno (Snohomish County) Craigslist. Most sno listings are further north.

[^4]: Zillow use javascript and asynchronous loading techniques extensively on their website, making it more difficult to scrape. I used [Selenium](http://www.seleniumhq.org/), and [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) to collect listings.

[^5]: Considering *systems administration* and *systems engineering* roles, in the Seattle area. Email me: <mailto:patrick.mcmurchie@gmail.com>

[^6]: Looking closer at my apartment's Walk Score, it appears to lack nearby *entertainment*. My current activity-- *blogging*-- doesn't suggest otherwise.

[^7]: Census blocks are the smallest geographic unit used for the US Census. Block groups are composed of census blocks, and are the smallest unit for which the Census publish aggregate data. Tracts are larger.

[^8]: I tried the same exercise with equivalent APIs from Clarifai, Amazon, and Microsoft, with superficially similiar results, but have not probed deeply.

[^9]: Dimensionality reduction was accomplished with [t-SNE](https://lvdmaaten.github.io/tsne/), as implemented in [scikit-learn](http://scikit-learn.org/stable/). 
