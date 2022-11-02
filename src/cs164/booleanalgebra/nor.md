What if we want the opposite of OR? We can apply a NOT operator on an OR
operator and form NOT OR. However, this can get clunky using two
operators. This is where the NOR operator comes in. NOR combines the two
operators, NOT and OR, into one. Just like english we want neither x NOR
y to be true. Below shows the truth table set up just as before, 00, 01,
10, 11.

<center>
<code>
Notation: x NOR y 
</code>
<div class="container">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>x NOR y</b></th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
</table>
<div class="container2">
<img src="booleanalgebra/imgs/nor.png" style="width: 312px; height: 127px">
<div class="simcir">
{
"width":312,
"height":108,
"showToolbox":false,
"devices":[
{"type":"Toggle","id":"dev0","x":108,"y":12,"label":"X"},
{"type":"Toggle","id":"dev1","x":108,"y":60,"label":"Y"},
{"type":"DC","id":"dev2","x":52,"y":36,"label":"DC"},
{"type":"NOR","id":"dev3","x":164,"y":36,"label":"NOR"},
{"type":"LED","id":"dev4","x":220,"y":36,"label":"LED"}
],
"connectors":[
{"from":"dev0.in0","to":"dev2.out0"},
{"from":"dev1.in0","to":"dev2.out0"},
{"from":"dev3.in0","to":"dev0.out0"},
{"from":"dev3.in1","to":"dev1.out0"},
{"from":"dev4.in0","to":"dev3.out0"}
]
}
</div>
</div>
</div>
</center>

Currently, I can't seem to find the real mathematical similarities
to NOR.
NOR does have some other interesting properties.
Also, I felt bad about not giving another venn diagram.

<center>
![](booleanalgebra/imgs/norvenn.png)
</center>

---

## A Universal Gate

As mentioned above, NOR has some very interesting properties. The most
important of which is that it's a universal gate. What is a universal
gate, you may ask. A universal gate is a gate that can make other gates.
I can use a NOR gate to create a NOT, OR, and AND gate. This means, I
can replace all these gates with NOR and solve any boolean expression
with only NOR gates. Below I sketched out how to do each gate. Make the
truth table for each. Don't just memorize what these look like,
understand why they work.

<center>
<div class="container">
<img src="booleanalgebra/imgs/notnor.png">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>x NOR x</b></th>
<th id="b2t"><b>NOT x</b></th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
</tr>
</table>

</div>
</center>
<center>
<div class="container">
<img src="booleanalgebra/imgs/ornor.png">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>(x NOR y)<br>NOR<br>(x NOR y)</b></th>
<th id="b2t"><b>x OR y</b></th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
</table>
</div>
</center>
<center>
<div class="container">
<img src="booleanalgebra/imgs/andnor.png">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>(x NOR x)<br>NOR<br>(y NOR y)</b></th>
<th id="b2t"><b>x AND y</b></th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
</table>
</div>
</center>

---

## Practice Problems

If y is false and (x NOR y) is true, what is x?

<textarea id="norq1"></textarea>
<br>
<button onclick="norq1Submit()">Submit</button>
<p id="norq1Out"></p>

