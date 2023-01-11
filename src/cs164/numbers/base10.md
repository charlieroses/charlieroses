Base-10 is the number system we all know and love.
We've been doing math with base-10 our entire lives.
Since we know how to add, subtract, multiply, divide and can do algebra with
this number system, I'd say we know it very well.
Our new goal is to understand all number systems as well as we understand
base-10.
Let's dissect base-10 and learn the intricacies and translate that to other
number bases.

Consider the number **314**.
This is a basic 3 digit number that will be rather easy to dissect.
To break down this number, I've set up the following table:

><
|       ||              |              |              |
|:-----:||:------------:|:------------:|:------------:|
| Digit || 3            | 1            | 4            |
| Power || 10^2^        | 10^1^        | 10^0^        |
| Value || (3 \* 10^2^) | (1 \* 10^1^) | (4 \* 10^0^) |
|       || 300          | 10           | 4            |
><

We've got three columns, one for each place value.
We've got three rows,

- **Digit**: The digit at the place value.
	3 is the digit in the 100s place,
	1 is the digit in the 10s place,
	4 is the digit in the 1s place.
	Since we're dealing with base-10, the digit is any value between 0 and 9.
- **Power**: This is where we get the terms "1s place", "10s place", "100s
	place" etc.
	Going from right to left, we start with a power of 0 and increase by 1 with
	each place.
	The base is then raised to that power.
- **Value**: Digit \* Power

So the number **314** dissected is equal to **300** + **10** + **4**.
This is equal to **(3 x 10^2^)** + **(1 x 10^1^)** + **(4 x 10^0^)**.
This form will allow us to understand every number system.

---

## Generalizing

Given a base `B` and an `n` digit number ``w=w~n-1~ ... w~0~``
where ``w~i~ &isinv; [0,B-1] &forall; i &isinv; [0, n)``,
The base-10 value of the number can be computed with:

<center>
<table>
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<tr>
<th></th>
<th>Converting a base `B` number to base 10</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td style="text-align: left">
Given an `n` digit number `w` in base `B` where <br>
<code>w=w<sub>n-1</sub>...w<sub>0</sub></code> and
<code>w<sub>i</sub> &isinv; [0,B-1] &forall; i &isinv; [0, n)</code>, <br>
The base-10 value of the number can be computed with:
</td>
</tr>
<tr>
<th></th>
<td>
```
 n-1  ⎛      i⎞
  ∑   ⎜ w * B ⎟
 i=0  ⎝  i    ⎠
```
</td>
</tr>
</tbody>
</table>
</center>

I bet I know what you're thinking.
"Whoa Charlie, I was totally understanding that addition and multiplication, but
then you added all this strange complicated math I've never seen before and now
I don't know anything".
If so, let's agree to disagree.

This section is going to be overwhelming.
I used new math notation you've probably never seen before.
As I walk through it, you'll realize that the actual math is very simple, it's
just a new way of writing it out.
Let's go over every symbol and what it all means.

"Given" refers to our inputs and information we have to start the problem.
Let's go over the givens:

- `B` is our number base.
	- In the above 314 example, `B=10` since we were using base-10
- `n` is how many digits the number has.
	- In the 314 example, `n=3`.
- `w` is the `n` digit number we'll be dealing with, but it has many parts that
	need to be broken down
	- In the 314 example, `w=314`

Let's break down the math language in `w` separately:

- ``w=w~n-1~...w~0~`` tells us that `w` has to have a
	certain form, and we are going to give "names" to the parts of that form.
	This form isolates each digit of `w` and gives it a subscript starting with
	`n-1` and going to `0`.
	- In the 314 example, `n=3` which tells us
		``w=w~2~w~1~w~0~``.
		Knowing that `w=314`, we now also know that
		<code>w<sub>2</sub>=3</code>, <code>w<sub>1</sub>=1</code>, and
		<code>w<sub>0</sub>=4</code>.
- <code>w<sub>i</sub> &isinv; [0,B-1] &forall; i &isinv; [0, n)</code> tells us
	that each of these subscripted parts of `w` have to also have a certain
	form.
	We use <code>w<sub>i</sub></code> to refer to a specific digit.
- Notice how we introduced a new variable `i` in <code>w<sub>i</sub></code>.
	`i` isn't in our givens.
	This statement <code> &forall; i &isinv; [0, n-1)</code> is where we define
	`i`.
	- <code> &forall; </code> translates to "for all".
	- The <code>&isinv;</code> symbol means "is a member of" or "in".
	- `[0, n-1)` is an interval that can be expanded into a set.
		`{` and `}` denote a set. The notation `{0, n-1}` would be a set with
		only two elements in it.
		`[`,`]`,`(`,`)` denote intervals that expand into sets where
		`[` and `]` denote inclusive endpoints while `(` and `)` are exclusive.
	- Putting it all together, we are going to apply a rule to
		<code>w<sub>i</sub></code> for all values of `i` in the interval
		`[0, n)` which is expanded into the set `{0, 1, ..., n-2, n-1}`
	- In the 314 example, `n=3`, which makes <code>i &isinv; [0, 3)</code>
		(which is the same as saying <code>i &isinv; { 0, 1, 2 }</code>).
		This means the rule <code>w<sub>i</sub> &isinv; [0, B-1]</code> applies
		to <code>w<sub>2</sub></code>, <code>w<sub>1</sub></code>, and
		<code>w<sub>0</sub></code> (which is just a fancy way of saying "every
		digit in the number").
- `[0, B-1]` is another interval
	- In the 314 example, `B=10` which means the interval
	`[0, B-1] = [0,9] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }`
- <code>w<sub>i</sub> &isinv; [0, B-1]</code> says that each individual digit
	of `w` must be in that interval.
	- In the 314 example <code>w<sub>2</sub>=3</code> and 3 is a member of the
		"allowed digit" set.
		(<code> 3 &isinv; {0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }</code>).
		The same applies for <code>w<sub>1</sub>=1</code> and
		<code>w<sub>0</sub>=4</code>.

There we have it, we've covered the fancy math language that describes our
input.
It looks really complicated, but that's just because you've never seen it
before.
The given statement is really just saying "If we have a number in a base `B`,
then that number has to abide by the rules of the number base".

Now let's look at that summation.

- `∑` is a summation.
	It takes the sum of many things.
	It's very similar to a for loop.
	- The number underneath introduces a new variable that gets incremented each
		iteration.
	- The number on top is where we're stopping.
	- The summation <code>∑<sub>i=1</sub><sup>5</sup> 3i</code> is equal to
		`(3*1) + (3*2) + (3*3) + (3*4) + (3*5)` which is equal to 45
- The inner part of the summation is easy, we've seen these variables before.
	- <code>w<sub>i</sub></code> will be the subscripted value of `w` (one digit
		in `w` at a time).
		This time, `i` references the `i` from the summation (don't worry it has
		the same values as before).
	- `B` is going to be the constant value from the base.
		It gets raised to the power of `i` from the summation.

Let's plug in the values from the 314 example and see it in action.

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
<td>
```
 n-1  ⎛      i⎞
  ∑   ⎜ w * B ⎟
 i=0  ⎝  i    ⎠
```
</td>
</tr>
<tr>
<th></th>
<td>
```
 3-1  ⎛       i⎞
  ∑   ⎜ w * 10 ⎟
 i=0  ⎝  i     ⎠
```
</td>
</tr>
<tr>
<th></th>
<td>
```
  2   ⎛       i⎞
  ∑   ⎜ w * 10 ⎟
 i=0  ⎝  i     ⎠
```
</td>
</tr>
<tr>
<th></th>
<td>
```
⎛       0⎞   ⎛       1⎞   ⎛       2⎞
⎜ w * 10 ⎟ + ⎜ w * 10 ⎟ + ⎜ w * 10 ⎟
⎝  0     ⎠   ⎝  1     ⎠   ⎝  2     ⎠
```
</td>
</tr>
<tr>
<th></th>
<td>
```
( 4 * 1 ) + ( 1 * 10 ) + ( 3 * 100 )
```
</td>
</tr>
<tr>
<th></th>
<td>
```
4 + 10 + 300
```
</td>
</tr>
<tr>
<th></th>
<td>
```
314
```
</td>
</tr>
</tbody>
</table>
</center>

See, it's all math you already know, just in a new format.
Again, this is probably super overwhelming, but take the time to digest the
actual math and the way we convert to base-10.
