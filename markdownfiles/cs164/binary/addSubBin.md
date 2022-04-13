# 2.4 : Addition and Subtraction

---

It's finally here! We finally made it to the part where we add and
subtract! For our purposes and for ease, we'll be using two's complement
when dealing with negative values. Also, for ease, we will only be
adding integers. **Integers** are numbers without decimals and
fractions.

---

# Addition

Addition is handled exactly the same way as in base-10. We go bit by
bit, starting with the smallest and working up. So 0 + 0 = 0. 0 + 1 = 1.
1 + 0 = 1. 1 + 1 = 0 and then we carry the one to the next bit. Let's
add two 8 bit values together. Let's add **00011101** and **10011010**.

<center>
<table>
<tr>
<th class="fb2t"><b>Carry</b></th>
<td class="addt"></td>
<td class="addt"></td>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt"></td>
<td class="addt"></td>
<td class="addt"></td>
<td class="addt"></td>
</tr>
<tr>
<th class="fb2t"><b>Value 1</b></th>
<td class="addt">0</td>
<td class="addt">0</td>
<td class="addt">0</td>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt">0</td>
<td class="addt">1</td>
</tr>
<tr>
<th class="fb2t"><b>+ Value 2</b></th>
<td class="addt">1</td>
<td class="addt">0</td>
<td class="addt">0</td>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt">0</td>
<td class="addt">1</td>
<td class="addt">0</td>
</tr>
<tr>
<th class="fb2t"><b>= Result</b></th>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">0</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">0</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
</tr>
</table>
</center>

So this means 00011101<sub>2</sub> + 10011010<sub>2</sub> = 10110111<sub>2</sub>.
Let's check our work though.
As far as I know, our binary skills are not perfect.
We don't know off the top of our heads if this is correct.
Let's convert these numbers to base 10 then check.
00011101<sub>2</sub> is 29<sub>10</sub>.
10011010<sub>2</sub> is 154<sub>10</sub>.
10110111<sub>2</sub> is 183<sub>10</sub>.
29<sub>10</sub> + 154<sub>10</sub> = 183<sub>10</sub>.
Looks like we did a good job!

---

## Subtraction

Subtraction, believe it or not, works just like base-10. You negate the
value, then add. Of course, since we're working with base-2, we negate
using two's complement. So this time, let's subtract **00011101** from
**10011010** First let's negate 00011101.

<code>
<tab5>Invert Bits: 00011101 > 11100010</tab5>
<br>
<tab5>Add 1: 11100010 + 00000001 = 11100011</tab5>
</code>

Now lets add with our table again.
00011101 + 11100011
<center>
<table>
<tr>
<th class="fb2t"><b>Carry</b></th>
<td class="addt"></td>
<td class="addt"></td>
<td class="addt"></td>
<td class="addt"></td>
<td class="addt"></td>
<td class="addt">1</td>
<td class="addt"></td>
<td class="addt"></td>
</tr>
<tr>
<th class="fb2t"><b>Value 1</b></th>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt">0</td>
<td class="addt">0</td>
<td class="addt">0</td>
<td class="addt">1</td>
<td class="addt">1</td>
</tr>
<tr>
<th class="fb2t"><b>+ Value 2</b></th>
<td class="addt">1</td>
<td class="addt">0</td>
<td class="addt">0</td>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt">0</td>
<td class="addt">1</td>
<td class="addt">0</td>
</tr>
<tr>
<th class="fb2t"><b>= Result</b></th>
<td class="addt" style="background-color: rgb(140,140,140)">0</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
<td class="addt" style="background-color: rgb(140,140,140)">0</td>
<td class="addt" style="background-color: rgb(140,140,140)">1</td>
</tr>
</table>
</center>

Our result is **01111101**. This, in base 10 is 125. If we check our
work again 154 - 29 = 125. One thing to notice is the leftmost bit. As
you can see 1 + 1 is equal to 0 with a carry of 1. However, we don't
have room for a carry! In the next section on overflow, I'll cover this.
Right now, let's ignore it.

---

## Overflow

So overflow is one of the many reasons we use twos complement when doing
math. I'm going to explain using 4 bit numbers for ease of
demonstration. Let's look at our twos complement number.

<center>
<table>
<tr>
<th class="addt">MSB</th>
<th class="addt">Value</th>
<th class="addt">Value</th>
<th class="addt">Value</th>
</tr>
<tr>
<td class="addt">0</td>
<td class="addt">1</td>
<td class="addt">1</td>
<td class="addt">0</td>
</tr>
</table>
</center>

So the MSB, as we mentioned earlier in the [Negative Binary
Section](binary/negativebin), is the most significant bit that tells
us if the number is positive or negative. The other values are values
that actually matter when we add and subtract. So let's do a problem in
twos complement.

0110 + 0100 = 1010

6 + 4 = -6

So how did two positive numbers add together to create a negative
number? So while a 4 bit number may have a range of 0-15 unsigned, when
we sign the number, the range is now -8-7. This is much easier to think
of as a wheel.

<center>
![](binary/twoscompwheel.png)
</center>

In this wheel I just counted up one by one in binary. If we consider
these to be twos complement numbers, we get the following base ten
values.

<center>
![](binary/basetenwheel.png)
</center>

So when we add or subtract we work our way around the wheel. Once again,
lets consider 0110 + 0100. If we start at the 6 position on th circle,
we step around four places. We then get to -6. If we keep adding, we'd
eventually get a 5 bit number, however, since we're only working in 4
bits, we'd lose those bits.

---

## Practice Problems

What is the 4 bit value you get when you add 0011 and 1010?

<textarea id="aq1"></textarea>
<br>
<button onclick="aq1Submit()">Submit</button>
<p id="aq1Out"></p>

What is the 4 bit value you get when you subtract 0011 from 1010? Make sure you check your work!

<textarea id="sq1"></textarea>
<br>
<button onclick="sq1Submit()">Submit</button>
<p id="sq1Out"></p>




