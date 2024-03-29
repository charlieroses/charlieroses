Base-2 is also called Binary.
Binary is the way computers store information.
At first glance, binary looks like an extremely long incomprehensible line of 0s
and 1s.
It's nearly impossible to believe that these seemingly random numbers could mean
anything, much less the reason computers can do everything they do.

Before we learn how to interpret binary, let's go over some of the words we'll
use when we talk about binary.
In base-10, we have digits that are used in each place value.
In binary, we call these **bits**, short for **b**inary **d**igit.
When we put eight of these next to each other, we call it a **byte**.
When we put four of these together, it's called a nibble _(because it's not a
full bite)_.


---

## Binary to Decimal

Let's start with an eight bit number, one byte of information.
Let's consider a random 8 bit number, **10011101**.

><
|       ||      |      |      |      |      |      |      |      |
|-------||------|------|------|------|------|------|------|------|
| Bit   || 1    | 0    | 0    | 1    | 1    | 1    | 0    | 1    |
| Power || 2^7^ | 2^6^ | 2^5^ | 2^4^ | 2^3^ | 2^2^ | 2^1^ | 2^0^ |
| Value || 128  | 0    | 0    | 16   | 8    | 4    | 0    | 1    |
><

Each bit can hold a 0 or 1.
Since we're working in base-2, this makes sense because the range of digits is
`0` to `2-1=1`.
We can translate this number to base-10 by using the Power x Bit formula we
made.
**(1 \* 2^7^) + (0 \* 2^6^) + (0 \* 2^5^) + (1 \* 2^4^) + (1 \* 2^3^) +
(1 \* 2^2^) + (0 \* 2^1^) + (1 \* 2^0^)**.
This translates to **(1 \* 128) + 0 + 0 + (1 \* 16) + (1 \* 8) + (1 \* 4) + 0 +
(1 \* 1)**.
This means that the 8 bit binary number 10011101 is equal to the base-10 number
157.
To denote different bases, we can use subscripts.
10011101~2~ = 157~10~

This was a very basic look into binary. If you move onto Chapter 2, you
can learn much more about fractional binary and negative binary and so
on and so forth.

---

## Decimal to Binary

There are two different processes for converting to binary.
I'll be going over both.
One isn't better or worse than the other.
You won't be forced to use one over the other.
It's good to know how both work, but use whichever you understand more.

### Introducing Modulo

Before jumping right into it, you'll need to know about an operator you likely
haven't seen before in "regular math".
This operator is called **modulo**.
It returns the remainder after division.
While `/` is used to represent division, `%` is used to represent modulo.

In this table, I took the value, `x` and divided it by 3, then also moduloed it
by 3 so you can see how they interact.
When dividing, I chopped off any fractional values.
This is called **truncating**, or **flooring**, or "rounding to the lower whole
number".

><
|       ||   |   |   |   |   |   |   |   |   |   |    |
|-------||---|---|---|---|---|---|---|---|---|---|----|
| x     || 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| x / 3 || 0 | 0 | 0 | 1 | 1 | 1 | 2 | 2 | 2 | 3 | 3  |
| x % 3 || 0 | 1 | 2 | 0 | 1 | 2 | 0 | 1 | 2 | 0 | 1  |
><

There are a lot more really cool things you can do with modular arithmetic
(the kind of math that uses modulo).
It's part of what allows cryptography (which we'll talk more about later) to be
so secure.
Right now, all that matters is that we understand that modulo provides the
remainder after division.


### Process A

Let's use the base-10 number **104~10~** and find out how we'd represent it as
an 8 bit binary nuumber.
Since we're using 8 bits, the first power is 2^7^ (128).
We're going to separately divide and modulo our starting value by 2^7^.
Again, I'll be dropping all fractional components when dividing.
The division will give us what value belongs in the 2^7^ place value.
The modulo will give us what value will be used next.

><
<div class="sidebyside">
| ||                |
|-||----------------|
| || ``204 / 2^7^`` |
| || ``204 / 128``  |
| || ``**1**``      |

| ||                |
|-||----------------|
| || ``204 % 2^7^`` |
| || ``204 % 128``  |
| || ``**76**``     |
</div>
><

The next bit is the 2^6^ (64) place.
Again, we perform division and a modulo, this time on 76:

><
<div class="sidebyside">
| ||               |
|-||---------------|
| || ``76 / 2^7^`` |
| || ``76 / 128``  |
| || ``**1**``     |

| ||               |
|-||---------------|
| || ``76 % 2^7^`` |
| || ``76 % 128``  |
| || ``**12**``    |
</div>
><

The process continues for each place value.
I finished it below:

><
|      ||                     |                       |
|------||---------------------|-----------------------|
| 2^7^ || ``204 % 128 = 76``  | ``204 / 128 = **1**`` |
| 2^6^ || ``76 % 64 = 12``    | ``76 / 64 = **1**``   |
| 2^5^ || ``12 % 32 = 12``    | ``12 / 32 = **0**``   |
| 2^4^ || ``12 % 16 = 12``    | ``12 / 16 = **0**``   |
| 2^3^ || ``12 % 8 = 4``      | ``12 / 8 = **1**``    |
| 2^2^ || ``4 % 4 = 0``       | ``4 / 4 = **1**``     |
| 2^1^ || ``0 % 2 = 0``       | ``0 / 2 = **0**``     |
| 2^0^ || ``0 % 1 = 0``       | ``0 / 1 = **0**``     |
><

When we put each bit in its respective place value, we see that
``204~10~ = 11001100~2~``

Though, how can we be sure we got the right answer?
We could Google it and see what the internet tells us, but that's not a good
idea.
It'll get very exhausting very quickly if you rely on the internet for all your
validation.
Besides, you can't use the internet on exams, so you'll have to learn how to
rely on yourself.

So how do we check our work?
Do the same thing in reverse!

><
|       ||      |      |      |      |      |      |      |      |
|-------||------|------|------|------|------|------|------|------|
| Bit   || 1    | 1    | 0    | 0    | 1    | 1    | 0    | 0    |
| Power || 2^7^ | 2^6^ | 2^5^ | 2^4^ | 2^3^ | 2^2^ | 2^1^ | 2^0^ |
| Value || 128  | 64   | 0    | 0    | 8    | 4    | 0    | 0    |
><

Here we are!
`128 + 64 + 0 + 0 + 8 + 4 + 0 + 0 = 204` which means we did our math correctly!


### Process B

In the previous method, we moved left to right filling bits into place values.
This time, we're going to go the opposite direction and fill bits into place
values from right to left.
Instead of starting with a large power of 2 and working our way down, we're
going to repeatedly divide and modulo by 2 until we reach 0.

Let's use 204~10~ as an example again.
We're going to separately divide and modulo our starting value by 2.
As always, I'll be dropping all fractional components when dividing.
This time around, the modulo will give us what value belongs in the 2^i-1^ place
value and the division will give us what value to use next.

><
<div class="sidebyside">
| ||             |
|-||-------------|
| || ``204 / 2`` |
| || ``**102**`` |

| ||             |
|-||-------------|
| || ``204 % 2`` |
| || ``**0**``   |
</div>
><

To keep track of how many divisions we've performed, I'm going to create an
iteration variable named `i`.
An iteration is something that happens over an over again.
Since this was our first division/modulo, `i=1`.
Based on the modulo done in the first step, the bit in the
<code>2^i-1^ = 2^1-1^ = 2^0^</code> place value is 0.
In our next step, we're going to use the result of our division, 102.

><
<div class="sidebyside">
| ||             |
|-||-------------|
| || ``102 / 2`` |
| || ``**51**``  |

| ||             |
|-||-------------|
| || ``102 % 2`` |
| || ``**0**``   |
</div>
><

Our second iteration (`i=2`) gave us the bit for the
<code>2^i-1^ = 2^2-1^ = 2^1^</code> place value.
It's 0 again.
Just as before, rinse and repeat.
I finished the conversion below.

><
|         ||                 |                     |
|---------||-----------------|---------------------|
| `i = 1` || `204 / 2 = 102` | ``204 % 2 = **0**`` |
| `i = 2` || `102 / 2 = 51`  | ``102 % 2 = **0**`` |
| `i = 3` || `51 / 2 = 25`   | ``51 % 2 = **1**``  |
| `i = 4` || `25 / 2 = 12`   | ``25 % 2 = **1**``  |
| `i = 5` || `12 / 2 = 6`    | ``12 % 2 = **0**``  |
| `i = 6` || `6 / 2 = 3`     | ``6 % 2 = **0**``   |
| `i = 7` || `3 / 2 = 1`     | ``3 % 2 = **1**``   |
| `i = 8` || `1 / 2 = 0`     | ``1 % 2 = **1**``   |
><

Just as before, if we put each bit in it's respective 2^i-1^ place, we get
<code>204~10~ = 11001100~2~</code>.

Again, it's always good to check your work, but I've already shown you how to do
that above, so I'm not gonna do it again, but you should do it on your own.

---

## Practice

Below I've made two little tools to help you practice converting between bases.
With each, the largest number you'll get is a 16 bit binary number.
You can change the values in all the text boxes.
Feel free to enter your own numbers.

<center>
<table id="decimal-to-binary" class="practice">
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Decimal to Binary</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
What is
<textarea id="base10num"></textarea>
represented as a binary number in
<textarea id="numbits"></textarea>
bits?
</td>
</tr>
<tr>
<td></td>
<td><textarea id="binaryanswer"></textarea><span id="decbincorrect">&nbsp;</span></td>
</tr>
<tr>
<td></td>
<td>
<button onclick="decbincheck()">Check Answer</button>
<button onclick="decbingenerate()">Reset</button>
</td>
</tr>
</tbody>
</table>
<br><br><br>
<table id="binary-to-decimal" class="practice">
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Binary to Decimal</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
What is
<textarea id="binarynum"></textarea>
represented as a decimal (base 10) number?
</td>
</tr>
<tr>
<td></td>
<td><textarea id="decanswer"></textarea><span id="bindeccorrect">&nbsp;</span></td>
</tr>
<tr>
<td></td>
<td>
<button onclick="bindeccheck()">Check Answer</button>
<button onclick="bindecgenerate()">Reset</button>
</td>
</tr>
</tbody>
</table>
</center>

<script>
decbingenerate();
bindecgenerate();
</script>

