Now that we've done a simple one input one output inversion, let's move
onto two inputs one output. OR is an operator that renders true when at
least one of two statements is true. Let's consider the weather. It is a
good day if "The sky is blue" OR "It is sunny". If the sky is blue and
it's not sunny, it's still a good day. If the both the sky is blue and
it is sunny, then it's a good day. Let's set up a truth table and
further analyze this operator. Our truth table now has 4 rows. If you
look closely, the rows count upwards, 0 1 2 3 in binary. Whenever you
set up a truth table, this is the best way to do it.

<center>
<code>
Notation: x + y , x &#8744; y
</code>
<div class="container">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>x &#8744; y</b></th>
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
<td id="b2t" style="background-color: rgb(140,140,140)">1</th>
</tr>
</table>
<div class="container2">
<img src="booleanalgebra/imgs/or.png" style="width: 312px; height: 127px">
<div class="simcir">
{
"width":312,
"height":108,
"showToolbox":false,
"devices":[
{"type":"Toggle","id":"dev0","x":108,"y":12,"label":"X"},
{"type":"Toggle","id":"dev1","x":108,"y":60,"label":"Y"},
{"type":"DC","id":"dev2","x":52,"y":36,"label":"DC"},
{"type":"OR","id":"dev3","x":164,"y":36,"label":"OR"},
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


In regular algebra, OR is comparable to addition. Let's think of adding
0 and random positive values. The only way to get 0 from adding not
negative values is to add 0 and 0. If we add 0 to any positive value, we
get that positive value. If we add two positive values, we got a
different positive value. This is similar to how when performing OR, the
only way to get F is to have all values be False. One of the notations
for OR is the plus sign (+) just as addition.

We see a similar relation to addition in set theory. A **union** of two
sets is all the elements in both sets. I included a venn diagram below.
The highlighted in blue is what would be in the union of A and B. Once
again, the union is everything in A **added** to everything in B. The
symbol for union (∪) also looks very similar to that of OR (∨).

<center>
![](booleanalgebra/imgs/union.png)
</center>

---

## Practice Problem

If y is false and (x ∨ y) is true, what is x?

<textarea id="orq1"></textarea>
<br>
<button onclick="orq1Submit()">Submit</button>
<p id="orq1Out"></p>


