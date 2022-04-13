So we're gonna start by adding two 1 bit numbers. I'm gonna first set
this up like a truth table. Remember, this is NOT a truth table. (No pun
intended) We are adding these bits.

<center>
<table>
<tr>
<th><b>x</b></th>
<th id="hamt"><b>+</b></th>
<th><b>y</b></th>
<th id="hamt"><b>=</b></th>
<th><b>Carry</b></th>
<th><b>Sum</b></th>
</tr>
<tr>
<td>0</td>
<td>+</td>
<td>0</td>
<td>=</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>+</td>
<td>1</td>
<td>=</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>+</td>
<td>0</td>
<td>=</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>+</td>
<td>1</td>
<td>=</td>
<td>1</td>
<td>0</td>
</tr>
</table>
</center>

Let's analyze the work we just did. First to notice, we added bits. 0 +
0 = 00. 0 + 1 = 01. 1 + 0 = 01. 1 + 1 = 10. This is all quite clearly
listed above. Remember the reason we use 00, 01, 10, and 11 as our
values for X and Y in that exact order. It's like in elementary school,
when you have certain meats and cheeses you can make a sandwich from.
You can only choose one meat and one cheese to make a sandwich, what are
all the combinations to make a sandwich, This order of numbers exhausts
all the possiblities of "binary sandwiches" we can create. Also, these
are the binary representations of the numbers 0, 1, 2 and 3. This puts
order into our sandwiches.\
Past that tangent, we've added the 1-bit values to create a two bit
value. The first bit is the sum, the second is the carry. Let's analyze
these columns. Since we're going to solve this problem with boolean
algebra, let's look at this from a boolean algebra perspective. If we
compare X, Y, and Carry, what boolean operator is this? What about the
Sum column? If we compare X, Y, and Sum what boolean opoerator creates
this outcome? Try not to peek down below.

If you answered the questions above correctly, you found that the two
main operators used are XOR and AND. Now if we apply XOR to both X and
Y, then apply AND to both X and Y, we have added two bits together and
formed a **Half Adder**. The half adder is a basic buiding block to
build a full adder and then a CPU. Down below I put circuits for the
half adder. Notice how X and Y are connected to both XOR and AND. Have
fun adding bits.

<center>
<div class="container">
<div class="simcir">
{
"width":264,
"height":112,
"showToolbox":false,
"devices":[
{"type":"DC","id":"dev0","x":16,"y":40,"label":"DC"},
{"type":"EOR","id":"dev2","x":144,"y":64,"label":"XOR"},
{"type":"AND","id":"dev1","x":144,"y":16,"label":"AND"},
{"type":"Toggle","id":"dev3","x":64,"y":16,"label":"X","state":{"on":false}},
{"type":"Toggle","id":"dev4","x":64,"y":64,"label":"Y","state":{"on":false}},
{"type":"LED","id":"dev5","x":200,"y":64,"label":"Sum"},
{"type":"LED","id":"dev6","x":200,"y":16,"label":"Carry"}
],
"connectors":[
{"from":"dev1.in0","to":"dev3.out0"},
{"from":"dev1.in1","to":"dev4.out0"},
{"from":"dev2.in0","to":"dev3.out0"},
{"from":"dev2.in1","to":"dev4.out0"},
{"from":"dev3.in0","to":"dev0.out0"},
{"from":"dev4.in0","to":"dev0.out0"},
{"from":"dev5.in0","to":"dev2.out0"},
{"from":"dev6.in0","to":"dev1.out0"}
]
}
</div>
<div class="simcir">
{
"width":264,
"height":112,
"showToolbox":false,
"devices":[
{"type":"DC","id":"dev0","x":16,"y":40,"label":"DC"},
{"type":"LED","id":"dev1","x":192,"y":16,"label":"Sum"},
{"type":"LED","id":"dev2","x":192,"y":64,"label":"Carry"},
{"type":"HalfAdder","id":"dev3","x":112,"y":40,"label":"HalfAdder"},
{"type":"Toggle","id":"dev4","x":64,"y":64,"label":"Y","state":{"on":false}},
{"type":"Toggle","id":"dev5","x":64,"y":16,"label":"X","state":{"on":false}}
],
"connectors":[
{"from":"dev1.in0","to":"dev3.out0"},
{"from":"dev2.in0","to":"dev3.out1"},
{"from":"dev3.in0","to":"dev5.out0"},
{"from":"dev3.in1","to":"dev4.out0"},
{"from":"dev4.in0","to":"dev0.out0"},
{"from":"dev5.in0","to":"dev0.out0"}
]
}
</div>
</div>
<br>
<img src="booleanalgebra/imgs/halfadder.png">
</center>

---

## Practice Problems

Enter the boolean operator that gives the same output as the CARRY column.

<textarea id="aq1"></textarea>
<br>
<button onclick="aq1Submit()">Submit</button>
<p id="aq1Out"></p>

Enter the boolean operator that gives the same output as the SUM column.

<textarea id="aq2"></textarea>
<br>
<button onclick="aq2Submit()">Submit</button>
<p id="aq2Out"></p>



