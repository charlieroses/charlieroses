Base-2 is also called Binary. Binary is the most basic thing computers
read. We all recognize binary as long strings of 1's and 0's. To the
untrained eye, lines of 1's and 0's can look overwhelming. However, when
we break them down into numbers, we can understand what the binary
reads. Instead of digits to hold place values, binary has bits. Each bit
can hold a 1 or 0. When we put 8 bits together in a line, it's called a
byte. Just a little trivia you'll never need to know: four bits are
called a nibble. Because it's not quite a byte.

Anyway! Let's start with an eight bit number, a byte. Let's consider a
random 8 bit number, **10011101**.

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


So each bit can hold a 0 or 1. Since we're working in base-2 this makes
sense because the range of digits is 0 to 2-1 which is 1. So we can
translate this number to base-10 by using the Power x Bit formula we
made. **(1 \* 2^7^) + (0 \* 2^6^) + (0 \* 2^5^) + (1 \* 2^4^) + (1 \*
2^3^) + (1 \* 2^2^) + (0 \* 2^1^) + (1 \* 2^0^)**. This translates to
**(1 \* 128) + 0 + 0 + (1 \* 16) + (1 \* 8) + (1 \* 4) + 0 + (1 \* 1)**.
So this means that the 8 bit binary number 10011101 is equal to the
base-10 number 157. To denote different bases, we can use subscripts. So
10011101~2~ = 157~10~

This was a very basic look into binary. If you move onto Chapter 2, you
can learn much more about fractional binary and negative binary and so
on and so forth.

---

## Practice Problems

What is the number 10110011~2~ in base-10?

<textarea id="b2q1"></textarea>
<br>
<button onclick="b2q1Submit()">Submit</button>
<p id="b2q1Out"></p>

