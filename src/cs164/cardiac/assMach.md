We finally have all the tools we need to program the CARDIAC. Let's
bring everything we know together and do some computing. When we write
code, we don't just magically pull numbers out of thin air. Whenever you
write a program, it is very important to plan out what you're gonna do.
Assembly Code is sorta like the "planning" machine code. Machine Code is
the hard numbers, nothing else. Assembly code uses words and alongside
machine code, make the code very clear and easy to debug. Let's write a
program that adds a bunch of numbers until a negative number is
entered.

So when writing assembly code, there are 3 main columns; the memory
location's name, the operation and then what the operation applies to.
Below is an example.

```
crntVal DATA   000
sum     DATA   000

start   INP    crntVal
        CLA    crntVal
        TAC    output
        ADD    sum
        STO    sum
        JMP    start
end     OUT    sum
        HRS
```

Let's read along the code and understand what's going on. You'll learn
so much more about logic and computing and programming just by reading
and understanding code. There's this idea that you can solve any
programming problem by copying and pasting the question into Google,
following the first link to StackExchange, then copying and pasting the
first answer into your document. This is what we call bad coding
techniques. Anyway, let's read through. First I made two data points
called crntVal, or Current Value, and sum, the sum of the numbers. When
I start my program, I want these values to be empty or 0. The first
column has crntVal and sum. These are the names for the DATA points that
contain 000. Then we move to the start point. In the start point, there
is the INP operation. This will input the top card in our deck into the
memory location being referenced. The memory location being referenced
is crntVal. Since there is nothing else to do, we move onto the next
line. This line doesn't have an explicit memory point name. Since this
is never referenced, it doesn't need a name. This line says we clear the
accumulator and add crntVal. Now the accumulator has whatever value was
in crntVal which was also the top card in our deck. As we move onto the
next line, we test the accumulator and check if it's negative. If
negative, we jump to memory location end where we output the sum and
HRS, ending the program. If the accumulator is positive, we do nothing
and continue on in our program. The next line is to ADD whatever is in
the sum memory location. This just added the whatever number was at the
top of our deck to a running sum. Now lets save the running sum. Right
now its in the accumulator which contains an ever changin value. We want
something more permanent. The next line uses the STO operation to store
the value in the accumulator into the sum location. Finally we move onto
the JMP operation which jumps to the start again.


Now that we know what our code does, let's convert this into something
the CARDIAC can use. Instead of names for the memory point, we're going
to use the actual numbers for the memory point. When working with the
CARDIAC, typically you use memory point 00-02 for bootstrapping a deck,
memory points 03-09 for any variables or data points to use and 10-99
for the lines of code. So when doing machine code, instead of three
columns, there's only 2. One column is the memory location, the other is
the operation. Below I converted the assembly code from above into
machine code.

```
03   000
04   000

10   003
11   103
12   316
13   204
14   604
15   810
16   504
17   900
```

See how above, the first digit of the 3 digit operation is the opcode
that relates to the operation we were doing. The second two digits
relate to the memory point they're referencing. This code does the exact
same thign as the assembly code above. Assembly code is for people to
understand. Machine code is for computers to understand. To run this,
I'd put each of these commands in their corresponding memory points. I'd
set my PC, to 10 since that is where I want my program to begin. Then
fill my deck with numbers I want to add. Finally you step through the
program.


