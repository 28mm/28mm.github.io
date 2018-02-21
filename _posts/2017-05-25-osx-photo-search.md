---
layout: post
title:  "Photo Metadata and Search on MacOS"
date:   2017-05-25 00:00:00 -0700
categories: photos metadata spotlight search
yc: "https://news.ycombinator.com/item?id=16278637"
---

<a href="https://news.ycombinator.com/item?id=16278637"><img src="/assets/y18.gif"> This article has been discussed on Hacker News.</a>

Apple's Photos.app classifies pictures, identifying subjects such as "boat," and "bicycle," as well as settings like "cafe," and "mountains." It uses this capability to offer vastly better search than before.[^1] 

Unfortunately these improvements are neither visible to Spotlight, nor available in the Finder. This post documents a method of reconciling Photos.app metadata with filesystem metadata, so that they are indexed by Spotlight. 

1. [The Finder, Extended Attributes, and Spotlight.](#xattrs)
2. [Photos.app Metadata: A SQLite Adventure](#photos-app)
3. [Reconciling Photos.db With Spotlight Indices](#reconciliation)

<a name="xattrs">
### The Finder, Extended Attributes, and Spotlight.

Quite a bit of old information remains in circulation, about tagging and searching for documents in MacOS. The Finder seems to recognize a few extended attributes, for the purpose of associating tags and comments with files.[^2] 

To keep things simple, I will present only the method that has worked for me.

The `com.apple.metadata:_kMDItemUserTags` xattr is used to associate a plist of tags with a file. Spotlight reads this xattr, and indexes its contents. To assign the tags "mountain," and "alpine" to a file, for instance, you would create a plist:

````xml
<!DOCTYPE plist PUBLIC
 "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <array>
    <string>mountain</string>
    <string>alpline</string>
 </array>
</plist>
````

To associate this `$plist` with a `$file`, invoke the `xattr` command, as shown below.

````bash
[...]$ xattr -w "com.apple.metadata:_kMDItemUserTags" \
      "$plist" "$file"
````

At this point, you should be able to find the file, via the &#x1F50E; icon, or the `mdfind` command, as shown below.

````
[...]$ mdfind tag:mountain
/path/to/matching/file
/path/to/another/matching/file
````

<a name="photos-app">
### Photos.app Metadata: A SQLite Adventure

Photos.app does its accounting with a SQLite database, which we'll call `$photodb`, and set thus:

````bash
[...]$ cd ~
[...]$ cd Pictures
[...]$ cd Photo\ Library.photoslibrary
[...]$ cd database
[...]$ photodb="$PWD/photos.db"
````

Unfortunately, `$photodb` is probably open, and locked.

```bash
[...]$ lsof "$photodb"
COMMAND     PID    USER   FD   TYPE DEVICE  [...snip...]
photolibr 15432 patrick    4u   REG    1,1  [...snip...]
````

The trouble with just killing *photolibraryd*, is that it will re-spawn, repeatedly. <span class="redact">Undoubtedly,</span> *launchd* can be told to disable *photolibraryd*, <span class="redact">but</span> <span class="redact">the</span> <span class="redact">approved</span> <span class="redact">mechanism</span> <span class="redact">wasn't</span> <span class="redact">immediately</span> <span class="redact">obvious</span> <span class="redact">to</span> <span class="redact">me.</span>

<span class="new">Stop the `photolibraryd` service with `launchctl`</span>

````bash
[...]$ launchctl stop photolibraryd
````

<span class="redact">Instead,</span><span class="new">Initially,</span> I opted for an egregious hack, <span class="new">which you can read about by copying the redacted text.</span><span class="redact">In</span> <span class="redact">order</span> <span class="redact">to</span> <span class="redact">lock</span> <span class="redact">its</span> <span class="redact">database,</span> <span class="redact">photoslibraryd,</span> <span class="redact">need</span> <span class="redact">to</span> <span class="redact">be</span> <span class="redact">able</span> <span class="redact">to</span> <span class="redact">write</span> <span class="redact">to</span> <span class="redact">it.</span> <span class="redact">I</span> <span class="redact">simply</span> <span class="redact">removed</span> <span class="redact">write</span> <span class="redact">permisions.</span>


````bash
[...]$ chmod -w "$photodb"
[...]$ lsof "$photodb" | 
  awk '{ print $2}'    | 
  egrep -v PID         | 
  xargs kill
````

<span class="redact">Afterwards--but</span> <span class="redact">not</span> <span class="redact">yet--don't</span> <span class="redact">forget</span> <span class="redact">to</span> <span class="redact">restore</span> <span class="redact">write</span><span class="redact">permissions</span>[^3] <span class="redact">to</span> <span class="redact">your</span> <span class="redact">photos</span> <span class="redact">database!</span> <span class="redact">You</span> <span class="redact">may</span> <span class="redact">want</span> <span class="redact">to</span> <span class="redact">restart</span> <span class="redact">your</span> <span class="redact">computer</span> <span class="redact">to</span> <span class="redact">ensure</span> <span class="redact">that</span> <span class="redact">photolibraryd,</span> <span class="redact">continues</span> <span class="redact">to</span> <span class="redact">work.</span>


Now, it's possible to open `$photodb`, and poke around.

````bash
[...]$ sqlite3 "$photodb"
SQLite version 3.14.0 2016-07-26 15:17:14
Enter ".help" for usage hints.
sqlite> 
````

Review the schema with the `.schema` command. Quit by sending `Ctrl-d`, or with the `.quit` command. Tags (and a lot else) are kept in the `RKVersion_stringNote` table.

````sql
sqlite> .headers on
sqlite> SELECT * FROM RKVersion_stringNote;
````

We need to find the appropriate value of `keyPath`, since this will vary between systems. The following snippet, should suffice to find it:

````bash
[...]$ KEYPATH=$( sqlite3 "$photodb" .schema       | 
  grep 'RKVersion_stringNote_skIndexUpdateTrigger' | 
  grep -Eo '[0-9]{1,4}' )
````

Okay, but did it work?

```
[...] echo $KEYPATH
719
````

Now we can find the strings containing our tags, and associate them with filesystem paths. Be sure to substitute the value of `$KEYPATH` determined above, for the literal `719`, below.


````sql
sqlite> SELECT RKMaster.imagePath, RKVersion_stringNote.value
FROM RKVersion_stringNote
INNER JOIN RKMaster
ON RKVersion_stringNote.attachedToId = RKMaster.modelId
WHERE RKVersion_stringNote.keyPath = 719 /* !!! */
````

Records will resemble the following:
````
2015/04/25/20150425-035012/DSC00435.JPG|DSC00435.JPG  \
00435.JPG JPG October 2012 Outdoor Outside Outdoors   \
Outsides Land Lands Mountain Mounts Peak Sierra       \
Sierras Peaks Mountains Mount
````

Tags aren't quoted, but always come last. The trouble is that its not obvious which are 1-grams, 2-grams, or n-grams. Various collisions are possible both between tags, and other substrings.

<a name="reconciliation">
### Reconciling Photos.app metadata with filesystem metadata

Okay, lets put the pieces together. We need four things:
1. a copy of `photos.db` in a write-able location.
2. the system-specific value of `$KEYPATH`
3. the path to our photos library `$PHOTOLIB`
4. `photos2spotlight.py` (listing [here](https://github.com/28mm/macos-photo-scripts)).

Start by getting an idea of what your library contains:

````bash
[...]$ ./photos2spotlight.py --stats \
  --db /path/to/copy/of/photos.db 
  --lib "~/Pictures/Photos\ Library.photoslibrary/"
  --keypath $KEYPATH
````
````
[...snip...]
    16 Duds
    16 Clothing
    16 Accoutrements
    16 Accoutrement
    16 Clothings
    16 Apparels
    18 Insides
    18 Interior Rooms
    18 Inside
    18 Interior Room
    18 Indoors
````

By default, `photos2spotlight.py` will make a dry run. Use the `--write` flag to modify fileystem metadata.

````bash
[...]$ ./photos2spotlight.py --stats \
  --db /path/to/copy/of/photos.db
  --lib	"~/Pictures/Photos\ Library.photoslibrary/"
  --keypath $KEYPATH
  --write
````

You should now be able to find photos using Spotlight, the Finder, or the related mdfind command. E.g.

````
[...]$ mdfind 'tag:Inside'
.../Masters/2015/04/22/20150422-011045/IMG_0083.JPG
[...snip...]
````

### Conclusion

<span class="redact">That's</span> <span class="redact">it.</span> <span class="redact">Macs</span> <span class="redact">are</span> <span class="redact">easy,</span> <span class="redact">right?</span>

Continue to <a href="/notes/better-photo-search-for-macos">Part 2</a>.

[^1]: Google Photos does this too. It's dramatically less tedious than manual tagging.

[^2]: Both `kMDItemFinderComment` and `kMDItemOMUserTags` are commonly suggested, as well. As far as I can tell, the former is inappropriate, while the latter is disused, except by legacy applications.

[^3]: `[...]$ chmod u+w "$photodb"`
