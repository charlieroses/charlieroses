Markup languages are my personal favorite. In the simplest description
possible, they are used to produce a pretty output. I'm gonna quickly go
over two common markup languages: HTML and Tex. Both of these are
probably worth your time to learn. I'm not going to go in depth on them,
but I'll definitely go over the main ideas.

---

## HTML

**H**yper**T**ext **M**arkup **L**anguage, or HTML is the main language
used for web development. In CS-164, it's the language you'll be using
on tux to create your websites. In fact, I've written this site in HTML
on tux. You can view the code by right clicking the page and clicking
"View Page Source".

Now the basis of HTML is tags. Each element has an opening tag and a
closing tag. These tags are nested inside each other to create the
document. All HTML documents start with a &lt;html&gt; tag and end with
a &lt;/html&gt; tag. Inside there is a &lt;head&gt; and a &lt;body&gt;.
Inside the &lt;body&gt;, we have elements like headers &lt;h3&gt; or
paragraphs &lt;p&gt;. Now what does this all mean? So the analogy I use
is a person. The &lt;html&gt; tag defines the document, this is defining
that this is a human. Then we have the &lt;head&gt; and &lt;body&gt;
tags. People also have heads and bodies. Inside the &lt;head&gt; tag
goes things you'd typically not see. The &lt;title&gt; of the website.
Maybe some JavaScript with functions. I consider this the brain. Nobody
can see your thinking inside your brain. That doesn't mean it's not
important. Inside the &lt;body&gt; goes elements you see. That's where
the images &lt;img&gt;, headers &lt;h1&gt;, and paragraphs &lt;p&gt; go.
These are the arms and legs and parts of my human body you see. The
JavaScript brain can tell these elements to have different functions.
Then CSS is the clothing, the style.

---

## CSS

What is CSS? I'm glad you asked. CSS is **C**ascading **S**tyle
**S**heet. Like I said before, CSS is the clothing and style of HTML.
See how my website has nice blues and greys. It's all because of CSS. My
fancy side bar of links. It's CSS. CSS gives HTML personality. There are
a few ways to use CSS. You can use inline styling, attach a CSS
stylesheet, or use the &lt;style&gt; tag in the &lt;head&gt; tag to add
style.

---

## HTML Editor

Below, I made a basic HTML editor. In the textarea on the left, type in
your HTML code, then press the "View" button and see what you've
created! This only works on HTML and CSS. No JavaScript. Was it
necessary to create this? No. Was I procrastinating other work? Clearly.

<button id="tryitout" onclick="interpretHTML()">View</button>
<iframe name="embed" src="languages/embeddedEdit.html"></iframe>

---

## Tex

Tex is a markup language used mainly for creating PDFs. Each Tex or
LaTeX document begins with a \\begin{document} and ends with a
\\end{document}. While HTML has &lt;tags&gt;, Tex has these control
sequences. These start with \\ and signifify different tokens and
actions within tex. Throw a Tex document into a compiler, and you get
out a beautiful PDF. I highly suggest taking the time to learn Tex or
LaTeX or whatever flavor you prefer. I use this to write all my essays
for every class. It looks more professional and you have much more
control than you would in Microsoft Word or some other word processor.

I included a reference sheet below, from Brown University. If you have
issues viewing the file below, you can follow this link. [TeX Reference
Card](languages/TeXRefCard.v1.5.pdf)

<embed id="texcard" src="languages/TeXRefCard.v1.5.pdf" type="application/pdf">


