So the full adder is made by connecting two half adders. The full adder
can take three 1-bit inputs and them to create a 2-bit value. Our three
values would be the Carry-In, X and Y. Below is the table of the values.
Once again, we are adding the 3 bits. This is not a truth table. One
thing to notice is that since we have three inputs, there are much more
than 4 cases. We still set up the values in increasing order.

<center>
<table>
<tr>
<th><b>X</b></th>
<th><b>Y</b></th>
<th><b>Carry In</b></th>
<th><b>Carry Out</b></th>
<th><b>Sum</b></th>
</tr>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td style="background-color:rgb(140,140,140)">0</td>
<td style="background-color:rgb(140,140,140)">0</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">0</td>
<td style="background-color:rgb(140,140,140)">1</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td style="background-color:rgb(140,140,140)">0</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">0</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">1</td>
<td style="background-color:rgb(140,140,140)">1</td>
</tr>
</table>
</center>

The table looks very intimidating, however, if you look carefully, it's
simple bit addition. The first three columns are beng added together to
produce the last two. Now let's build our full adder. We're going to use
two half-adders. This is rather easy to remember as two halves form a
whole. The first half-adder will add X and Y. Now we have two outputs,
the sum and carry. We'll call these sum~1~ and carry~1~ since they're
the results of the first adder. The second adder will add the sum~1~ and
the carry-in. From this we get sum~2~ and carry~2~. Now we have three
outputs, carry~1~, sum~2~, and carry~2~. However, we only want 2
outputs, a sum and a carry. We have one sum but two carries. This means
we need to operate on the two carries. We need there to be an operator
who gives outputs a 1 as long as there's at least one 1. Which boolean
operator does this? Try not to peek again!

So now that we've used the OR operator to preserve any 1's left over, we
finally have two outputs! We have successfully built a full-adder. Down
below includes the schematics for a full-adder in 3 different ways; the
piece itself, broken down into half adder, and the half adders broken
down.

<center>
<div class="container">
<div class="simcir">
{
"width":264,
"height":164,
"showToolbox":false,
"devices":[
{"type":"Toggle","id":"dev0","x":72,"y":64,"label":"X"},
{"type":"Toggle","id":"dev1","x":72,"y":112,"label":"Y"},
{"type":"Toggle","id":"dev2","x":72,"y":16,"label":"Carry-In"},
{"type":"FullAdder","id":"dev3","x":128,"y":56,"label":"FullAdder"},
{"type":"LED","id":"dev4","x":216,"y":96,"label":"Carry-Out"},
{"type":"DC","id":"dev5","x":16,"y":64,"label":"DC"},
{"type":"LED","id":"dev6","x":216,"y":32,"label":"Sum"}
],
"connectors":[
{"from":"dev0.in0","to":"dev5.out0"},
{"from":"dev1.in0","to":"dev5.out0"},
{"from":"dev2.in0","to":"dev5.out0"},
{"from":"dev3.in0","to":"dev2.out0"},
{"from":"dev3.in1","to":"dev0.out0"},
{"from":"dev3.in2","to":"dev1.out0"},
{"from":"dev4.in0","to":"dev3.out1"},
{"from":"dev6.in0","to":"dev3.out0"}
]
}
</div>
<div class="simcir">
{
"width":408,
"height":164,
"showToolbox":false,
"devices":[
{"type":"HalfAdder","id":"dev0","x":216,"y":88,"label":"HalfAdder"},
{"type":"OR","id":"dev1","x":304,"y":40,"label":"OR"},
{"type":"LED","id":"dev2","x":360,"y":40,"label":"Carry-Out"},
{"type":"LED","id":"dev3","x":360,"y":88,"label":"Sum"},
{"type":"DC","id":"dev4","x":16,"y":64,"label":"DC"},
{"type":"Toggle","id":"dev5","x":72,"y":16,"label":"X"},
{"type":"Toggle","id":"dev6","x":72,"y":112,"label":"Carry-In"},
{"type":"HalfAdder","id":"dev7","x":128,"y":40,"label":"HalfAdder"},
{"type":"Toggle","id":"dev8","x":72,"y":64,"label":"Y"}
],
"connectors":[
{"from":"dev0.in0","to":"dev7.out0"},
{"from":"dev0.in1","to":"dev6.out0"},
{"from":"dev1.in0","to":"dev7.out1"},
{"from":"dev1.in1","to":"dev0.out1"},
{"from":"dev2.in0","to":"dev1.out0"},
{"from":"dev3.in0","to":"dev0.out0"},
{"from":"dev5.in0","to":"dev4.out0"},
{"from":"dev6.in0","to":"dev4.out0"},
{"from":"dev7.in0","to":"dev5.out0"},
{"from":"dev7.in1","to":"dev8.out0"},
{"from":"dev8.in0","to":"dev4.out0"}
]
}
</div>
<div class="simcir">
{
"width":372,
"height":164,
"showToolbox":false,
"devices":[
{"type":"Toggle","id":"dev0","x":72,"y":64,"label":"Y"},
{"type":"Toggle","id":"dev1","x":72,"y":112,"label":"Carry-In"},
{"type":"EOR","id":"dev2","x":128,"y":64,"label":"EOR"},
{"type":"AND","id":"dev3","x":200,"y":64,"label":"AND"},
{"type":"EOR","id":"dev4","x":200,"y":112,"label":"EOR"},
{"type":"AND","id":"dev5","x":128,"y":16,"label":"AND"},
{"type":"DC","id":"dev6","x":16,"y":64,"label":"DC"},
{"type":"OR","id":"dev7","x":256,"y":16,"label":"OR"},
{"type":"LED","id":"dev8","x":312,"y":40,"label":"Carry-Out"},
{"type":"Toggle","id":"dev9","x":72,"y":16,"label":"X"},
{"type":"LED","id":"dev10","x":312,"y":88,"label":"Sum"}
],
"connectors":[
{"from":"dev0.in0","to":"dev6.out0"},
{"from":"dev1.in0","to":"dev6.out0"},
{"from":"dev2.in0","to":"dev9.out0"},	
{"from":"dev2.in1","to":"dev0.out0"},
{"from":"dev3.in0","to":"dev2.out0"},
{"from":"dev3.in1","to":"dev1.out0"},
{"from":"dev4.in0","to":"dev2.out0"},
{"from":"dev4.in1","to":"dev1.out0"},
{"from":"dev5.in0","to":"dev9.out0"},
{"from":"dev5.in1","to":"dev0.out0"},
{"from":"dev7.in0","to":"dev5.out0"},
{"from":"dev7.in1","to":"dev3.out0"},
{"from":"dev8.in0","to":"dev7.out0"},
{"from":"dev9.in0","to":"dev6.out0"},
{"from":"dev10.in0","to":"dev4.out0"}
]
}
</div>
</div>
<br>
<img src="booleanalgebra/imgs/fulladder.png">
</center>

---

## Practice Problems

What boolean operator should we use to operate on carry~1~ and carry~2~?

<textarea id="aq3"></textarea>
<br>
<button onclick="aq3Submit()">Submit</button>
<p id="aq3Out"></p>

