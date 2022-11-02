Now that we know our basic operators, we can form much larger expressions.
We use larger expressions to do more math and create processors like the ones in
your computer.
But how do we evaluate these expressions?

<center>
<code>(P &or; Q)' &and; (R &and; (P' &or; Q))</code>
</center>

We have two options.
In both options, we're going to build a truth table, but we're going to do it in
different ways.

### Option A

We can plug and chug. For each row of the truth table, we can plug in values for
`P`, `Q`, and `R` and simplify.

<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td><code>(P &or; Q)' &and; (R &and; (P' &or; Q))</code></td>
</tr>
<tr>
<th></th>
<td><code>(0 &or; 0)' &and; (0 &and; (0' &or; 0))</code></td>
</tr>
<tr>
<th></th>
<td><code>(0)' &and; (0 &and; (1 &or; 0))</code></td>
</tr>
<tr>
<th></th>
<td><code>1 &and; (0 &and; (1))</code></td>
</tr>
<tr>
<th></th>
<td><code>1 &and; 0</code></td>
</tr>
<tr>
<th></th>
<td><code>0</code></td>
</tr>
</tbody>
</table>
</center>

Then repeat for each row of the truth table

### Option B

We break each expression into smaller expressions and add columns to our
truth table.
In the above expression, we cannot evaluate <code>(P &or; Q)'</code> without
first evalulating <code>P &or; Q</code>.
To make these operations easier, we add a column for <code>P &or; Q</code> to
our truth table and find it's value for each row.
Now, when we add <code>(P &or; Q)'</code>, instead of needed to repeform the OR
calculation, we can just NOT the previous column.
We continue doing this for all of the parts of the expression and build our way
up:

<center>
<table>
<colgroup>
<col span="1" class="red">
<col span="2">
<col span="1" class="gray">
<col span="4">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th colspan="3">Inputs</th>
<th colspan="5">Intermediate Steps</th>
<th>Output</th>
</tr>
<tr>
<th></th>
<th>P</th>
<th>Q</th>
<th>R</th>
<th>P &or; Q</th>
<th>(P &or; Q)'</th>
<th>P'</th>
<th>P' &or; Q</th>
<th>R &and; (P' &or; Q)</th>
<th>(P &or; Q)' &and; (R &and; (P' &or; Q))</th>
</tr>
</thead>
<tbody class="lined">
<tr>
<th></th>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td class="lowlighttable">1</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">0</td>
<td class="lowlighttable">1</td>
<td class="lowlighttable">0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">0</td>
<td class="lowlighttable">1</td>
<td class="lowlighttable">1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">1</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">1</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">1</td>
<td class="lowlighttable">1</td>
<td class="lowlighttable">0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">1</td>
<td class="lowlighttable">1</td>
<td class="lowlighttable">1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td class="lowlighttable">0</td>
</tr>
</tbody>
</table>
</center>

---

## Simplifying Expressions

When we have these really long boolean expressions, they can get a little
unwieldy.
There are ways to simplify boolean expressions, similar to the ways we simplify
algebraic expressions with the associative, commutative, and distributive
properties.
_Note: I switched up my notation between sections. Sorry not sorry_

<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<tr>
<th></th>
<th>AND</th>
<th>OR</th>
</tr>
</thead>
<tbody class="lined">
<tr>
<th>Identity</th>
<td><code>1a  &#8801;  a</code></td>
<td><code>0 + a  &#8801;  a</code></td>
</tr>
<tr>
<th>Null Elements</th>
<td><code>0a  &#8801;  0</code></td>
<td><code>1 + a  &#8801;  1</code></td>
</tr>
<tr>
<th>Complement</th>
<td><code>aa'  &#8801;  0</code></td>
<td><code>a + a'  &#8801;  1</code></td>
</tr>
<tr>
<th>Indempotent</th>
<td><code>aa  &#8801;  a</code></td>
<td><code>a + a  &#8801;  a</code></td>
</tr>
<tr>
<th>Commutative</th>
<td><code>ab  &#8801;  ba</code></td>
<td><code>a + b  &#8801;  b + a</code></td>
</tr>
<tr>
<th>Associative</th>
<td><code>(ab)c  &#8801;  a(bc)</code></td>
<td><code>(a + b) + c  &#8801;  a + (b + c)</code></td>
</tr>
<tr>
<th>Distributive</th>
<td><code>a(b + c)  &#8801;  ab + ac</code></td>
<td><code>a + (bc)  &#8801;  (a + b)(a + c)</code></td>
</tr>
<tr>
<th>Absorption</th>
<td><code>a(a + b)  &#8801;  a</code></td>
<td><code>a + ab  &#8801;  a</code></td>
</tr>
<tr>
<th>De Morgan's Law</th>
<td><code>(ab)'  &#8801;  a' + b'</code></td>
<td><code>(a + b)'  &#8801;  a'b'</code></td>
</tr>
<tr>
<th>Involution</th>
<td colspan="2"><code>(a')'  &#8801;  a</code></td>
</tr>
</tbody>
</table>
</center>

This may look extremely overwhelming at first, but I promise, it's not that bad.
A lot of these are more intuitive than you'd think.
Let's look at the truth tables for the identities:

<center>
<div class="container">
<table>
<colgroup>
<col span="1" class="red">
<col span="1">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>a</th>
<th>1</th>
<th>1a</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>


<table>
<colgroup>
<col span="1" class="red">
<col span="1">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>a</th>
<th>1</th>
<th>0 + a</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>
</div>
</center>


As you can see, after both operations, our output is the same as our `a` input.
Go through the truth tables for the rest of these properties.
They're pretty neat.

Let's actually apply these rules and see them in action.
Remember our really nasty boolean expression at the top?
Let's see if we can make it a little less nasty with some simplification
rules.
First, let's fix that notation up:

<center>
<code>(P &or; Q)' &and; (R &and; (P' &or; Q)) --> (P + Q)'(R(P' + Q))</code>
</center>

Much better, let's see what we can do here:

<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<th>De Morgan's Law</th>
<td><code><span class="hi">(P + Q)'</span>(R(P' + Q))</code></td>
<td><code><span class="hi">(P'Q')</span>(R(P' + Q))</code></td>
</tr>
<tr>
<th>Distributive AND</th>
<td><code>(P'Q')<span class="hi">(R(P' + Q))</span></code></td>
<td><code>(P'Q')<span class="hi">(RP' + RQ)</span></code></td>
</tr>
<tr>
<th>Distributive AND</th>
<td><code><span class="hi">(P'Q')(RP' + RQ)</span></code></td>
<td><code><span class="hi">P'Q'RP' + P'Q'RQ</span></code></td>
</tr>
<tr>
<th>Commutative AND</th>
<td><code><span class="hi">P'Q'RP'</span> + P'Q'RQ</code></td>
<td><code><span class="hi">P'P'Q'R</span> + P'Q'RQ</code></td>
</tr>
<tr>
<th>Indempotent AND</th>
<td><code><span class="hi">P'P'</span>Q'R + P'Q'RQ</code></td>
<td><code><span class="hi">P'</span>Q'R + P'Q'RQ</code></td>
</tr>
<tr>
<th>Commutative AND</th>
<td><code>P'Q'R + <span class="hi">P'Q'RQ</span></code></td>
<td><code>P'Q'R + <span class="hi">P'Q'QR</span></code></td>
</tr>
<tr>
<th>Complement AND</th>
<td><code>P'Q'R + P'<span class="hi">Q'Q</span>R</code></td>
<td><code>P'Q'R + P'<span class="hi">0</span>R</code></td>
</tr>
<tr>
<th>Null Elements AND</th>
<td><code>P'Q'R + <span class="hi">P'0R</span></code></td>
<td><code>P'Q'R + <span class="hi">0</span></code></td>
</tr>
<tr>
<th>Identity OR</th>
<td><code><span class="hi">P'Q'R + 0</span></code></td>
<td><code><span class="hi">P'Q'R</span></code></td>
</tr>
</tbody>
</table>
</center>

Well that's _much_ easier to read, but how can we be sure that `P'Q'R` is
actually equivalent to `(P + Q)'(R(P' + Q))`?
With a truth table of course!

<center>
<table>
<colgroup>
<col span="1" class="red">
<col span="2">
<col span="1" class="gray">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>P</th>
<th>Q</th>
<th>R</th>
<th>(P + Q)'(R(P' + Q))</th>
<th>P'Q'R</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>0</td>
<td>0</td>
<td>0</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td>0</td>
<td>0</td>
<td>1</td>
<td class="lowlighttable">1</td>
<td class="lowlighttable">1</td>
</tr>
<tr>
<th></th>
<td>0</td>
<td>1</td>
<td>0</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td>0</td>
<td>1</td>
<td>1</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>0</td>
<td>0</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>0</td>
<td>1</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>1</td>
<td>0</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>1</td>
<td>1</td>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
</tr>
</tbody>
</table>
</center>

---

## Sum of Min Terms

You may find yourself thinking "Hmmm, I know how to turn an expression into a
truth table, but what if I have a truth table? How do I get an expression from
it?"
Well I'm glad you ~~let me create hypothetical questions for you~~ asked 
Let's look at this completely random truth table:

<center>
<table>
<colgroup>
<col span="1" class="red">
<col span="1">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>x</th>
<th>y</th>
<th>o</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>0</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td>0</td>
<td>1</td>
<td class="lowlighttable">1</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>0</td>
<td class="lowlighttable">1</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>1</td>
<td class="lowlighttable">0</td>
</tr>
</tbody>
</table>
</center>

You may recognize this as XOR, but as we covered before, XOR is a derived gate,
its a logic gate created by combining our basic AND, OR, and NOT operators.
How can we use this truth table to figure out how to compute `o` with only AND,
OR, and NOT gates?
We'll use a **sum of min-terms**.
A sum of min-terms is fairly self explanatory once you understand what it is.
We're going to find all the smallest (minimum) terms needed to create the
expression and use an OR (`+`) to combine them.
So how do we actually do this?

First, identify your true rows:

<center>
<table>
<colgroup>
<col span="1" class="red">
<col span="1">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>x</th>
<th>y</th>
<th>o</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<th></th>
<td><span class="hi">0</span></td>
<td><span class="hi">1</span></td>
<td><span class="hi">1</span></td>
</tr>
<tr>
<th></th>
<td><span class="hi">1</span></td>
<td><span class="hi">0</span></td>
<td><span class="hi">1</span></td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
</tbody>
</table>
</center>

We'll notice `o` is true in two situations: when `x=0,y=1` and when `x=1,y=0`.
Let's look at `x=0,y=1` first.
I want to write an expression that is true for _only_ this one case and false
for all other combinations.

What boolean operator is true in only one row?

If you thought <span class="hide">AND</span>, you're correct.

`x AND y` is only true when `x=1,y=1`.
However, we want an expression that's true only when `x=0,y=1`.
To get this, we'll simply apply a NOT to `x` to get:

<center>
<table>
<colgroup>
<col span="1" class="red">
<col span="1">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>x</th>
<th>y</th>
<th>x'y</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<th></th>
<td><span class="hi">0</span></td>
<td><span class="hi">1</span></td>
<td><span class="hi">1</span></td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<th></th>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
</tbody>
</table>
</center>

Now we've isolated one of the true rows. We can apply this same concept to our
`x=1,y=0` row to get `xy'`.
This gives us two min-terms: `x'y` and `xy'`.
We can now use an OR to combine these to get the resulting sum of min-terms
`x'y + xy'`.
Don't believe me?
Let's look at the truth table:

<center>
<table>
<colgroup>
<col span="1" class="red">
<col span="1">
<col span="1" class="gray">
<col span="1">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>x</th>
<th>y</th>
<th>x'y</th>
<th>xy'</th>
<th>o = x'y + xy'</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td class="lowlighttable">0</td>
<td class="lowlighttable">0</td>
<td>0</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">0</td>
<td class="lowlighttable">1</td>
<td>1</td>
<td>0</td>
<td class="lowlighttable">1</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">1</td>
<td class="lowlighttable">0</td>
<td>0</td>
<td>1</td>
<td class="lowlighttable">1</td>
</tr>
<tr>
<th></th>
<td class="lowlighttable">1</td>
<td class="lowlighttable">1</td>
<td>0</td>
<td>0</td>
<td class="lowlighttable">0</td>
</tr>
</tbody>
</table>
</center>

And there we go!
We got the exact same thing we started with!
This works for boolean expressions with more variables too.
Later, you'll see the full adder which takes in three inputs.
Once you've read that section, try to make a sum of min-terms for its truth
table.
Come back here to verify your answer:

Carry: <span class="hide">`x'yc + xy'c + xyc' + xyc`</span>

Sum: <span class="hide">`x'y'c + x'yc' + xy'c' + xyc`</span>


