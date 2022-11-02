Since binary only uses 0's and 1's, there are no + and - signs to define
a positive and a negative number. There are multiple different ways to
express a negative binary number.

---

## Sign Magnitude

**Most Significant Bit (MSB):** The leftmost bit in a number. Eg:
**1**0011001

The MSB is the most significant bit when representing a sign magnitude
negative number. If the MSB is a 0, the number is positive. If the MSB
is 1, the number is negative. From there, the following bits are
calculated the same way that any binary number is calulated

<center>
<table>
<tr>
<th class="smt"><b>Byte</b></th>
<th class="smt"><b>Sign</b></th>
<th class="smt"><b>Value</b></th>
</tr>
<tr>
<td class="smt">10001111</th>
<td class="smt">Negative</th>
<td class="smt">-15</th>
</tr>
<tr>
<td class="smt">00110011</th>
<td class="smt">Positive</th>
<td class="smt">+52</th>
</tr>
<tr>
<td class="smt">10011101</th>
<td class="smt">Negative</th>
<td class="smt">-29</th>
</tr>
<tr>
<td class="smt">00010000</th>
<td class="smt">Positive</th>
<td class="smt">+16</th>
</tr>
</table>
</center>


A minor setback to the sign magnitude method is that we have now limited
the range of the 8 bit value. Since the MSB is now taken to show sign,
only 7 bits remain for magnitude. Normally an 8 bit value would have the
range of 0 to 255. The range of a signed 8 bit number is now -127 to
127. Now, when we're just defining numbers, this does not cause any
problems. However, when we get to adding and subtracting values, this
will cause an overflow error. We'll cross thats bridge when we get to
it.

---

## One's Complement

One's complement is the least used negative representation system. When
doing one's complement, the positive value is exactly the same as sign
magnitude. For example 00001010~2~ is still +10~10~. The difference is
when representing negative numbers. When representing negative numbers,
you invert all the bits. The 1's become 0's and the 0's become 1's.
Below is the process for making 10~10~ negative.

<code>
<tab5>Convert Bases: 10<sub>10</sub> = 00001010<sub>2</sub></tab5>
<br>
<tab5>Invert Bits: 00001010 > 11110101</tab5>
<br>
<tab5>-10<sub>10</sub> = 11110101<sub>2</sub></tab5>
</code>


Just as sign magnitude had overflow errors with range, so does one's
complement. In fact, one's complement has the same exact range issue.
Remember, normally an 8 bit value would have the range of 0 to 255. Now,
the range of a signed 8 bit number is -127 to 127. One's complement also
presents other errors when doing addition and subtraction. We tend not
to use One's Complement as much.

---

## Two's Complement

Two's complement is much more widely used than one's complement. It
makes addition and subtraction much easier. We'll get to addition and
subtraction and more fun values soon. Right now, let's focus on defining
numbers. Just as the other methods, the positive number stays the same.
00001010~2~ is still +10~10~. The process for negating the number starts
the same as one's complement. We first invert the bits. Then we add one.
The process is shown below.

<code>
<tab5>Convert Bases: 53<sub>10</sub> = 00110101<sub>2</sub></tab5>
<br>
<tab5>Invert Bits: 00110101 > 11001010</tab5>
<br>
<tab5>Add One: 11001010 + 1 > 11001011</tab5>
<br>
<tab5>10<sub>10</sub> = 11110101<sub>2</sub></tab5>
</code>

Once again we come across the same range issue. An unsigned 8 bit number
has a range of 0 to 255. A signed two's complement number has a range of
-128 to 127. Unlike one's complement and sign magnitude, two's
complement does not have addition and subtraction problems. This makes
two's complement the most desirable form for operating on.

---

## Practice Problems

What is the base-10 value of 10011001 using only sign-magnitude?

<textarea id="smq1"></textarea>
<br>
<button onclick="smq1Submit()">Submit</button>
<p id="smq1Out"></p>

What is the one's complement value of -64 in 8 bits?

<textarea id="ocq1"></textarea>
<br>
<button onclick="ocq1Submit()">Submit</button>
<p id="ocq1Out"></p>

What is the two's complement value of -122 in 8 bits?

<textarea id="tcq1"></textarea>
<br>
<button onclick="tcq1Submit()">Submit</button>
<p id="tcq1Out"></p>


