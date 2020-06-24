# Reorganizing my Pokemon Collection Website

### A Quick Background

A lifelong passion of mine has been Pokemon. It definitely started as a child
watching the TV show and movies and playing the video games on my Nintendo
system. I also started collecting the trading cards as a kid. My collecting 
habits were that of a 5th grader. I wanted cards that looked cool. I would get
random packs when I saw them in stores. I kept them in an unceremonious shoe 
box to be forgotten for many years. In late high school, I moved into my 
mother's basement so my two brothers could finally have their own rooms. In
my new basement bedroom, I found our humble shoebox collection, and took the
time to organize it. My brothers always talked about getting a value on it to
sell, but I couldn't part with it. I sat down and properly organized the cards
into binders. I started properly learning about collecting and what these cards
meant.

During my summer break after my first year of college, I ended up taking the cards 
and putting them into a large Google Sheets file. My intention was to make it 
easier to tell what cards I have and don't. The Google Sheets was sufficient for
what I needed. As I progressed through college, I learned more about web dev and
decided that was how I was going to visualize my collection. My Google Sheets 
became CSV files and I started programming. I spit out the most hideous spaghetti
code. I used Python scripts to turn my CSV files into JSON files, then AJAX
calls to refence those JSON files. I had API calls to a site I wasn't using anymore
to try and pull prices. It was a proper sprint of unbridled, unplanned work and at 
the end of the week, I had a completed site. However, it was nearly impossible to 
expand on and I wasn't incredibly proud of my work. As I continued to collect cards, 
I continued to update my CSV files, but not my website.

Now I have met myself in the present day. With the recent quarantine, and what I've
learned building this .dev website, I've decided to give my poor Pokemon Card
Collection a much needed face lift. I really want to create something I'm proud of,
that I can expand on, and reference easily.

### Step 1 : Data Management

So the first thing I did was take a closer look at my CSV files to see what I was 
working with. I had originally created a sort of relational database though my
100+ CSV files. I started with the main sets, since there's almost 90 of them, all
exactly the same set up. I have a file called `setsinfo.csv` that has information
on each of these sets. From there, the first column is the set name. I take the set
name, remove the spaces and change the upper to lower case, and now I have the file
name. From there I can add a file extension whether I want the CSV file, the set image
or the HTML file for the set. I have a variety of files like this for the Pop Series
Promo, Black Star Promo, and Half Deck files. 

I also wrote a quick `awk` script to remove the last X columns from the CSV files 
from when I was attempting to use API calls. I haven't used awk properly before.
I've used it in a classroom setting in a UNIX course for one week. That being said,
I can't say much stuck. Thankfully, I save all my lecture slides and was able to
reference those. My first awk scripts were messy, but I was really proud of the 
fact I used awk, so I kept them around.

I made sure all the data was standard and I was ready to start turning it into HTML.

### Step 2 : Building the Site

I was using HTML tables to display my cards on my old site, and I actually really
liked the way I was displaying the tables. However, originally, I was using AJAX 
calls to grab JSON objects which I then used JavaScript functions to operate on.
Since I'm going for a static page without JSON files and objects, I needed a new
approach.

Once again, I'm using a bash script to build my site. I really liked this way to
build my dev site and I'm really happy with the workflow and results. From here,
I could use bash to dissect my CSV files and compile them into an HTML table. I 
realized this is a bit of a disgusting solution. I returned to awk and was able
to create an incredibly simple script to turn CSV files into HTML tables. I'm really
starting to love awk from this project. It's really simple and fun and efficient.

I don't think there's much more to say than that. Just a series of awk scripts 
being run by a bash script to create each HTML page for each set. The landing page
was completed generated from the bash script. When I create the HTML page, I also
append a link to said page on the menu. I have more plans for the pages to include
more information. I haven't decided how I want to display that or what information
I want to display yet.


