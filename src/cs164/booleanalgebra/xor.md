The last main boolean operator is XOR. XOR is eXclusive OR. As we know,
the OR operator renders true as long as at least one value is true. The
XOR operator only renders true as long as only one value is true. This
mean if both values are true, the XOR is false. The Digital Logic
Workbench refers to XOR as EOR. The name isn't as important as what
happens though. It is very important to know the different between OR
and XOR.

<center>
<code>
Notation: x &#8853; y
</code>
<div class="container">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>x &#8853; y</b></th>
</tr>
<tr>
<td id="b2t">0</th>
<td id="b2t">0</th>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
<tr>
<td id="b2t">0</th>
<td id="b2t">1</th>
<td id="b2t" style="background-color: rgb(140,140,140)">1</th>
</tr>
<tr>
<td id="b2t">1</th>
<td id="b2t">0</th>
<td id="b2t" style="background-color: rgb(140,140,140)">1</th>
</tr>
<tr>
<td id="b2t">1</th>
<td id="b2t">1</th>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
</table>
<div class="container2">
<img src="booleanalgebra/imgs/xor.png" style="width: 312px; height: 127px">
<div class="simcir">
{
"width":312,
"height":108,
"showToolbox":false,
"devices":[
{"type":"Toggle","id":"dev0","x":108,"y":12,"label":"X"},
{"type":"Toggle","id":"dev1","x":108,"y":60,"label":"Y"},
{"type":"DC","id":"dev2","x":52,"y":36,"label":"DC"},
{"type":"EOR","id":"dev3","x":164,"y":36,"label":"EOR"},
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

In set theory, XOR is the same thing as the symmetric difference, or
disjunctive union of two sets. The disjunctive union (∆) of two sets are
the values that are in one set, but not the other.

<center>
![](booleanalgebra/imgs/xorvenn.png)
</center>

---

## Practice Problems

Will (x &#8853; x) ever be true?

<textarea id="xorq1"></textarea>
<br>
<button onclick="xorq1Submit()">Submit</button>
<p id="xorq1Out"></p>

