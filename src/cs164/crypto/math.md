I'm not sure if you'll ever be tested on anything in this section.
I'm including it not because I don't believe that you should only learn things
that you know you will be tested on.
A lot of this number theory is really cool and really easy to work through.
It also provides a bit of context for the
[RSA Key Generation](crypto/rsa_keygen.html)
we'll see later.

I also have a super secret goal of getting you comfortable with breaking down
new mathematical concepts.
Just because something is new and overwhelming doesn't mean it has to be
difficult.

---

## Modular Arithmetic

I already covered an intro to modulo in the
[Base-2 section](numbers/baseTwo.html#intrducing-modulo),
so I'm not gonna go over everything again.

Earlier, when I first introduced modulo, we used the notation `x % m = r` to
show how when `x = 7` and we divide it by `m = 3`, then the remainder `r = 1`.
We use a more formal notation when using modular arithmetic.
To translate to this more formal notation, we just shuffle variables around
a bit and change some symbols

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th><td><code>x % m = r</code></td></tr>
<tr><th></th><td><code>x &equiv; r mod m</code></td></tr>
</tbody>
</table>
</center>

Going back to the example I used before, `7 % 3 = 1` would be written as
<code>7 &equiv; 1 mod 3</code>.

This notation makes modular arithmetic easier to explain.
Think of it like a clock, 10 o'clock + 3 hours = 1 o'clock.
In modular arithmetic, <code>10 + 3 &equiv; 1 mod 12</code>.

Obviously, there's so much more to know, but this is all that's needed right
now.

---

## Prime Numbers

Prime numbers are super important in cryptography.
They allow for a lot of really cool properties that make encryption and
decryption work.
Coprime/relatively prime : share no factors

---

## Phi

&phi; (phi) is one of the many things that Euler figured out.
My dude really needed a hobby.

<code>&phi;(n)</code> is the number of values in the range `[1, n]` that are
coprime with `n`.
Below, I've used a table to show step by step how <code>&phi;(8)</code> can be
computed:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr>
<th></th>
<th><code>i &isinv; [1, n]</code></th>
<th>Factors of `i`</th>
<th>Shared Factors with `n`</th>
<th>Coprime with `n`?</th>
</tr></thead>
<tbody>
<tr><th></th><td>`1`</td><td>`1`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`2`</td><td>`1, 2`</td><td>`1, 2`</td><td>no</td></tr>
<tr><th></th><td>`3`</td><td>`1, 3`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`4`</td><td>`1, 2, 4`</td><td>`1, 2, 4`</td><td>no</td></tr>
<tr><th></th><td>`5`</td><td>`1, 5`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`6`</td><td>`1, 2, 3, 6`</td><td>`1, 2`</td><td>no</td></tr>
<tr><th></th><td>`7`</td><td>`1, 7`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`8`</td><td>`1, 2, 4, 8`</td><td>`1, 2, 4, 8`</td><td>no</td></tr>
</tbody>
</table>
</center>

As we can see, four numbers between 1 and 8 are coprime with 8, thus
<code>&phi;(8) = 4</code>.

Phi has some cool properties.
Let's look at two easy ones.

1. If `n` is prime, then <code>&phi;(n) = n-1</code>
2. Given relatively prime numbers `a` and `b`,
<code>&phi;(ab) = &phi;(a) * &phi;(b)</code>

You may think _"Woah! Niether of these are easy! I have no idea what I'm looking
at!"_.
Even though we don't have much experience with phi, we can still verify these
properties the same way we calculated phi.

### If `n` is prime, then <code>&phi;(n) = n-1</code>

As we know, 5 is a prime number.
Its only factors are `1` and `5`.
Let's again use a table, this time to calculate <code>&phi;(5)</code>:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr>
<th></th>
<th><code>i &isinv; [1, n]</code></th>
<th>Factors of `i`</th>
<th>Shared Factors with `n`</th>
<th>Coprime with `n`?</th>
</tr></thead>
<tbody>
<tr><th></th><td>`1`</td><td>`1`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`2`</td><td>`1, 2`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`3`</td><td>`1, 3`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`4`</td><td>`1, 2, 4`</td><td>`1`</td><td>yes</td></tr>
<tr><th></th><td>`5`</td><td>`1, 5`</td><td>`1, 5`</td><td>no</td></tr>
</tbody>
</table>
</center>

As we can see, <code>&phi;(5) = 4</code>.
This matches the property we're trying to prove where if `n` is prime, then
<code>&phi;(n) = n - 1</code>.

This also makes sense without the table performing the calculation.
Phi is calculated based on how many numbers less than `n` are coprime to `n`.
Two numbers are coprime if the only factor they share is 1.
If a number is prime, its only factors are 1 and itself.
Thus, if a number is prime, all numbers less than `n` must be coprime with `n`
as they cannot share any factors with `n`.

### Given relatively prime numbers `a` and `b`, <code>&phi;(ab) = &phi;(a) * &phi;(b)</code>

Again, this looks like another super complicated property that can never make
sense.
This time, we have multiple values.
How could we ever make a table for this?

Let's verify that <code>&phi;(20) = &phi;(4) * &phi;(5)</code>.
Notice that even though 4 isn't prime, it is coprime with 5.
In this table, I've left out the "Comprime with `n`?" column.
Instead, I've highlighted the "1"s that indicate a number is coprime with `n`.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr>
<th></th>
<th><code>i &isinv; [1, n]</code></th>
<th>Factors of `i`</th>
<th>Shared Factors with `4`</th>
<th>Shared Factors with `5`</th>
<th>Shared Factors with `20`</th>
</tr></thead>
<tbody>
<tr><th></th><td>`1`</td><td>`1`</td>
<td><span class="hi">`1`</span></td>
<td><span class="hi">`1`</span></td>
<td><span class="hi">`1`</span></td>
</tr>
<tr><th></th><td>`2`</td><td>`1, 2`</td>
<td>`1, 2`</td><td>
<span class="hi">`1`</span></td>
<td>`1, 2`</td>
</tr>
<tr><th></th><td>`3`</td><td>`1, 3`</td>
<td><span class="hi">`1`</span></td>
<td><span class="hi">`1`</span></td>
<td><span class="hi">`1`</span></td>
</tr>
<tr><th></th><td>`4`</td><td>`1, 2, 4`</td>
<td>`1, 2, 4`</td>
<td><span class="hi">`1`</span></td>
<td>`1, 2, 4`</td>
</tr>
<tr><th></th><td>`5`</td><td>`1, 5`</td>
<td></td>
<td>`1, 5`</td>
<td>`1, 5`</td>
</tr>
<tr><th></th><td>`6`</td><td>`1, 2, 3, 6`</td>
<td></td>
<td></td>
<td>`1, 2`</td>
</tr>
<tr><th></th><td>`7`</td><td>`1, 7`</td>
<td></td>
<td></td>
<td><span class="hi">`1`</span></td>
</tr>
<tr><th></th><td>`8`</td><td>`1, 2, 4, 8`</td>
<td></td>
<td></td>
<td>`1, 2, 4`</td>
</tr>
<tr><th></th><td>`9`</td><td>`1, 3, 9`</td>
<td></td>
<td></td>
<td><span class="hi">`1`</span></td></tr>
<tr><th></th><td>`10`</td><td>`1, 2, 5, 10`</td>
<td></td>
<td></td>
<td>`1, 2, 5, 10`</td>
</tr>
<tr><th></th><td>`11`</td><td>`1, 11`</td>
<td></td>
<td></td>
<td><span class="hi">`1`</span></td>
</tr>
<tr><th></th><td>`12`</td><td>`1, 2, 3, 4, 6, 12`</td>
<td></td>
<td></td>
<td>`1, 2, 4`</td>
</tr>
<tr><th></th><td>`13`</td><td>`1, 13`</td>
<td></td>
<td></td>
<td><span class="hi">`1`</span></td>
</tr>
<tr><th></th><td>`14`</td><td>`1, 2, 7, 14`</td>
<td></td>
<td></td>
<td>`1, 2`</td>
</tr>
<tr><th></th><td>`15`</td><td>`1, 3, 5, 15`</td>
<td></td>
<td></td>
<td>`1, 5`</td>
</tr>
<tr><th></th><td>`16`</td><td>`1, 2, 4, 8, 16`</td>
<td></td>
<td></td>
<td>`1, 2, 4`</td>
</tr>
<tr><th></th><td>`17`</td><td>`1, 17`</td>
<td></td>
<td></td>
<td><span class="hi">`1`</span></td>
</tr>
<tr><th></th><td>`18`</td><td>`1, 2, 9, 18`</td>
<td></td>
<td></td>
<td>`1, 2`</td>
</tr>
<tr><th></th><td>`19`</td><td>`1, 19`</td>
<td></td>
<td></td>
<td><span class="hi">`1`</span></td>
</tr>
<tr><th></th><td>`20`</td><td>`1, 2, 4, 5, 10, 20`</td>
<td></td>
<td></td>
<td>`1, 2, 4, 5, 10, 20`</td>
</tr>
</tbody>
</table>
</center>

Based on the highlighted "1"s in the table, we can verify our property.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td><code>&phi;(ab) = &phi;(a) * &phi;(b)</code></td>
<td class="left">The original property</td>
</tr>
<tr><th></th>
<td><code>&phi;(20) = &phi;(4) * &phi;(5)</code></td>
<td class="left">Plug in values</td>
</tr>
<tr><th></th>
<td><code>8 = 2 * 4</code></td>
<td class="left">Plug in values from table</td>
</tr>
<tr><th></th>
<td><code>8 = 8</code></td>
<td class="left">Verified!</td>
</tr>
</tbody>
</table>
</center>

Pretty nifty huh.
Even though we're using Greek letters we've never seen before and properties
we've never seen before in math we've never seen before, we can still work
through problems to prove and verify things in ways we understand.


