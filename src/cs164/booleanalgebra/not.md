Now that we've defined what a boolean statement is, let's start to do
work with them. The **NOT** operator switches the value of the boolean
statement. The boolean statement, "Carrots are healthy" evaluates to
true. When we add a NOT operator, it becomes "Carrots are not healthy"
which is a false statement. Now how do we represent this information?
There are many ways to represent boolean algebra expressions. There's an
algebraic notation which is a symbol used for expressions. Below is also
the representation of an in/out circuit symbol. The table is a truth
table. Truth tables are used to show every outcome of true and false
statements and their operators. Since NOT only takes one input, there's
only 2 posssible outcomes. We start with 0 as our first input then move
onto 1. If we remember, 0 and 1 are the binary values for 0 and 1. Here,
it's much harder to see, but as we move onto larger truth tables, we'll
get move of an understanding on how they work.

<center>
<code>
Notation: &#172;x , x'
</code>
<div class="container">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>&#172;x</b></th>
</tr>
<tr>
<td id="b2t">0</th>
<td id="b2t" style="background-color: rgb(140,140,140)">1</th>
</tr>
<tr>
<td id="b2t">1</th>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
</table>
<div class="container2">	
<img src="booleanalgebra/imgs/not.png" style="width: 312px; height: 117px">
<div class="simcir">
{
"width":312,
"height":108,
"showToolbox":false,
"devices":[
{"type":"DC","id":"dev0","x":52,"y":36,"label":"DC"},
{"type":"NOT","id":"dev1","x":164,"y":60,"label":"NOT"},
{"type":"LED","id":"dev2","x":220,"y":60,"label":"LED"},
{"type":"LED","id":"dev3","x":220,"y":12,"label":"LED"},
{"type":"Toggle","id":"dev4","x":108,"y":36,"label":"X"}
],
"connectors":[
{"from":"dev1.in0","to":"dev4.out0"},
{"from":"dev2.in0","to":"dev1.out0"},
{"from":"dev3.in0","to":"dev4.out0"},
{"from":"dev4.in0","to":"dev0.out0"}
]
}
</div>
</div>
</div>
</center>

NOT is the operator for negation.
Like in basic algebra, we know the negative sign is for negation.
So if we apply a negation to the number 6, we get -6.
If we apply a negation to -6, we get -(-6), which is the same as positive 6.

---

## Practice Problems

If y is true, what is y'?

<textarea id="notq1"></textarea>
<br>
<button onclick="notq1Submit()">Submit</button>
<p id="notq1Out"></p>

If q is true, what is q'''''?

<textarea id="notq2"></textarea>
<br>
<button onclick="notq2Submit()">Submit</button>
<p id="notq2Out"></p>

