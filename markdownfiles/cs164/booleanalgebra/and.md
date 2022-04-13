The AND operator renders true when both statement x and statement y are
true. Once again let's consider the weather. It's a good day if, "The
sky is blue" AND "It is sunny". Now, if the sky is gray and it's sunny,
then it's still not a good day. If the sky is blue and it's not sunny,
it's still not a good day. Only if the sky is blue AND it's sunny is it
a good day. Once again, we set up our truth table with 00, 01, 10, 11.
As you can see, only one case gives us a result of 1, and that's 11.

<center>
<code>
Notation: xy, x &#183; y , x &#8743; y
</code>
<div class="container">
<table>
<tr>
<th id="b2t"><b>x</b></th>
<th id="b2t"><b>y</b></th>
<th id="b2t"><b>x &#8743; y</b></th>
</tr>
<tr>
<td id="b2t">0</th>
<td id="b2t">0</th>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
<tr>
<td id="b2t">0</th>
<td id="b2t">1</th>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
<tr>
<td id="b2t">1</th>
<td id="b2t">0</th>
<td id="b2t" style="background-color: rgb(140,140,140)">0</th>
</tr>
<tr>
<td id="b2t">1</th>
<td id="b2t">1</th>
<td id="b2t" style="background-color: rgb(140,140,140)">1</th>
</tr>
</table>
<div class="container2">
<img src="booleanalgebra/imgs/and.png" style="width: 310px; height: 132px">
<div class="simcir">
{
"width":312,
"height":108,
"showToolbox":false,
"devices":[
{"type":"DC","id":"dev0","x":52,"y":36,"label":"DC"},
{"type":"AND","id":"dev1","x":164,"y":36,"label":"AND"},
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

In regular algebra, AND is comparable to multiplication. If you look at
the notation, one of them is the dot (·), another is placing the values
next to each other. This is a direct correlation to multiplication.
Let's consider multiplication by 0. If we multiply anything, including
0, by 0, we get the answer of 0. This is similar to how if anything is
False in the equation, we get the answer is False. The only way to avoid
a 0 answer, is to multiply two non-zero numbers.

In set theory, the equivalent to AND is the intersection of two sets.
The **intersection** is a set made of elements that are in both A and B.
The venn diagram below illustrates it better. The part highlighted in
blue is the intersection of sets A and B. It is literally where the two
venn diagrams intersect and nothing else. Just like with OR and union,
the intersection (∩) and AND (∧) symbols are very similar.

![](booleanalgebra/imgs/intersection.png)

---

## Practice Problems

If y is false and x is true, what is (x &#8743; &#172; y)?

<textarea id="andq1"></textarea>
<br>
<button onclick="andq1Submit()">Submit</button>

