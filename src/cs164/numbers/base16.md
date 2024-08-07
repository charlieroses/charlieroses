## Hexadecimal and Base 10

Now we can move onto base-16, which is more commonly called hexadecimal.
Converting from is the same process.
The biggest difference in hexadecimal is how we represent the digits.
We know that in a number base `B`, each digit is a value between `0` and `B-1`.
In base-10 we use digits 0-9.
In binary we use 0 and 1.
In hexadecimal, `B-1=15`.
This proposes a new issue.
The numbers 10-15 are two digits.
We can't use two digits as one digit.
To address this, we use letters as digits.
A represents 10, B represents 11, etc.
The table below has the digits and their corresponding values.

><
|             ||   |   |   |   |   |   |   |   |   |   |    |    |    |    |    |    |
|-------------||---|---|---|---|---|---|---|---|---|---|----|----|----|----|----|----|
| Decimal     || 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| Hexadecimal || 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | A  | B  | C  | D  | E  | F  |
><

Now that we know how to represent a hexademical number, it's much easier to see
how to get the base-10 magnitude of a hexadecimal number.
Let's consider the hexadecimal number **3F4**

><
|       ||              |               |              |
|-------||--------------|---------------|--------------|
| Digit || 3            | F             | 4            |
| Power || 16^2^        | 16^1^         | 16^0^        |
| Value || (3 \* 16^2^) | (15 \* 16^1^) | (4 \* 16^0^) |
|       || 768          | 240           | 4            |
><

The computation is performed exactly the same as before.
The Value is equal to the Digit multiplied by the Power meaning that
**3F4** is equal to **(3 \* 16^2^)** + **(15 \* 16^1^)** + **(4 \* 16^0^)**.
We multiply 15 by 16^1^ because 15 corresponds to F on the table.
When we add all the values, we find that  768 + 240 + 4 = 1022 showing that
**3F4~16~** = **1022~10~**.
As you can see, only 3 digits in hexadecimal gave us a value that would need 4
digits in base-10.

---

## Hexadecimal and Binary

We've been covering how to convert numbers in any base to base-10.
What if we want to convert a hexadecimal number to binary or vice-versa?
Would we have to convert the number to base-10 and then convert the resulting
base-10 number?
For many number bases, perhaps, but we have a bit of an advantage with
hexadecimal and binary.

Let's think about the numbers we're dealing with here.
We have 2, 10, and 16.
Let's play that one game from Sesame Street,
[one of these things is not like the others, one of these things is not the same]().
Which number is the odd one out?
Believe it or not, it's 10.
16 is a power of 2; <code>2^4^ = 16</code>.
We can also write this as <code>2^4^ = 16^1^</code>.
You may ask, why is this relevant?
Well if we look at how we build number bases, each digit is an increasing power.
Since <code>16^1^ = 2^4^</code>, we can say that one hexadecimal digit is
equivalent to four binary bits.
Look at the following table to see which bits correlate to which hexadecimal
digits.
_Spoiler Alert: The binary numbers are equal to 0-15._

><
|             ||      |      |      |      |      |      |      |      |      |      |      |      |      |      |      |      |
|-------------||------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|
| Binary      || 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |
| Hexadecimal || 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | A    | B    | C    | D    | E    | F    |
><

So how can we use this knowledge in practice?
Let's say we have the number 1111000011110000.
That's a rather large number that not even I want to do the math for.
The conversion is a lot easier than you'd expect.

<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td><code>1111000011110000~2~</code></td>
</tr>
<tr>
<th></th>
<td><code>1111~2~ 0000~2~ 1111~2~ 0000~2~</code></td>
<td style="text-align: left">Break into groups of four</td>
</tr>
<tr>
<th></th>
<td><code>F~16~ 0~16~ F~16~ 0~16~</code></td>
<td style="text-align: left">Covert groups of four to base-16</td>
</tr>
<tr>
<th></th>
<td><code>F0F0~16~</code></td>
</tr>
</tbody>
</table>
</center>


There! Easy as can be!
Instead of trying to convert a massive 16 bit number, we just split it into
multiple 4 bit numbers, convert them individually, then put it back together.

We can apply this to base-4 too.
See how <code>2^2^ = 4^1^</code> meaning that two binary digits is equal to one
base-4 digit.
This can be further expanded one when we realize that
<code>2^4^ = 4^2^ = 16^1^</code>.
We already saw that four binary digits are equivalent to one hexadecimal digit.
Now we also see that four binary digits are equivalent to two base-4 digits.
Taking it another step further, we can see that two base-4 digits are
equivalent to one hexadecimal digit.
In all these bases, we can use the same split-convert-reconstruct method to
convert quickly between bases.

This also works for numbers that aren't powers of two.
The same process can be done on base-3 and base-9 (<code>3^2^ = 9^1^</code>).
It would also work for base-7 and base-49 (<code>7^2^ = 49^1^</code>) _(base-49
would require uppercase and lowercase letters to be used as digits)_.

---

## Color Codes

A very common use of hexadecimal numbers is to represent colors.
There are many different ways to define color.
The way you'll see the most in this class is through RGB values.
RGB values are primarily represented in base-10 and hexadecimal.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr>
<td></td>
<td><red>r</red><green>g</green><blue>b</blue>(<red>255</red>,<green>255</green>,<blue>255</blue>)</td>
</tr>
<tr>
<td></td>
<td>#<red>FF</red><green>FF</green><blue>FF</blue></td>
</tr>
</tbody>
</table>
</center>

In RGB, there are the three base colors: red, green, and blue.
We mix different amounts of these primary colors to make all the other colors.
To define an amount of a color, we use a value in <code>[0~10~, 255~10~]</code>.
<code>255~10~</code> may seem like a wierd number to use as the cap, but it's
not random because <code>[0~10~, 255~10~] = [0~16~, FF~16~]</code>.

Below is a simple chart showing how the colors mix.
Obviously there are many more than these 7 colors.
Take note how the secondary colors are Cyan, Magenta and Yellow: the
colors your printer uses.

><
![rgbcircles](numbers/rgbcircles.png)
><

Since there are 256 values for each of the three colors (including 0),
we can make 256\*256\*256 different colors.
That's 16,777,216 different colors!
Obviously there are so many colors to make and I don't have room to display each
of the over 16 million colors.
I went through and did the basic ROY G BIV rainbow below.
The [next section](numbers/colors.html) has a list of all the colors with names
recognized by web browsers.

<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<tr>
<th></th>
<th>RGB</th>
<th>Hexadecimal</th>
<th>Name</th>
<th>Color</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>0,0,0</td>
<td>#000000</td>
<td>Black</td>
<td style = "background-color: #000000"></td>
</tr>
<tr>
<th></th>
<td>255,0,0</td>
<td>#FF0000</td>
<td>Red</td>
<td style = "background-color: #FF0000"></td>
</tr>
<tr>
<th></th>
<td>255,165,0</td>
<td>#FFA500</td>
<td>Orange</td>
<td style = "background-color: #FFA500"></td>
</tr>
<tr>
<th></th>
<td>255,255,0</td>
<td>#FFFF00</td>
<td>Yellow</td>
<td style = "background-color: #FFFF00"></td>
</tr>
<tr>
<th></th>
<td>0,128,0</td>
<td>#008000</td>
<td>Green</td>
<td style = "background-color: #008000"></td>
</tr>
<tr>
<th></th>
<td>0,0,255</td>
<td>#0000FF</td>
<td>Blue</td>
<td style = "background-color: #0000FF"></td>
</tr>
<tr>
<th></th>
<td>75,0,130</td>
<td>#4B0082</td>
<td>Indigo</td>
<td style = "background-color: #4B0082"></td>
</tr>
<tr>
<th></th>
<td>238,130,238</td>
<td>#EE82EE</td>
<td>Violet</td>
<td style = "background-color: #EE82EE"></td>
</tr>
<tr>
<th></th>
<td>255,255,255</td>
<td>#FFFFFF</td>
<td>White</td>
<td style = "background-color: #FFFFFF"></td>
</tr>
</tbody>
</table>
</center>

Just for fun, I added an RGB Color changer.
Just enter different values into the boxes to change the color.
Try and see if you can match the colors from this website.

<center>
<table id="rgb-color-box">
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<th></th>
<th></th>
<th></th>
<th></th>
</thead>
<tbody>
<tr>
<th></th>
<td id="colorBox" colspan="3"></td>
</tr>
<tr>
<th></th>
<td>Red</td>
<td>Green</td>
<td>Blue</td>
</tr>
<tr>
<th></th>
<td><textarea id="redtext">255</textarea></td>
<td><textarea id="greentext">255</textarea></td>
<td><textarea id="bluetext">255</textarea></td>
</tr>
</tbody>
</table>
<br>
<button id="colorBoxSub" onclick="changeColor()">Submit</button>
<p id="colorOutput"></p>
</center>

---

## Practice

<center>
<table id="hexadecimal-to-decimal" class="practice">
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Hexadecimal to Decimal</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
How would the hexadecimal value
<textarea id="hdhex"></textarea>
be represented in base-10?
</td>
</tr>
<tr>
<td></td>
<td class="inputtd">
<textarea id="hddec"></textarea>
<button onclick="hdcheck()">Check Answer</button>
<button onclick="hdreset()">Reset</button>
</td>
</tr>
<tr>
<td></td>
<td id="hdresponse" class="response"></td>
</tr>
</tbody>
</table>
<br><br><br>
<table id="hexadecimal-to-binary" class="practice">
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Hexadecimal to Binary</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
How would the hexadecimal value
<textarea id="hbhex"></textarea>
be represented in binary?
</td>
</tr>
<tr>
<td></td>
<td class="inputtd">
<textarea id="hbbinary"></textarea>
<button onclick="hbcheck()">Check Answer</button>
<button onclick="hbreset()">Reset</button>
</td>
</tr>
<tr>
<td></td>
<td id="hbresponse" class="response"></td>
</tr>
</tbody>
</table>
<br><br><br>
<table id="hexadecimal-to-base-4" class="practice">
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Hexadecimal to Base-4</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
How would the hexadecimal value
<textarea id="hqhex"></textarea>
be represented in base-4?
</td>
</tr>
<tr>
<td></td>
<td class="inputtd">
<textarea id="hqquar"></textarea>
<button onclick="hqcheck()">Check Answer</button>
<button onclick="hqreset()">Reset</button>
</td>
</tr>
<tr>
<td></td>
<td id="hqresponse" class="response"></td>
</tr>
</tbody>
</table>
<br><br><br>
<table id="binary-to-hexadecimal" class="practice">
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th>Binary to Hexadecimal</th></tr></thead>
<tbody>
<tr>
<td></td>
<td>
How would the binary value
<textarea id="bhbinary"></textarea>
be represented in hex?
</td>
</tr>
<tr>
<td></td>
<td class="inputtd">
<textarea id="bhhex"></textarea>
<button onclick="bhcheck()">Check Answer</button>
<button onclick="bhreset()">Reset</button>
</td>
</tr>
<tr>
<td></td>
<td id="bhresponse" class="response"></td>
</tr>
</tbody>
</table>
</center>

<script>
hdreset();
hbreset();
hqreset();
bhreset();
</script>
