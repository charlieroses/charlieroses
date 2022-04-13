Now we can move onto hexadecimal or base-16. Converting to and from is
the same process. The main difference in hexadecimal is how we represent
the digits. In base-10 we use digits 0-9. In binary we use 0 and 1. In
hexadecimal, we use 0-F. The values of the digits is 0 through B-1. Our
base is 16 so the digits would be 0 to 15. However, 15 is a two digit
number. Since base-16 uses digits that we dont have single digit numbers
for (eg 10-15), we use letters. The table below has the digits and their
corresponding values.

<center>
<table>
<tr>
<th class="b16vt"><b>Binary</b></th>
<th class="b16vt"><b>Decimal</b></th>
<th class="b16vt"><b>Hexadecimal</b></th>
</tr>
<tr>
<td class="b16vt">0000</td>
<td class="b16vt">0</td>
<td class="b16vt">0</td>
</tr>
<tr>
<td class="b16vt">0001</td>
<td class="b16vt">1</td>
<td class="b16vt">1</td>
</tr>
<tr>
<td class="b16vt">0010</td>
<td class="b16vt">2</td>
<td class="b16vt">2</td>
</tr>
<tr>
<td class="b16vt">0011</td>
<td class="b16vt">3</td>
<td class="b16vt">3</td>
</tr>
<tr>
<td class="b16vt">0100</td>
<td class="b16vt">4</td>
<td class="b16vt">4</td>
</tr>
<tr>
<td class="b16vt">0101</td>
<td class="b16vt">5</td>
<td class="b16vt">5</td>
</tr>
<tr>
<td class="b16vt">0110</td>
<td class="b16vt">6</td>
<td class="b16vt">6</td>
</tr>
<tr>
<td class="b16vt">0111</td>
<td class="b16vt">7</td>
<td class="b16vt">7</td>
</tr>
<tr>
<td class="b16vt">1000</td>
<td class="b16vt">8</td>
<td class="b16vt">8</td>
</tr>
<tr>
<td class="b16vt">1001</td>
<td class="b16vt">9</td>
<td class="b16vt">9</td>
</tr>
<tr>
<td class="b16vt">1010</td>
<td class="b16vt">10</td>
<td class="b16vt">A</td>
</tr>
<tr>
<td class="b16vt">1011</td>
<td class="b16vt">11</td>
<td class="b16vt">B</td>
</tr>
<tr>
<td class="b16vt">1100</td>
<td class="b16vt">12</td>
<td class="b16vt">C</td>
</tr>
<tr>
<td class="b16vt">1101</td>
<td class="b16vt">13</td>
<td class="b16vt">D</td>
</tr>
<tr>
<td class="b16vt">1110</td>
<td class="b16vt">14</td>
<td class="b16vt">E</td>
</tr>
<tr>
<td class="b16vt">1111</td>
<td class="b16vt">15</td>
<td class="b16vt">F</td>
</tr>
</table>
</center>

Now we can see how a hexadecimal number translates to a base-10 number.
Let's consider the hexadecimal number **3F4**

<center>
<table>
<tr>
<th class="b10t"><b>Digit</b></th>
<td class="b10t">3</td>
<td class="b10t">F</td>
<td class="b10t">4</td>
</tr>
<tr>
<th class="b10t"><b>Power</b></th>
<td class="b10t">16<sup>2</sup></td>
<td class="b10t">16<sup>1</sup></td>
<td class="b10t">16<sup>0</sup></td>
</tr>
<tr>
<th class="b10t"><b>Value</b></th>
<td class="b10t">768</td>
<td class="b10t">240</td>
<td class="b10t">4</td>
</tr>
</table>
</center>

Once again the Value is equal to the Digit multiplied by the Power. So
**3F4** is equal to **(3 \* 16^2^)** + **(15 \* 16^1^)** + **(4 \*
16^0^)**. We multiply 15 by 16^1^ because 15 corresponds to F on the
table. Finally we add all the values. 768 + 240 + 4 = 1022. **3F4~16~**
= **1022~10~**. As you can see, only 3 digits in hexadecimal gave us a
value that would need 4 digits in base-10. Try this on your own.

We can also look at how binary relates to hexadecimal. If we look up at
the table, you'll notice that each hexadecimal digit can be represented
as a full 4 bit binary number. Four bits in binary make 16 different
number values ranging 0 to 15. Hexadecimal uses different digits ranging
0-15. This isn't a coincidence. 16^1^ is 2^4^. It's no coincidence that
1 base-16 digit is equal to 4 base-2 digits. So how can we use this
knowledge in practice? Let's say we have the number 1111000011110000.
That's a rather large number that not even I want to do the math for.
Let's split this up.

<code>
<tab5>1111000011110000
<br>
<br>
<tab5>1111 0000 1111 0000 : Split into groups of 4
<br>
<br>
<tab5>15 0 15 0 : Translate groups of 4 into Base-10
<br>
<br>
<tab5>F 0 F 0 : Translate into base-16
<br>
<br>
<tab5>F0F0 : Put back together
</code>

There! Easy as can be! Instead of trying to translate a massive 16 bit
number, we just split it into 4 bit numbers!

---

## Color Codes

A very common use of hexadecimal numbers is for use of color codes.
There are many different ways to define color. The two main ways are to
use a hexadecimal value or an rgb value.

<center>
<p>
<red>r</red><green>g</green><blue>b</blue>(<red>255</red>,<green>255</green>,<blue>255</blue>)
<br>
<br>
#<red>FF</red><green>FF</green><blue>FF</blue>
</p>
</center>

I used the colors to highlight themselves. So there are the three base
colors red, green, and blue. In order to mix these colors in values of
0-255. Hexadecimal applies the same way. FF is the hexadecimal
representation of the number 255. Hex color codes are just hexadecimal
representations of an rgb color code. Below is a simple chart showing
how the colors mix. Obviously there are many more than these 7 colors.
Take note how the secondary colors are Cyan, Magenta and Yellow: the
colors your printer uses.

![](numbers/rgbcircles.png){#rgbcircles}

Since there are 256 values for each of the three colors (including 0),
we can make 256\*256\*256 different colors. That's 16,777,216 different
colors! Obviously there are so many colors to make and I don't have room
to display each of the over 16 million colors. I went through and did
the basic ROY G BIV rainbow below.

<center>
<table>
<tr>
<th class="b16c"><b>RGB</b></th>
<th class="b16c"><b>Hexadecimal</b></th>
<th class="b16c"><b>Name</b></th>
<th class="b16c"><b>Color</b></th>
</tr>
<tr>
<td class="b16c">0,0,0</td>
<td class="b16c">#000000</td>
<td class="b16c">Black</td>
<td class="b16c" style = "background-color: #000000"></td>
</tr>
<tr>
<td class="b16c">255,0,0</td>
<td class="b16c">#FF0000</td>
<td class="b16c">Red</td>
<td class="b16c" style = "background-color: #FF0000"></td>
</tr>
<tr>
<td class="b16c">255,165,0</td>
<td class="b16c">#FFA500</td>
<td class="b16c">Orange</td>
<td class="b16c" style = "background-color: #FFA500"></td>
</tr>
<tr>
<td class="b16c">255,255,0</td>
<td class="b16c">#FFFF00</td>
<td class="b16c">Yellow</td>
<td class="b16c" style = "background-color: #FFFF00"></td>
</tr>
<tr>
<td class="b16c">0,128,0</td>
<td class="b16c">#008000</td>
<td class="b16c">Green</td>
<td class="b16c" style = "background-color: #008000"></td>
</tr>
<tr>
<td class="b16c">0,0,255</td>
<td class="b16c">#0000FF</td>
<td class="b16c">Blue</td>
<td class="b16c" style = "background-color: #0000FF"></td>
</tr>
<tr>
<td class="b16c">75,0,130</td>
<td class="b16c">#4B0082</td>
<td class="b16c">Indigo</td>
<td class="b16c" style = "background-color: #4B0082"></td>
</tr>
<tr>
<td class="b16c">238,130,238</td>
<td class="b16c">#EE82EE</td>
<td class="b16c">Violet</td>
<td class="b16c" style = "background-color: #EE82EE"></td>
</tr>
<tr>
<td class="b16c">255,255,255</td>
<td class="b16c">#FFFFFF</td>
<td class="b16c">White</td>
<td class="b16c" style = "background-color: #FFFFFF"></td>
</tr>
</table>
</center>

Just for fun, I added an RGB Color changer. Just enter different values
into the boxes to change the color. Try and see if you can match the
colors from this website.

<center>
<table><tr><td id="colorBox"></td></tr></table>
<br>
<table>
<tr>
<td>Red</td>
<td>Green</td>
<td>Blue</td>
</tr>
<tr>
<td><textarea id="redtext">255</textarea></td>
<td><textarea id="greentext">255</textarea></td>
<td><textarea id="bluetext">255</textarea></td>
</tr>
</table>
<br>
<button id="colorBoxSub" onclick="changeColor()">Submit</button>
<p id="colorOutput"></p>
</center>

---

## Practice Problems

What is the number D5 in base-10?

<textarea id="b16q1"></textarea>
<br>
<button onclick="b16q1Submit()">Submit</button>
<p id="b16q1Out"></p>

Go on google. What is the hexadecimal color code for the color 'Papaya Whip'?

<textarea id="b16q2"></textarea>
<br>
<button onclick="b16q2Submit()">Submit</button>
<p id="b16q2Out"></p>

