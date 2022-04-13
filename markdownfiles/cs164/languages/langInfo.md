So let's talk a little bit about languages. What kind of languages are
there? Here are a few common types:

-   [Machine Language](cardiac/assMach.html)
-   [Assembly Language](cardiac/assMach.html)
-   Network Protocols
-   Command Languages
-   [Markup Languages](languages/markup.html)
-   [Programming Languages](languages/program.html)

So we've already gone over assembly and machine languages (see 5.3), so
I'm not gonna redo that. I also am not going to make a separate section
for Network Protocols and Command Languages as they aren't that
applicable to this course. You've already used markup languages like
HTML to build your website. Programming languages are most used to
accomplish a task. You'll be using Traquility in this course. These are
incredibly basic descriptions for very large categories of languages.
Each section goes in more depth as to how each pertains to this course.

---

## Doing Something With Something

Now, that heading is nearly meaningless, but I couldn't really think of
a better heading. Programming is the art of doing things. Well, how are
you doing things, by writing things. The things that you write and how
you write them is determined by the type of language you are using. With
markup languages, you tend to write code in a way that allows text to be
interpreted in a formatted way. With programming languages, you tend to
write more action based code to achieve a goal.

---

## Compiling Code

While you may write symbols and text as code, most times, computers
cannot read that code. The code needs to compiled into instructions that
the computer can best understand. Think about assembly and machine code
and the CARDIAC. We write assembly code to put our thoughts and logic
for the code on paper. When we input our code into the CARDIAC, we don't
type words like ADD or INP, we type the machine code because that's what
the CARDIAC understands. The CARDIAC doesn't understand ADD, but it
understands 2. The CARDIAC understands that when it recieves a 2
instruction, it should perform a function that adds a value from a
variable location to the accumulator. In this scenario, you act as the
"compiler" translating the assembly code into machine code.

A compiler has the following parts:\
**Lexical Analyzer :** With lexical meaning "word" (close enough), it's
rather clear the the lexical analyzer, analyzes the words/code you wrote
and breaks it into tokens.\
**Parser :** The parser then takes these tokens and identify them.
Below, there's a quick section on parse trees. I suggest taking a look.\
**Symbol Table :** This tracks the declaration and use of names. This is
what gives you that "Unknown Symbol" error when you mispell your
variable names.\
**Intermediate Code Generator :** Now an alternate representation of the
code is created.\
**Code Generator :** Creates the code in the target language, the
language whatever machine you are using best understands.\
**Optimizer :** Improves the space or CPU usage of the code

There's also an **interpreter** that processes the language and
operations as they are being read. A good example of an interpreted
language is Python (see CS-171/CS-172).

---

## Parsing and Parse Trees

As mentioned above, parsing is the process of taking tokens and
identifying them. We can use a parse tree to describe the behavior of a
program. Let's go through and create a parse tree for simple arithmetic
operations.

<div class="container">
`var : 4 + (3 * 2 / 7)`

![](languages/parsetree.png)
</div>

The process is fairly simple. Break down the expression into order of
operations. The first and smallest order of operations become a the
subtrees. From there, we build the parse tree upwards and outwards.

