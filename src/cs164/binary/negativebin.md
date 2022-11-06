Since binary only uses 0's and 1's, there are no + and - signs to define a
positive and a negative number the way we do with base-10 numbers.
Instead, there are multiple different ways to express a negative binary number.


---

## Sign Magnitude

**Most Significant Bit (MSB):** The leftmost bit in a number. Eg: **1**0011001

**Least Significant Bit (LSB):** The rightmost bit in a number. Eg: 1001100**1**

The MSB is the most important bit when representing a sign magnitude negative
number.
If the MSB is a 0, the number is positive.
If the MSB is 1, the number is negative.
From there, the following bits are calculated the same way that any binary
number is calulated.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead>
<tr>
<th></th>
<th>Byte</th>
<th>Sign</th>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td><code>00110101~2~</code></td>
<td>Positive</td>
<td><code>+53~10~</code></td>
</tr>
<tr>
<td></td>
<td><code>10110101~2~</code></td>
<td>Negative</td>
<td><code>-53~10~</code></td>
</tr>
<tr>
<td></td>
<td><code>00010000~2~</code></td>
<td>Positive</td>
<td><code>+16~10~</code></td>
</tr>
<tr>
<td></td>
<td><code>10011101~2~</code></td>
<td>Negative</td>
<td><code>-29~10~</code></td>
</tr>
</tbody>
</table>
</center>

Let's look further at the sign magnitude notation.
In a sign magnitude representation of an 8-bit binary number, we have the
following setup:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td>
<td style="padding:1.5ch"><code style="font-size:150%">SMMMMMMM</code></td>
</tr>
</tbody>
</table>
</center>

Above, `S` represent the MSB, which is used for the sign and `M` represents a
magnitude bit, a bit that is used when calculating the magnitude, or numeric
value, of the binary number.

Let's recall that a bit is the smallest unit of information.
If we have an 8 bit number and we're only using 7 of those bits to store a
numeric value, it would appear that we're losing one bit of information.
In an 8 bit unsigned binary number, we'd have a range of `[00000000, 11111111]`
which is `[0, +255]` (0 to +255 inclusive).
In a 7 bit unsigned binary number, we'd have a range of `[0000000, 1111111]`
which is `[0, +127]` (0 to +127 inclusive).
It appears as though we've completely reduced the range of values that we can
represent.
This isn't actually the case.
The range of sign magnitude over 8 bits is `[11111111, 01111111]` which is
`[-127, +127]`.
As you can see, our range hasn't been reduced, just moved.

---

## One's Complement

One's complement is another way to represent negative numbers in binary.
Just as we saw before in sign magnitude, the MSB indicates whether our number is
positive or negative.
If the MSB is 0, our number is positive and its value is calculated exactly the
same as in sign magnitude.
For example, 00110101~2~ is still +53~10~.
The difference is when representing negative numbers.
When representing negative numbers, all bits are inverted in order to calculate
the value.
The 1's become 0's and the 0's become 1's.
Below is the process for representing -53~10~ as a binary number in one's
complement representation over 8 bits.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th></tr></thead>
<tbody>
<tr>
<td></td>
<td><code>-53~10~</code></td>
<td></td>
</tr>
<tr>
<td></td>
<td><code>00110101~2~</code></td>
<td>Convert unsigned value to binary</td>
</tr>
<tr>
<td></td>
<td><code>11001010~2~</code></td>
<td>Negate by inverting bits</td>
</tr>
</tbody>
</table>
</center>

We can now see that <code>-53~10~ = 11001010~2~</code> when using one's
complement to represent binary numbers over 8 bits.

As I mentioned before, like sign-magnitude, the MSB indicates if our value is
positive or negative.
Unlike, sign-magnitude, the value is calculated differently based on the MSB.
We can kinda think about this in two ways.
First, depending on the MSB, we change the way we calculate the value.
Or, if we look at the above conversion, we see that a positive number's MSB
is 0.
When we negate a positive number, we invert all the bits.
This includes the MSB.
By inverting all the bits to negate a number, we also invert the MSB from a 0 to
a 1 which further indicates that we have a negative number.
One's complement is clever in this way.
The MSB tells us whether or not we need to flip the bits to interpret the value.
Additionally, when we negate a value, we don't need to consider the MSB because
it will be flipped along with all the other bits.
The sign of a number doesn't matter when we negate it because it will always
produce the opposite value.

Just as before, the range of an 8-bit binary number changes when we use one's
complement.
Again, the range of values that can be represented with 8-bit unsigned binary is
`[00000000, 11111111]`.
In Base-10, we already know that this is `[0, +255]`.
The range of values that can be represented with 8-bit one's complement is
`[10000000, 011111111]`.
Representing this in base-10, we get a range of `[-127, +127]`.

---

## Two's Complement

Two's complement is the way computers actually store negative binary values.
The reason is because two's complement is much more accurate when dealing with
addition and subtraction.
We'll dive into this deeper later.
Right now, let's focus on what two's complement actually is.

Two's complement's name tells us a lot more than you'd think.
Two's complement is one's complement plus one.
What does this actually mean?
To negate a number in one's complement, we inverted all the bits.
To negate a number in two's complement, again we'll invert all the bits, but
this time, we will add 1 to the inverted value.
When we add 1, we add the mathematical value 1.
We will not be appending a 1 as a new bit.
This will make more sense when we see it in action.
Let's take the number -53~10~ and represent it as an 8-bit binary number
represented in two's complement.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th></tr></thead>
<tbody>
<tr>
<td></td>
<td><code>-53~10~</code></td>
<td></td>
</tr>
<tr>
<td></td>
<td><code>00110101~2~</code></td>
<td>Convert unsigned value to binary</td>
</tr>
<tr>
<td></td>
<td><code>11001010</code></td>
<td>Invert bits</td>
</tr>
<tr>
<td></td>
<td>
<pre>  11001010
+ 00000001
----------
  11001011
</pre></td>
<td>Add 00000001 (one)</td>
</tr>
</tbody>
</table>
</center>

This process shows that when representing negative numbers in two's complement
over 8 bits, <code>-53~10~ = 11001011~2~</code>.

Before we look more at -53~10~, let's quickly go over the range of numbers that
can be represented in 8-bit two's complement binary.
As we've already mentioned again and again before, 8-bit unsigned binary numbers
as a range of values of `[00000000, 11111111]` or `[0, +255]`.
In two's complement, our range is now `[10000000, 01111111]` which is
`[-128, +127]`.
This is slightly different than the ranges we've seen in sign-magnitude and
one's complement.
This slight difference is what allows two's complement to be used for addition
and subtraction.

Bouncing back to -53~10~, we'll see in the past few sections, this value can be
represented in many different ways in binary:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th></tr></thead>
<tbody>
<tr>
<td></td>
<th>Base-10</th>
<td><code>-53~10~</code></td>
</tr>
<tr>
<td></td>
<th>Sign-Magnitude</th>
<td><code>10110101~2~</code></td>
</tr>
<tr>
<td></td>
<th>One's Complement</th>
<td><code>11001010~2~</code></td>
</tr>
<tr>
<td></td>
<th>Two's Complement</th>
<td><code>11001011~2~</code></td>
</tr>
</tbody>
</table>
</center>

To add another layer to this, let's look at the value 11001011~2~.
What would it's base-10 value be in each representation?

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th></tr></thead>
<tbody>
<tr>
<td></td>
<td colspan=2><code>11001011~2~</code></td>
</tr>
<tr>
<td></td>
<th>Unsigned</th>
<td><code>+203~10~</code></td>
</tr>
<tr>
<td></td>
<th>Sign-Magnitude</th>
<td><code>-76~10~</code></td>
</tr>
<tr>
<td></td>
<th>One's Complement</th>
<td><code>-52~10~</code></td>
</tr>
<tr>
<td></td>
<th>Two's Complement</th>
<td><code>-53~10~</code></td>
</tr>
</tbody>
</table>
</center>

This concept can be extremely confusing the first time you see it because it
challenges the way we've been taught numbers our whole lives.
In base-10, the only way we represent negative numbers is by appending a "-" to
the front of a number; we don't change the digits.
This means that in base-10, the sequence of characters "-53" will always
correlate the mathematical value of -53.
The sequence of characters "-53" will never be used to represent a different
mathematical value.

In binary, since we only have the digits 0 and 1 available to represent
everything in computers, we have to get creative.
One sequence of 0s and 1s must be able to have multiple meanings.
Let's oversimplify the way a computer reads binary.
Let's say in order to function, this simple-computer reads a single string of 0s
and 1s, one bit at time.
The simple-computer reads "1", then "0", then "1".
If we were to constrict this sequence to _only_ be the value +5~10~, then the
simple-computer would not be able to read the sequence "1", "0", "1", "0"
(+10~10~).
The interpretation of the sequence 101~2~ must be flexible.

It's very similar to that [one bit in iCarly](https://youtu.be/MELFuY6rSEs):

<center>
<table id="icarly">
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><td></td><td>_"How long is gonna take?"_</td></tr>
<tr><td></td><td>_"3 or 4"_</td></tr>
<tr><td></td><td>_"3 or 4 what? Days? Weeks? Months?"_</td></tr>
<tr><td></td><td>_"Yeah, maybe 5"_</td></tr>
<tr><td></td><td>_"5 what?"_</td></tr>
</tbody>
</table>
</center>

The point?
Since numbers represent everything, numbers mean nothing if there's no context
provided.

---

## Practice

I've got a few different ways to practice understanding negative binary here.
Use "Reset" to get new random values.
All values will be between 1 and 16 bits.
You can also enter your own values in all fields if you want to create your own
practice problems.
This is painfully simple JavaScript code.
It won't work right if you don't use it right.
Be an adult, don't put letters in the number boxes.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Positive or Negative</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
Is the
<select id="pnrep">
	<option value="un">Unsigned</option>
	<option value="sm">Sign-Magnitude</option>
	<option value="oc">One's Complement</option>
	<option value="tc">Two's Complement</option>
</select>
binary number
<textarea id="pnbinary"></textarea>
positive or negative?
</td>
</tr>
<tr>
<td></td>
<td>
<button id="pnpos" onclick="pncheck(0)">Positive</button>
<button id="pnneg" onclick="pncheck(1)">Negative</button>
<button onclick="pnreset()">Reset</button>
</td>
</tr>
<tr>
<td></td>
<td id="pnresponse" class="response"></td>
</tr>
</tbody>
</table>
<br><br><br>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Binary to Decimal</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
How would the
<select id="bdrep">
	<option value="un">Unsigned</option>
	<option value="sm">Sign-Magnitude</option>
	<option value="oc">One's Complement</option>
	<option value="tc">Two's Complement</option>
</select>
binary number
<textarea id="bdbinary"></textarea>
<br> be represented as a decimal (base 10) number?
</td>
</tr>
<tr>
<td></td>
<td class="inputtd">
<textarea id="bddec"></textarea>
<button onclick="bdcheck()">Check Answer</button>
<button onclick="bdreset()">Reset</button>
</td>
</tr>
<tr>
<td></td>
<td id="bdresponse" class="response"></td>
</tr>
</tbody>
</table>
<br><br><br>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Decimal to Binary</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
How would the decimal value
<textarea id="dbdec"></textarea>
be represented as <br> an
<textarea id="dbbit"></textarea>
bit
<select id="dbrep">
	<option value="un">Unsigned</option>
	<option value="sm">Sign-Magnitude</option>
	<option value="oc">One's Complement</option>
	<option value="tc">Two's Complement</option>
</select>
binary number?
</td>
<tr>
<td></td>
<td class="inputtd">
<textarea id="dbbinary"></textarea>
<button onclick="dbcheck()">Check Answer</button>
<button onclick="dbreset()">Reset</button>
</td>
</tr>
<tr>
<td></td>
<td id="dbresponse" class="response"></td>
</tr>
</tbody>
</table>
</center>

<script>
pnreset();
bdreset();
dbreset();
</script>

