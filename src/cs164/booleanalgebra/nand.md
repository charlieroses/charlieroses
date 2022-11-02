Just as OR had NOR, AND has NAND. NAND is the combination of NOT and
AND. This means the truth table is just the AND truth table with the
results inverted. NAND is true as long as both the values are not true.
Fun Fact: NOR and NAND are considered the universal gates, as using a
combination of these two can create any gate.

<center>
<code>
Notation: x NAND y 
</code>
<div class="container">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>x NAND y</b></th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">0</td>
<td id="b2t" style="background-color: rgb(140,140,140)">1</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">1</td>
<td id="b2t" style="background-color: rgb(140,140,140)">0</td>
</tr>
</table>
<div class="container2">
<img src="booleanalgebra/imgs/nand.png" style="width: 312px; height: 127px">
<div class="simcir">
{
"width":312,
"height":108,
"showToolbox":false,
"devices":[
{"type":"DC","id":"dev0","x":52,"y":36,"label":"DC"},
{"type":"NAND","id":"dev1","x":164,"y":36,"label":"NAND"},
{"type":"LED","id":"dev2","x":220,"y":36,"label":"LED"},
{"type":"Toggle","id":"dev3","x":108,"y":12,"label":"X"},
{"type":"Toggle","id":"dev4","x":108,"y":60,"label":"Y"}
],
"connectors":[
{"from":"dev1.in0","to":"dev3.out0"},
{"from":"dev1.in1","to":"dev4.out0"},
{"from":"dev2.in0","to":"dev1.out0"},
{"from":"dev3.in0","to":"dev0.out0"},
{"from":"dev4.in0","to":"dev0.out0"}
]
}
</div>
</div>
</div>
</center>


NAND is much like NOR, as mathematically, there isn't an exact
equivalent. However, just like NOR, NAND is a universal gate.

![](booleanalgebra/imgs/nandvenn.png)

---

## A Universal Gate

Just like NOR, NAND is a universal gate. All gates can be made with
NAND. We can create a NOT gate by putting the same input twice into a
NAND. This means we can do NOT NAND which is AND. Finally we can apply
DeMorgan's law to get OR. We'll talk more about DeMorgan's law in the
[Complex Expressions](booleanalgebra/boolExpr.html) page.

<center>
<div class="container">
<img src="booleanalgebra/imgs/notnand.png">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>x NAND x</b></th>
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
<img src="booleanalgebra/imgs/ornand.png">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>(x NAND x)<br>NAND<br>(y NAND y)</b></th>
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
<img src="booleanalgebra/imgs/andnand.png">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>(x NAND y)<br>NAND<br>(x NAND y)</b></th>
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

If y is false and x is true, what is (x NAND &#172; y)?

<textarea id="nandq1"></textarea>
<br>
<button onclick="nandq1Submit()">Submit</button>
<p id="nandq1Out"></p>	

