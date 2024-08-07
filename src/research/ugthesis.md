# Undergraduate Thesis - Screen Implementations for Plan 9 on the Raspberry Pi4

In 2012, Richard Miller wrote a port of Plan9 for the Raspberry Pi. The Pi has
become an increasingly popular platform for Plan9. I spent the spring and summer
doing miscellaneous minor projects to get comfortable with the operating system.
This work transitioned into my undergraduate senior thesis in the fall. My
thesis defense is scheduled for late May 2022.

Most recently, I've implemented interactive scaling wallpaper for `rio`, the
windowing system for Plan9. I used the wallpaper support provided by
[Devine Lu Linvega](https://wiki.xxiivv.com/site/rio.html) as a starting point,
then added scaling based on the window size and interaction with the `wctl`
files to change the wallpaper while running. The source code is posted on
[GitHub](https://github.com/charlieroses/rio-wallpaper).

I've now transitioned this work to my undergraduate thesis. The Pi port of Plan9
does not support the use of the
[Raspberry Pi 7" Touch Display](https://www.raspberrypi.com/products/raspberry-pi-touch-display/).
The primary goal of my work is to get the screen working as a monitor. Once this
is implemented, I'll be looking into the unique way the mouse and all three
buttons are used in Plan9 in order to find the best way to implement the touch
screen. While adding this functionality, I'll also be exploring the techniques
used to write the operating system and implementing these values when writing my
additions.

On December 10th, I successfully proposed my thesis to my committee. I wrote a
more comprehensive blog post about the proposal experience. They didn't require
me to write up a formal proposal document. I did present a
[[slide deck]](files/proposal.pdf)
of my initial research and literature review for about an hour.
I did the slides based on the Plan 9 editor, acme, in Google Docs. I really like
how they came out, so I'm working on making a proper beamer template for them.
I'm almost finished and I'll post it when I'm done.

- Rio Work
	- [Image Resizing Blogpost](../blogposts/20211025/resizmple.html)
	- [Interactive Wallpapers in Rio Blogpost](../blogposts/20220112/riowallpaper.html)
	- [Rio Source Code](https://github.com/charlieroses/rio-wallpaper)
- Thesis Proposal
	- [Thesis Proposal Blogpost](../blogposts/20211212/thesisproposal.html)
	- Slide Deck [[Google Slides PDF]](files/proposal.pdf)
		[[Beamer PDF]](files/proposalT.pdf)
	- [Acme Beamer Template Blogpost](../blogposts/20211231/acmebeamer.html)
	- [Acme Beamer Template Source Code](https://github.com/charlieroses/acmebeamertemplate)
