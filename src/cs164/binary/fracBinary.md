
Fractional Binary works just like the rest of binary. However, when we
use powers, we're using negative powers. It's much easier to demonstrate
below than to explain. We'll set up our table the exact same as we did
before with an 8 bit number. However, this time, we're going to add a
decimal point. This means we will have 4 integer bits and 4 fractional
bits. Let's consider the number **1101.1011~2~**.

---

## Binary to Base-10

<center>
<table>
<tr>
<th class="fb2t"><b>Bit</b></th>
<td class="fb2t">1</td>
<td class="fb2t">1</td>
<td class="fb2t">0</td>
<td class="fb2t">1</td>
<td class="fb2t"><b>.</b></td>
<td class="fb2t">1</td>
<td class="fb2t">0</td>
<td class="fb2t">1</td>
<td class="fb2t">1</td>
</tr>
<tr>
<th class="fb2t"><b>Power</b></th>
<td class="fb2t">2<sup>3</sup></td>
<td class="fb2t">2<sup>2</sup></td>
<td class="fb2t">2<sup>1</sup></td>
<td class="fb2t">2<sup>0</sup></td>
<td class="fb2t"><b>.</b></td>
<td class="fb2t">2<sup>-1</sup></td>
<td class="fb2t">2<sup>-2</sup></td>
<td class="fb2t">2<sup>-3</sup></td>
<td class="fb2t">2<sup>-4</sup></td>
</tr>
<tr>
<th class="fb2t"><b>Fractional Value</b></th>
<td class="fb2t">8</td>
<td class="fb2t">4</td>
<td class="fb2t">0</td>
<td class="fb2t">1</td>
<td class="fb2t"><b>.</b></td>
<td class="fb2t">1/2</td>
<td class="fb2t">0</td>
<td class="fb2t">1/8</td>
<td class="fb2t">1/16</td>
</tr>
<tr>
<th class="fb2t"><b>Decimal Value</b></th>
<td class="fb2t">8</td>
<td class="fb2t">4</td>
<td class="fb2t">0</td>
<td class="fb2t">1</td>
<td class="fb2t"><b>.</b></td>
<td class="fb2t">0.5</td>
<td class="fb2t">0</td>
<td class="fb2t">0.125</td>
<td class="fb2t">0.0625</td>
</tr>
</table>
</center>

I broke the Value row down into two other rows. **Fractional Value** and
**Decimal Value**. The fractional value is the Power multiplied by the
Bit. The decimal value is the same thing in decimal form. It's important
to see the fraction form because it's much easier to see the powers of
two. The decimal form makes it easier to add. So the value is **8 + 4 +
1 + 0.5 + 0.125 + 0.0625**. **1101.1011~2~** = **13.6875~10~**.

---

## Base-10 to Fractional Binary

Converting the bits before the Radix (decimal point) is exactly the same
as before with the alternating modulus/division method. Converting the
bits after the radix is very different however. First you double the
value, then if it greater than 1, you append a bit that is a 1. If the
bit is greater than 1, you then subtract 1. Otherwise you append a 0.
The loop continues until 0 is reached. Follow below through the method.
We'll convert **0.2~10~** to fractional binary.

<code>
<tab5>Double Value: 0.2 * 2 = 0.4</tab5>
<br>
<tab5>Check Quantity: 0.4 < 1 : Append <b>0</b></tab5>
<br>
<tab5>Double Value: 0.4 * 2 = 0.8</tab5>
<br>
<tab5>Check Quantity: 0.8 < 1 : Append <b>0</b></tab5>
<br>
<tab5>Double Value: 0.8 * 2 = 1.6</tab5>
<br>
<tab5>Check Quantity: 1.6 > 1 : Append <b>1</b></tab5>
<br>
<tab5>Subtract 1: 1.6 - 1 = 0.6</tab5>
<br>
<tab5>Double Value: 0.6 * 2 = 1.2</tab5>
<br>
<tab5>Check Quantity: 1.2 > 1 : Append <b>1</b></tab5>
<br>
<tab5>Subtract 1: 1.2 - 1 = 0.2</tab5>
<br>
<tab5>Double Value: 0.2 * 2 = 0.4</tab5>
<br>
<tab5>Check Quantity: 0.4 < 1 : Append <b>0</b></tab5>
<br>
<tab5>Double Value: 0.4 * 2 = 0.8</tab5>
<br>
<tab5>Check Quantity: 0.8 < 1 : Append <b>0</b></tab5>
<br>
</code>

Of course this particular number is never ending. Exactly like 1/3 is
0.3333333... In this case **0.2~10~** is equal to **0.00110011...~2~**.

---

## Practice Problems

Whats is the value of 1000.0011 in base-10?

<textarea id="fq1"></textarea>
<br>
<button onclick="fq1Submit()">Submit</button>
<p id="fq1Out"></p>

What is the value 0.5625~10~ in base-2?

<textarea id="fq2"></textarea>
<br>
<button onclick="fq2Submit()">Submit</button>
<p id="fq2Out"></p>
