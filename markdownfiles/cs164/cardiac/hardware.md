## HARDware more like CARDware

The CARDIAC is made completely out of cardboard. In fact, one might even
say that the CARDIAC is made of cardstock, which is even cheaper than
cardboard. The main idea is that there is no big fancy graphics card.
There is no face recognition camera. The CARDIAC is a functional
computer made out of cardboard, or cardstock if you want to get
technical. A main thing to realize is that a computer doesn't always
mean a desktop, or a laptop, or a smart phone. When I refer to hardware,
I'm referring to what makes up this computer. What are the pieces we put
together to make computer, specifically the CARDIAC. I'll give you a
hint, it's not just cardboard (or cardstock either).

---

## Organization

There are four major elements to the organization of a computer. We have
the Input devices. There are output devices. There's the CPU, or the
Central Processing Unit. Lastly, there's the memory. I'll explain each
item and then how they each relate to the CARDIAC.

---

## Input

When thinking of a typical desktop computer, what types of devices do we
use to input to the computer. Of course there's the keyboard and the
mouse. These are preprogrammed devices that automatically translate
simple button presses into code that the computer understands. These can
include storage devices like disks, tapes and USB flash drives.

In the CARDIAC, the input is a deck. The deck is a deck of cards full of
commands and variables and numbers. Back before verbose programming
languages, the way humans interacted with computers was very different.
People couldn't just talk to a computer. Programmers punched holes in
each card to specify a specific command. So for example a 400 line
program would be a stack of 400 cards. Below you can see two punchcards.
One is from Bell Labs, the people that created the CARDIAC. The other is
a FORTRAN puch card from CERN, a European Center for Nuclear Research.
As you can see, the punch cards have lines of numbers and letters. For
each line of code or command you'd punch in each value and move onto the
next card. From there you'd put your deck of cards into the computer and
the code would run. The deck of the CARDIAC is a deck of numbers the
user inputs. These numbers can be variables or commands or memory
locations. The most important thing to recognize is that this deck is
just all numbers.

<center>
<div class="container">
![](cardiac/bellPunch.gif)
![](cardiac/fortran.gif)
</div>
</center>

---

## Output

Output devices are plain and simple. It's a device that outputs
something for a user. On your typical commercial desktop computer an
output device is the moniter or a screen. An output device could also be
a printer. On the CARDIAC let's also consider our output device to be a
printer. There's no fancy colors or toner you have to buy. All the
CARDIAC's "printer" does is print out numbers when it comes across the
output operand. That's all it is. There's no fun history behind outputs.
Life is full of disappointments.

---

## Memory

Memory is where everything is stored in the computer. Everything is
stored as 1s and 0s. It's an array of bytes. There are memory locations
0 through 2^n^-1. So if n=8 I have 256 memory locations labelled 0-255.
In the case of the CARDIAC, we have 100 memory locations numbered 00-99.
The CARDIAC is a little different as 100 does not follow the power of
two rule. We'll choose to ignore this minor inconvenience. A more
pressing problem is the fact is the CARDIAC is cardstock not cardboard.
That's my own personal vendetta. I used to work at a craft store.\
\
A big thing to note about memory is how variables interact with memory.
Variables are an alias for a place in memory. Variables are NOT what is
stored at that memory point. Consider it like mailboxes or PO boxes.
There's lots of mailboxes each with their own number and address. If my
wonderful mother sends me a letter, it is put inside my mailbox. When I
go to retrieve my letter I go to my mailbox, and I get the letter from
inside it. I do NOT rip the mailbox from the ground. I do NOT take my
mailbox into my house. My mailbox is not the letter. My mailbox is where
the letter from my wonderful mother is. The contents of my mailbox can
change. Let's say my beautiful boyfriend sends me a equally beautiful
letter. Once again this is put in my mailbox. The letter from my mother
is no longer inside the mailbox. Now the letter from my boyfriend is in
my mailbox. My mailbox is not tied to a specific letter or package. It
is free to contain whatever.

Now let's look at variables from a mathmatical standpoint. Variables in
math typically hold numbers. Look at the following problem. It's a very
simple algebra just to understand how variables work. It is important to
know that math is a big part of computer science.

            <code>
                x = 5
                <br>
                x + 2 = y
                <br>
                y = 7
                <br>
                x + y = 12
            </code>

So above, x is "equal to" 5. I use the words equal to in quotes.
Remember, x is not 5, x is where 5 is stored. On a TI-84 calculator,
there's a way to make programs. It uses the language TI-BASIC. In
TI-BASIC, the way to assign a variable a value, you use the STORE
function. It's much easier to remember that variables do not equal it's
value this way. So anyway, as you can see, when we add x and y, we do
not add the letters and create some mutant xy letter. We refer back to 5
and we refer back to 7 and then we get the answer of 12. It's also
important to differentiate between the fact that x + y is equal to 12.
12 is NOT stored in x + y. There is a very big difference between
equating two objects and storing a variable. In many programming
languages, storing a variable uses the **=** operator and comparing and
equating two values uses the **==** operator. This is a very common
error when programming.

TL;DR Variables are not equal to a variable, they are the alias to where
the variable is stored.

---

## CPU

CPU stand for Central Processing Unit. On the CARDIAC there are a few
major components

-   **ALU:** Arithmetic Logic Unit
-   Registers
    -   **GPR:** General Purpose Register or Accumulator
    -   **IR:** Instruction Register
    -   **PC:** Program Counter or Intruction Pointer
-   **ID:** Instruction Decoder

![](cardiac/CPU.png)


Depending on different instructions in the CARDIAC, different processes
will happen. However, there is a general idea that the CARDIAC goes
through when it runs programs. The general process goes as follows:

-   The Data From Memory is sent to the Program Counter and the
    Instruction Register
-   The PC keeps everything on track. It keeps the flow of the program
    and makes sure that we are in the right place at the right time.
-   After each iteration the PC increments.
-   The IR has a list of instructions within it. It actually tells the
    computer what to do. The IR translates what we coded into something
    the computer can understand.
-   The ID decodes the IR's instructions. It decodes the instructions
    into the controls for the ALU
-   The ALU is the same ALU as in the last tutorial that adds and
    subtracts binary
-   The GPR is also called the accumulator. This is like a memory point
    where addition and subtraction occur.
-   The ALU and the GPR use the controls and instructions to do what
    they're supposed to.
-   Finally the output is written to the Memory

---

Punch Card Image credit: [Douglas W. Jones's collection of punched cards
with
logos](https://homepage.divms.uiowa.edu/~jones/cards/collection/i-logo.html)


