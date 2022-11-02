
Now that we know the basics of using boolean algebra to add bits, we can
move onto more complicated adders. Just as we connected two half-adders
to create a full-adder, we can connect many full-adders to add more and
more bits. This is called a Parallel Adder. A Parallel Adder is made
when you use multiple full-adders and cascading carries to add multiple
bits. Right now we're going to set up 3 full adders to add two 3 bit
numbers. But we're going to set up our adder with something extra so we
can also subtract. If you remember from the binary tutorial, subtracting
is just adding the negative. To negate numbers, we use two's complement,
which is if you remember, switching the bits then adding 1. To do this
we're going to have a subtraction input. When this subtraction input
reads positive, it will add one, and switch the bits of one number. This
means we should apply a XOR operator to the Y value and the subtract
input. This way, if Subtract is true, then it will return the opposite
of each Y bit. For the table below, I put a few random examples down.
This is not the way to set up a table and I am only using this to
demonstrate possible outcomes. Try them out on the circuit simulator.

<center>
<div class="container">
<table>
<tr>
<th><b>X = x<sub>2</sub>x<sub>1</sub>x<sub>0</sub></b></th>
<th><b>Y = y<sub>2</sub>y<sub>1</sub>y<sub>0</sub></b></th>
<th><b>Subtract</b>
<th><b>Z = z<sub>2</sub>z<sub>1</sub>z<sub>0</sub></b></th>
<tr>
<tr>
<td>101</td>
<td>001</td>
<td>0</td>
<td>110</td>
</tr>
<tr>
<td>101</td>
<td>001</td>
<td>1</td>
<td>100</td>
</tr>
<tr>
<td>000</td>
<td>111</td>
<td>0</td>
<td>111</td>
</tr>
<tr>
<td>000</td>
<td>111</td>
<td>1</td>
<td>001</td>
</tr>
<tr>
<td>101</td>
<td>010</td>
<td>0</td>
<td>111</td>
</tr>
<tr>
<td>101</td>
<td>010</td>
<td>1</td>
<td>011</td>
</tr>
</table>
<div class="simcir">
{
"width":400,
"height":376,
"showToolbox":false,
"devices":[
{"type":"DC","id":"dev0","x":16,"y":8,"label":"DC"},
{"type":"FullAdder","id":"dev1","x":216,"y":200,"label":"FullAdder"},
{"type":"FullAdder","id":"dev2","x":216,"y":304,"label":"FullAdder"},
{"type":"Toggle","id":"dev3","x":88,"y":8,"label":"Subtract","state":{"on":true}},
{"type":"Toggle","id":"dev4","x":88,"y":64,"label":"x0","state":{"on":false}},
{"type":"Toggle","id":"dev5","x":88,"y":112,"label":"y0","state":{"on":true}},
{"type":"Toggle","id":"dev6","x":88,"y":168,"label":"x1","state":{"on":false}},
{"type":"Toggle","id":"dev7","x":88,"y":216,"label":"y1","state":{"on":true}},
{"type":"Toggle","id":"dev8","x":88,"y":272,"label":"x2","state":{"on":false}},
{"type":"Toggle","id":"dev9","x":88,"y":320,"label":"y2","state":{"on":true}},
{"type":"LED","id":"dev10","x":328,"y":96,"label":"z0"},
{"type":"LED","id":"dev11","x":328,"y":200,"label":"z1"},
{"type":"LED","id":"dev12","x":328,"y":304,"label":"z2"},
{"type":"EOR","id":"dev13","x":160,"y":320,"label":"XOR"},
{"type":"EOR","id":"dev14","x":160,"y":216,"label":"XOR"},
{"type":"EOR","id":"dev15","x":160,"y":112,"label":"XOR"},
{"type":"FullAdder","id":"dev16","x":224,"y":96,"label":"FullAdder"}
],
"connectors":[
{"from":"dev1.in0","to":"dev16.out1"},
{"from":"dev1.in1","to":"dev6.out0"},
{"from":"dev1.in2","to":"dev14.out0"},
{"from":"dev2.in0","to":"dev1.out1"},
{"from":"dev2.in1","to":"dev8.out0"},
{"from":"dev2.in2","to":"dev13.out0"},
{"from":"dev3.in0","to":"dev0.out0"},
{"from":"dev4.in0","to":"dev0.out0"},
{"from":"dev5.in0","to":"dev0.out0"},
{"from":"dev6.in0","to":"dev0.out0"},
{"from":"dev7.in0","to":"dev0.out0"},
{"from":"dev8.in0","to":"dev0.out0"},
{"from":"dev9.in0","to":"dev0.out0"},
{"from":"dev10.in0","to":"dev16.out0"},
{"from":"dev11.in0","to":"dev1.out0"},
{"from":"dev12.in0","to":"dev2.out0"},
{"from":"dev13.in0","to":"dev3.out0"},
{"from":"dev13.in1","to":"dev9.out0"},
{"from":"dev14.in0","to":"dev3.out0"},
{"from":"dev14.in1","to":"dev7.out0"},
{"from":"dev15.in0","to":"dev3.out0"},
{"from":"dev15.in1","to":"dev5.out0"},
{"from":"dev16.in0","to":"dev3.out0"},
{"from":"dev16.in1","to":"dev4.out0"},
{"from":"dev16.in2","to":"dev15.out0"}
]
}
</div>
</div>
</center>

