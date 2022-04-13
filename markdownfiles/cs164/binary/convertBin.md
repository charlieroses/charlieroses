## Binary to Base-10

The first thing we need to know about binary is the set up of the
numbers. A binary value is composed of **bits**. Bits are the 0's and
1's that compose the value. 00000000 is an 8 bit number as it is
composed of 8 0's. A **byte** is composed of 8 bits. 00000000 is one
byte of memory. How does this translate to our base 10 decimals though?
I like to set up the following table to separate and dissect the number.

<center>
<table>
<tr>
<th class="b2t"><b>Bit</b></th>
<td class="b2t">1</td>
<td class="b2t">0</td>
<td class="b2t">0</td>
<td class="b2t">1</td>
<td class="b2t">1</td>
<td class="b2t">1</td>
<td class="b2t">0</td>
<td class="b2t">1</td>
</tr>
<tr>
<th class="b2t"><b>Power</b></th>
<td class="b2t">2<sup>7</sup></td>
<td class="b2t">2<sup>6</sup></td>
<td class="b2t">2<sup>5</sup></td>
<td class="b2t">2<sup>4</sup></td>
<td class="b2t">2<sup>3</sup></td>
<td class="b2t">2<sup>2</sup></td>
<td class="b2t">2<sup>1</sup></td>
<td class="b2t">2<sup>0</sup></td>
</tr>
<tr>
<th class="b2t"><b>Value</b></th>
<td class="b2t">128</td>
<td class="b2t">0</td>
<td class="b2t">0</td>
<td class="b2t">16</td>
<td class="b2t">8</td>
<td class="b2t">4</td>
<td class="b2t">0</td>
<td class="b2t">1</td>
</tr>
</table>
</center>

So the first row is the **Bits**.
I separated each bit into its own column.
The second row is **Power**.
Since binary is a base-2 system, instead of using powers of 10 for each place value, we use powers of 2.
The "one's place" is 2<sup>0</sup>.
Instead of the "ten's place" being next, we have the "two's place" which is equal to 2<sup>1</sup>.
This continues down the line.
The **Value** is the Bit x Power.
Now that we've defined our rows in our table, let's convert **10011101** to a decimal form so the common man can read this.
This value is equal to
**(1 x 2<sup>7</sup>)** + **(0 x 2<sup>6</sup>)** + **(0 x 2<sup>5</sup>)** + **(1 x 2<sup>4</sup>)** + **(1 x 2<sup>3</sup>)** + **(1 x 2<sup>2</sup>)** + **(0 x 2<sup>1</sup>)** + **(1 x 2<sup>0</sup>)**.
This long equation can be simplified to just **128** + **16** + **8** + **4** + **1**.
Which in base-10 is equal to **157**.
This means 10011101<sub>2</sub> = 157<sub>10</sub>.

---

## Convert to Binary


There are two different processes for converting to binary. I will be
going over both.

### Process 1

Now that we know to convert binary to base-10, let's convert a base-10
number to an 8 bit binary number. This process is a little bit harder,
however, with practice, it can be done! To convert from base-10 to
binary, we're going to need to use an operation you probably haven't
used before. This is called the **modulus** operation. As addition is
represented by '+', modulus is represented by '%'. This returns the
remainder after division.

<code>
<tab5>21 / 7 = 3.0 = 3 + <b>0</b>/7</tab5>
<br>
<tab5>21 % 7 = <b>0</b></tab5>
<br>
<tab5>22 / 7 = 3.14285 = 3 + <b>1</b>/7</tab5>
<br>
<tab5>22 % 7 = <b>1</b></tab5>
</code>

We use modulus and division to switch to a different number base. Let's
use the base-10 number, **111**. Since we're using 8 bits, the first
power is 2^7^. So we first divide by this.

<code>
<tab5>111 / 128 = <b>0</b>.86718</tab5>
</code>

Aside from the fractional value, we got a **0**. This means there is a 0
in the 2^7^ bit. Now we take the modulus to find the remainder. This way
we know what transfers down to the next division.

<code>
<tab5>111 % 128 = <b>111</b></tab5>
</code>


Now the value we divide 2^6^ from is **111**. We continue doing these
operations until we get to 2^0^ or we get a modulus value of 0. I did
the rest below.

<code>
<tab5>111 / 128 = <u>0</u>.86718</tab5>
<br>
<tab5>111 % 128 = 111</tab5>
<br>
<tab5>111 / 64 = <u>1</u>.73437</tab5>
<br>
<tab5>111 % 64 = 47</tab5>
<br>
<tab5>47 / 32 = <u>1</u>.46875</tab5>
<br>
<tab5>47 % 32 = 15</tab5>
<br>
<tab5>15 / 16 = <u>0</u>.9375</tab5>
<br>
<tab5>15 % 16 = 15</tab5>
<br>
<tab5>15 / 8 = <u>1</u>.875</tab5>
<br>
<tab5>15 % 8 = 7</tab5>
<br>
<tab5>7 / 4 = <u>1</u>.75</tab5>
<br>
<tab5>7 % 4 = 3</tab5>
<br>
<tab5>3 / 2 = <u>1</u>.5</tab5>
<br>
<tab5>3 % 2 = 1</tab5>
<br>
<tab5>1 / 1 = <u>1</u>.0</tab5>
<br>
<tab5>1 % 1 = 0</tab5>
<br>
</code>


This means the base-10 value 111 is equal to the 8 bit number 01101111.

### Process 2

The way above requires you to know the powers of 2 to use the method.
There is also another way to do it without knowing the powers and just
using only the number 2. The way we'll do this is by using repeated
division of 2. This method is the opposite of the above. Above, we
divided by the largest power then passed the remainder onto the next
step. The integer was the bit. Now we're going to divide the number by
2, then pass the integer onto the next step. The remainder will become
our bit. This time in the opposite direction. Let's do the number
111~10~ again.

<code>
<tab5>111 / 2 = 55.5</tab5>
<br>
<tab5>111 % 2 = <u>1</u></tab5>
<br>
<tab5>55 / 2 = 27.5</tab5>
<br>
<tab5>55 % 2 = <u>1</u></tab5>
<br>
<tab5>27 / 2 = 13.5</tab5>
<br>
<tab5>27 % 2 = <u>1</u></tab5>
<br>
<tab5>13 / 2 = 6.5</tab5>
<br>
<tab5>13 % 2 = <u>1</u></tab5>
<br>
<tab5>6 / 2 = 3</tab5>
<br>
<tab5>6 % 2 = <u>0</u></tab5>
<br>
<tab5>3 / 2 = 1.5</tab5>
<br>
<tab5>3 % 2 = <u>1</u></tab5>
<br>
<tab5>1 / 2 = 0.5</tab5>
<br>
<tab5>1 % 2 = <u>1</u></tab5>
<br>
</code>


Since we're moving in the opposite direction, we place bits the other
way. After the first step where we first divided by 2, we got the bit
for 2^0^. It's a little weird to think about where the bit goes. Think
about it like this, when you divide by 2^1^, the remainder would be
2^0^. This is because it's the place value directly to the right. This
means, once again, 111~10~ = 1101111~2~. This time, we have only 7 bits
instead of 8. Since the 8th bit is a 0, it's not necessary to put it in.
Both approaches are completely valid and correct.

---

## Practice Problems

What is the number 10110011 in base-10?

<textarea id="b2q1"></textarea>
<br>
<button onclick="b2q1Submit()">Submit</button>
<p id="b2q1Out"></p>

What is the number 137 in base-2?

<textarea id="b2q2"></textarea>
<br>
<button onclick="b1q2Submit()">Submit</button>
<p id="b2q2Out"></p>


