# Tranquility Man Pages

I took a quick break from applying for graduate school to deal with mold in my
apartment.
This break was further extended when we realized that in Drexel time, it's week
6.
This means the [CS-164](../..//cs164/) students start learning
[Tranquility](https://www.cs.drexel.edu/~bls96/tranquility.pdf).

Tranquility is a nifty little language that
[BLS](https://www.cs.drexel.edu/~bls96/) wrote and I helped design to teach
basic programming concepts in CS-164.
We didn't want to teach everyone a language they could mindlessly slap on their
resume (if you're only using a language for 4 weeks in one class, you probably
don't know it well enough to put it on a resume).
The next course in the freshman sequence is
[CS-171: Computer Programming I](https://catalog.drexel.edu/search/?P=CS%20171)
which is Python 101, so it's not even our job to teach everyone programming.
The goal is to teach programming well enough to connect the higher-level
languages they'll see later to the assembly and machine code they learned with
the CARDIAC.
Thus, Tranquility was born.
It also comes with the added anti-plagiarism perk where it's very hard to Google
solutions in a language no one uses.

Last year, in the Fall term of the 21-22 academic year, we thought it would be
cool to have man pages for Tranquility.
I think it was because I managed to write syntax highlighting for Tranquility
(I'll do a blog post about this later).
The biggest issue we had was that we simply didn't have the time.
We decided to enlist the help of our students to 1) save us a little work and 2)
at the end of the day, the documentation is for them.
It makes sense to get their input on the documentation so that it's written in a
way they understand.
For [extra credit](../../cs164/labs/man_fa21.html) on their second project, they
could write a man page for their favorite built-in Tranquility function or the
compiler.

Today (literally like an hour ago) I finally finished compiling all their work
into the most miserable `groff` documents and created the first ever Tranquility
man pages!

This project was a lot of fun.
It's also really cool using `man`, a command I use frequently, and the content
that comes up is stuff I wrote.
A million "thank you"s to the students who did the extra credit and wrote a
page.
Their collaboration made the project even more fun to work on.
It did save me quite a bit of work and it also gave me a much-needed student
perspective when writing the pages.
I did credit each student as an author for the page they contributed to.

For the Drexel people who want the man pages on tux, add the following lines to
your `.bashrc`.

```bash
MANPATH="${MANPATH}:/home/bls96/cs164/man"
export MANPATH
```

Make sure to log out and back into tux (or run `source .bashrc`) to refresh
everything.

For those of you outside of Drexel, I've also compiled all the pages to HTML
with `groff` and posted them on my [CS-164 site](../../cs164/).

<center>
<table>
<tr>
<td>[tranqc(1)](../../cs164/languages/tranqc.html)</td>
<td>[alloc(3)](../../cs164/languages/alloc.html)</td>
<td>[button(3)](../../cs164/languages/button.html)</td>
</tr>
<tr>
<td>[buttonlabel(3)](../../cs164/languages/button.html)</td>
<td>[free(3)](../../cs164/languages/alloc.html)</td>
<td>[html(3)](../../cs164/languages/html.html)</td>
</tr>
<tr>
<td>[i2s(3)](../../cs164/languages/i2s.html)</td>
<td>[iprint(3)](../../cs164/languages/print.html)</td>
<td>[iread(3)](../../cs164/languages/read.html)</td>
</tr>
<tr>
<td>[makeimg(3)](../../cs164/languages/img.html)</td>
<td>[makelabel(3)](../../cs164/languages/label.html)</td>
<td>[maketable(3)](../../cs164/languages/table.html)</td>
</tr>
<tr>
<td>[random(3)](../../cs164/languages/random.html)</td>
<td>[setcell(3)](../../cs164/languages/table.html)</td>
<td>[setcellcolor(3)](../../cs164/languages/table.html)</td>
</tr>
<tr>
<td>[setimg(3)](../../cs164/languages/img.html)</td>
<td>[setlabel(3)](../../cs164/languages/label.html)</td>
<td>[sprint(3)](../../cs164/languages/print.html)</td>
</tr>
<tr>
<td>[sread(3)](../../cs164/languages/read.html)</td>
<td>[stoptimer(3)](../../cs164/languages/timer.html)</td>
<td>[timer(3)](../../cs164/languages/timer.html)</td>
</tr>
</table>
</center>
