---
layout: post
title:  "A Multi-Distro Linux Hardware Compatibility List"
date:   2018-02-26 00:00:01 -0700
categories: linux hcl pci pci.ids driver "device drivers" "hardware compatibility list"
published: false
---

<img src="/assets/hcl-part-1/front-page-before.png">

Years ago, I worked at a Linux-oriented systems integrator in Seattle. We built rackmount servers from commodity parts at a time when Linux support was an afterthought for larger vendors. Back then, drivers were always a problem.

Today, the situation is vastly better, as many manufacturers prioritize Linux support. But for some components, issues persist in the form of proprietary drivers, complicated 3rd party licenses, lack of backports, and version conflicts.

This is the first in a series of posts documenting the design of [pci.compatible.sh](http://pci.compatible.sh)--a new hardware compatibility database--and various aspects of its implementation.

### The Shortcomings of Existing HCLs

I've yet to see an HCL I wanted to use, or often found useful in my work--despite a perceived need for one. Linux Distributors, who by and large do an incredible job, haven't done as well communicating device support to their users.

One issue is incentive. So-called "enterprise" distributions seem to view HCLs as a marketing opportunity for preferred hardware vendors, and therefore only include a small subset of nominally compatible systems in their lists.[^1]

The Oracle HCL is a shining example of this tendency. It's brief and difficult. "Enterprise" lists also lack the context of other distributions and the upstream kernel. (Sometimes it's useful to know when Linus' tree added support for a device.)

Another issue is just finding devices.[1] In writing and in conversation, we tend to refer to devices by their common names, e.g. the Intel I350 Network Controller, but this turns out to be ambiguous...

### Identifying PCI Devices

PCI Devices are identified with a 16bit vendor id, 16bit vendor id, and optionally 16bit subsystem and subvendor ids (more on those later). For example, Intel's vendor id is `0x8086`, and the device id of the i350 Network Controller is `0x1524`.

The canonical, community-edited, directory of pci ids is published at [pci-ids.ucw.cz](https://pci-ids.ucw.cz/),[^2] and mirrored on [GitHub](https://github.com/pciutils/pciids). It's a pretty amazing resource, enabling--among other things--`lspci` to return a human-readable inventory of devices installed on a given system.

According to this resource, the case of the i350 network controller is not as simple as I've stated above. It has the device id `0x1524`-but also `0x1521`, and four others. Subsystem IDs further confuse matters by adding more than fifty closely related devices.

Corporate Acquisitions create problems, as well. Take AMD (`0x1022`), or is it AMD/ATI (`0x1002`)? Which does the company use today, for new devices, or does it continue to use both? Questions like these come up often, limiting the user's confidence.

Throughout the database, vagaries in naming convention, device classification, and abbreviation standards complicate search. An improved HCL needs to greatly reduce the friction of device search.

### A First Stab at Device Search

My first--not wholly successful--attempt at device search for [pci.compatible.sh](http://pci.compatible.sh) looks like this.

<img src="/assets/hcl-part-1/device-select.png">

Users first select a vendor. To get around the problem of mergers and name collisions, each vendor is displayed with the number and type of the devices associated with it. 

Here, LSI Logic (v: `0x1000`) has 379 storage controllers associated with it, and is therefore a likelier choice than the various other LSIs in the database.

<img src="/assets/hcl-part-1/subsystem-select.png">

Now a device is chosen, and if subsystems exist as well, a 3rd `<select>` appears populated with those options. 

It works okay, but badly for new users and for non-OEM parts--A later post will explore these inadequacies along with solutions to them.

### Linux PCI Device Drivers

So with a device chosen, which drivers support it?

Loadable kernel modules make this easy to check. When drivers are built as modules, an additional ELF section ".modinfo" is added that includes a list of supported devices. Check with `modinfo`

````bash
[…]$ modinfo igb
filename:       /lib/modules/3.10.0-693.17.1.el7.x86_64/kernel/drivers/net/ethernet/intel/igb/./igb.ko
version:        5.4.0-k
license:        GPL
description:    Intel(R) Gigabit Ethernet Network Driver
author:         Intel Corporation, <e1000-devel@lists.sourceforge.net>
rhelversion:    7.4
srcversion:     10DC5F00A6D6C21896DA93E
alias:          pci:v00008086d000010D6sv*sd*bc*sc*i*
alias:          pci:v00008086d000010A9sv*sd*bc*sc*i*
alias:          pci:v00008086d000010A7sv*sd*bc*sc*i*
alias:          pci:v00008086d000010E8sv*sd*bc*sc*i*
[...snip...]
````

Or with `readelf`

````bash
[...]$ readelf -p .modinfo ./igb.ko
String dump of section '.modinfo':
  [     0]  parm=debug:Debug level (0=none,...,16=all)
  [    2b]  parmtype=debug:int
  [    3e]  version=5.4.0-k
  [    4e]  license=GPL
  [    5a]  description=Intel(R) Gigabit Ethernet Network Driver
  [    8f]  author=Intel Corporation, <e1000-devel@lists.sourceforge.net>
  [    cd]  parm=max_vfs:Maximum number of virtual functions to allocate per physical function
  [   120]  parmtype=max_vfs:uint
  [   140]  rhelversion=7.4
  [   150]  srcversion=10DC5F00A6D6C21896DA93E
  [   173]  alias=pci:v00008086d000010D6sv*sd*bc*sc*i*
  [   19e]  alias=pci:v00008086d000010A9sv*sd*bc*sc*i*
  [   1c9]  alias=pci:v00008086d000010A7sv*sd*bc*sc*i*
  [   1f4]  alias=pci:v00008086d000010E8sv*sd*bc*sc*i*
  [   21f]  alias=pci:v00008086d00001526sv*sd*bc*sc*i*
  [   24a]  alias=pci:v00008086d0000150Dsv*sd*bc*sc*i*
  [   275]  alias=pci:v00008086d000010E7sv*sd*bc*sc*i*
[...snip...]

````

Built-ins work differently, so its convenient that most distributions have adopted a policy of shipping device drivers as loadable modules.

### As Many Distros As Possible

A key feature of [pci.compatible.sh](http://pci.compatible.sh) is support for multiple distros, going back to their first use of the 2.6 kernel, and the upstream Linux kernel going back to 2.6.9.

<img src="/assets/hcl-part-1/distro-select.png">

Most HCLs focus on current releases, but issues of driver support are nearly guaranteed when slightly older releases are paired newer hardware--a common enough scenario. 

In such cases it's useful to know when device support was introduced. Here we can see that CentOS has supported the 3Ware 9000S SATA RAID Controller since its 4.0 release. (It's an archaic device.)

<img src="/assets/hcl-part-1/3w-9xxx.png">

At present, support is limited to three rpm-based distros and the upstream kernel. I hope to add Debian and Ubuntu, in the future, but their public archives are less complete. (If you have access to older repositories, please get in touch!)

### Borrowing A Good Idea From Debian

The [Debian HCL](https://kmuto.jp/debian/hcl/index.rhtml) is different from others I've worked with--and better. You paste the output of `lspci -n` into a textarea, as below.

<img src="/assets/hcl-part-1/debian-before.png">

It reports the compatibility of each device found, so that the system's compatibility can be understood at a glance.

<img src="/assets/hcl-part-1/debian-after.png">

This approach has some obvious advantages over individual device lookup, and is well worth copying. 

One possible improvement is to call attention--through color or ordering--to the disk and network controllers, since their compatibility has the most to do with problems during installation.

### Next Steps

So that's the project in outline: a cross-vendor HCL that borrows Debian's UI for checking full systems, while paying closer attention to device search, and archival releases. A version exists today at [pci.compatible.sh](http://pci.compatible.sh), but it needs work to be more generally useful.

Subsequent posts will explore improvements to the existing site, as well as any issues around testing, CI, and deployment that cross an arbitrary (and low) threshold of interest. 

**Comment** and **Suggestion** to **<mailto:patrick.mcmurchie@gmail.com>**

[^1]: This post is largely primarily concerned with PCI devices. "Enterprise" HCLs typically require hardware vendors to load-test systems and jump through various other hoops.

[^2]: https://pci-ids.ucw.cz/
