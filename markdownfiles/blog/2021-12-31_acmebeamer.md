Technical, Side Projects
styles.css
# Acme Beamer Template

One of my few goals this break between classes was to work on some research
adjacent projects. The projects that are vaguely related to my research, but
don't actually progress it. One of these off shoot project was taking my
[[slides]](../../research/files/proposal.pdf)
from my
[thesis proposal](../20211212/thesisproposal.html)
and rewriting them in beamer. More specifically, writing a beamer theme so that
I can use this set up for the rest of my presentations for my senior thesis.

The theme is based on acme, the text editing environment for Plan 9. There are
the top two "navigations bars" that are used to create columns and such. When I
used acme, I tend to have a large area used for the file(s) I'm currently
editing then a "sidebar" with a directory of files I'm using, commands I want to
execute, or man pages I want to have open to reference. I tried to mimic this
set up in my beamer slides. I treated each section in the LaTeX file as a
directory and each subsection as a file in the directory.
Then, for any "blocks" like theorems and proofs, I modelled them off of rio, the
window manager for Plan 9, and rc, the shell. That styling is a lot more subtle
compared to the overall theme. There, it's just a white block with a cyan
outline. I'd like to add a "scroll bar", to accentuate the design choice, but
it's a bit more of a struggle than I was expecting. I need to play with the
tikz package more.

Beamer is an absolute beast. This project has taken many more days and hours
than I was expecting. Looking back, it's a good thing that I didn't try to do
this before my proposal or I probably wouldn't have finished on time. The theme
is almost perfect, I have a few issues I'm still working with.

First, I'd like to have subsubsection navigation. The table of contents isn't as
attractive or consistent as I was hoping. I've been working on reading beamer
documentation and source code and trying to implement the
`\insertsubsubsectionnavigation` function myself. I'm getting somewhere. I won't
say I'm close to being done until I'm done. Everyday beamer brings a new
challenge.

Second, there appears to be a bug with `allowframebreaks`. It's either a newly
found existing bug, or I created it when noodling with my theme. This was one of
my more recent finds, so I haven't looked at it in depth enough to find it's
source. There have been other bugs with `allowframebreaks`, but nothing related
to the one I have at hand.

Third and fourth, I've decided to name "design choices". I had originally wanted
to take (sub(sub))section names and "fileize" them. (Sub)Sections with
(sub)subsections would appear as "directories" in navigation. I also wanted to
remove spaces from the "file names" and make them lowercase. I prefer to keep my
file names lowercase as often as possible. I also wanted to prioritize the
content in the slide by using lowercase to draw less attention to the navigation
on the side. As for spaces, there should never be spaces in file names. After
hours of fighting beamer, I've decided it's up to the user to know how to name
their navigation "files", whether or not I agree with it. Then the other "design
choice" I'm making for the time being is the aforementioned rio scroll bar
omission. It's taking too much time to implement for something I don't know if
I'd like when it's done.


I have the template posted on
[GitHub](https://github.com/charlieroses/acmebeamertemplate).
I'll see how much time I have before classes get the above "bugs" fixed,

[[Thesis Proposal Slides in Google Slides]](../../research/files/proposal.pdf)

[[Thesis Proposal Slides in Beamer]](../../research/files/proposalT.pdf)

<center>
![An image of the acme editor <a href="https://commons.wikimedia.org/w/index.php?curid=2069950">From Wikipedia</a> under the <a href="http://opensource.org/licenses/LPL-1.02" title="Lucent Public License">LPL</a>](Acme.png)


![A slide from the presentation done in Google Slides](before.png)

![The same slide redone with the beamer template](after.png)

</center>

