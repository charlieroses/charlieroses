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

<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</thead>
<tbody>
<tr>
<th>Bit</th>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<th>Power</th>
<td>2<sup>7</sup></td>
<td>2<sup>6</sup></td>
<td>2<sup>5</sup></td>
<td>2<sup>4</sup></td>
<td>2<sup>3</sup></td>
<td>2<sup>2</sup></td>
<td>2<sup>1</sup></td>
<td>2<sup>0</sup></td>
</tr>
<tr>
<th>Value</th>
<td>128</td>
<td>0</td>
<td>0</td>
<td>16</td>
<td>8</td>
<td>4</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>
</center>


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

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr></thead>
<tbody>
<tr>
<th>x</th>
<td>0</td>
<td>1</td>
<td>2</td>
<td>3</td>
<td>4</td>
<td>5</td>
<td>6</td>
<td>7</td>
<td>8</td>
<td>9</td>
<td>10</td>
</tr>
<tr>
<th>x / 3</th>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>2</td>
<td>2</td>
<td>2</td>
<td>3</td>
<td>3</td>
</tr>
<tr>
<th>x % 3</th>
<td>0</td>
<td>1</td>
<td>2</td>
<td>0</td>
<td>1</td>
<td>2</td>
<td>0</td>
<td>1</td>
<td>2</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>
</center>

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

<center>
<div class="sidebyside">
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>204 / 2^7^</code></td></tr>
<tr><td></td><td><code>204 / 128</code></td></tr>
<tr><td></td><td><code>**1**</code></td></tr>
</tbody>
</table>

<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>204 % 2^7^</code></td></tr>
<tr><td></td><td><code>204 % 128</code></td></tr>
<tr><td></td><td><code>**76**</code></td></tr>
</tbody>
</table>
</div>
</center>

The next bit is the 2^6^ (64) place.
Again, we perform division and a modulo, this time on 76:

<center>
<div class="sidebyside">
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>76 / 2^6^</code></td></tr>
<tr><td></td><td><code>76 / 64</code></td></tr>
<tr><td></td><td><code>**1**</code></td></tr>
</tbody>
</table>

<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>76 % 2^6^</code></td></tr>
<tr><td></td><td><code>76 % 64</code></td></tr>
<tr><td></td><td><code>**12**</code></td></tr>
</tbody>
</table>
</div>
</center>

The process continues for each place value.
I finished it below:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr>
<th><code>2^7^</code></th>
<td><code>204 % 128 = 76</code></td>
<td></td>
<td><code>204 / 128 = **1**</code></td>
</tr>
<tr>
<th><code>2^6^</code></th>
<td><code>76 % 64 = 12</code></td>
<td></td>
<td><code>76 / 64 = **1**</code></td>
</tr>
<tr>
<th><code>2^5^</code></th>
<td><code>12 % 32 = 12</code></td>
<td></td>
<td><code>12 / 32 = **0**</code></td>
</tr>
<tr>
<th><code>2^4^</code></th>
<td><code>12 % 16 = 12</code></td>
<td></td>
<td><code>12 / 16 = **0**</code></td>
</tr>
<tr>
<th><code>2^3^</code></th>
<td><code>12 % 8 = 4</code></td>
<td></td>
<td><code>12 / 8 = **1**</code></td>
</tr>
<tr>
<th><code>2^2^</code></th>
<td><code>4 % 4 = 0</code></td>
<td></td>
<td><code>4 / 4 = **1**</code></td>
</tr>
<tr>
<th><code>2^1^</code></th>
<td><code>0 % 2 = 0</code></td>
<td></td>
<td><code>0 / 2 = **0**</code></td>
</tr>
<tr>
<th><code>2^0^</code></th>
<td><code>0 % 1 = 0</code></td>
<td></td>
<td><code>0 / 1 = **0**</code></td>
</tr>
</tbody>
</table>
</center>


When we put each bit in its respective place value, we see that
<code>204~10~ = 11001100~2~</code>

Though, how can we be sure we got the right answer?
We could Google it and see what the internet tells us, but that's not a good
idea.
It'll get very exhausting very quickly if you rely on the internet for all your
validation.
Besides, you can't use the internet on exams, so you'll have to learn how to
rely on yourself.

So how do we check our work?
Do the same thing in reverse!


<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</thead>
<tbody>
<tr>
<th>Bit</th>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<th>Power</th>
<td>2<sup>7</sup></td>
<td>2<sup>6</sup></td>
<td>2<sup>5</sup></td>
<td>2<sup>4</sup></td>
<td>2<sup>3</sup></td>
<td>2<sup>2</sup></td>
<td>2<sup>1</sup></td>
<td>2<sup>0</sup></td>
</tr>
<tr>
<th>Value</th>
<td>128</td>
<td>64</td>
<td>0</td>
<td>0</td>
<td>8</td>
<td>4</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>
</center>

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

<center>
<div class="sidebyside">
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>204 / 2</code></td></tr>
<tr><td></td><td><code>**102**</code></td></tr>
</tbody>
</table>

<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>204 % 2</code></td></tr>
<tr><td></td><td><code>**0**</code></td></tr>
</tbody>
</table>
</div>
</center>

To keep track of how many divisions we've performed, I'm going to create an
iteration variable named `i`.
An iteration is something that happens over an over again.
Since this was our first division/modulo, `i=1`.
Based on the modulo done in the first step, the bit in the
<code>2^i-1^ = 2^1-1^ = 2^0^</code> place value is 0.
In our next step, we're going to use the result of our division, 102.

<center>
<div class="sidebyside">
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>102 / 2</code></td></tr>
<tr><td></td><td><code>**51**</code></td></tr>
</tbody>
</table>

<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td><code>102 % 2</code></td></tr>
<tr><td></td><td><code>**0**</code></td></tr>
</tbody>
</table>
</div>
</center>

Our second iteration (`i=2`) gave us the bit for the
<code>2^i-1^ = 2^2-1^ = 2^1^</code> place value.
It's 0 again.
Just as before, rinse and repeat.
I finished the conversion below.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr>
<th><code>i = 1</code></th>
<td><code>204 / 2 = 102</code></td>
<td></td>
<td><code>204 % 2 = **0**</code></td>
</tr>
<tr>
<th><code>i = 2</code></th>
<td><code>102 / 2 = 51</code></td>
<td></td>
<td><code>102 % 2 = **0**</code></td>
</tr>
<tr>
<th><code>i = 3</code></th>
<td><code>51 / 2 = 25</code></td>
<td></td>
<td><code>51 % 2 = **1**</code></td>
</tr>
<tr>
<th><code>i = 4</code></th>
<td><code>25 / 2 = 12</code></td>
<td></td>
<td><code>25 % 2 = **1**</code></td>
</tr>
<tr>
<th><code>i = 5</code></th>
<td><code>12 / 2 = 6</code></td>
<td></td>
<td><code>12 % 2 = **0**</code></td>
</tr>
<tr>
<th><code>i = 6</code></th>
<td><code>6 / 2 = 3</code></td>
<td></td>
<td><code>6 % 2 = **0**</code></td>
</tr>
<tr>
<th><code>i = 7</code></th>
<td><code>3 / 2 = 1</code></td>
<td></td>
<td><code>3 % 2 = **1**</code></td>
</tr>
<tr>
<th><code>i = 8</code></th>
<td><code>1 / 2 = 0</code></td>
<td></td>
<td><code>1 % 2 = **1**</code></td>
</tr>
</tbody>
</table>
</center>

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

