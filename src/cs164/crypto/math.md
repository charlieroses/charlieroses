I'm going to say a dangerous phrase here, so tread carefully.
If you're a freshman in CS-164, you'll most likely never be tested on anything
in this section.

Why is this phrase so dangerous?

Students are busy.
They've got a lot of classes, extra-curriculars, lives, etc.
It can be tempting to only do the bare minimum required to get by in a class.
This leads to students focusing on the material that will be graded, since it's
the material that will have the "greatest impact" on them.
Sadly, typically the material that matters the most can't be graded or tested.

While you won't be tested on any of this math, I highly suggest taking the time
to read this section.
It provides a bit of context for the
[RSA Key Generation](crypto/rsa\_keygen.html) and _why_
[RSA Encryption](crypto/rsa.html) works.

This section obviously introduces a lot of new mathematical concepts with scary
vocab words and fancy Greek letters.
The goal of this section isn't to teach you how to generate RSA keys by hand.
The goal is to show you how to break down this all down.

Computer Science is an extremely math heavy field and it's also an incredibly
new field.
High school computer science curriculum is still being invented.
The high school CS curriculum that exists, _especially_ AP CS, mostly covers
programming.
There's little to no content that covers the mathematical basis for the field.
As you progress in future CS courses, you'll be presented with large formulas
filled with unfamiliar variables.
The goal of this section is to introduce new mathematical concepts and show how
to connect them to things we've seeen before and how to break them down into
something digestable and applicable.

While this section won't show up on any CS-164 exam, I urge you to take your
time to go through it.
Being able to make yourself comfortable with unfamiliar concepts is an important
skill.


---

## Modular Arithmetic

I already covered an introduction to modulo in the
[Base-2 section](numbers/baseTwo.html#intrducing-modulo).
This little "mini-section" is a dip into modular arithmetic, specifically some
of the basic points needed to understand parts of the
[RSA Key Generation](crypto/rsa\_keygen.html) and
[RSA Encryption](crypto/rsa.html) in general.

In the previous section, we used modulo as an operator that provides us with the
remainder after division.
We used the notation `x % m = r` to show how when `x = 7` and we divide it by
`m = 3`, we get the remainder `r = 1`.

As we move onto talking about **modular arithmetic**, modulo is more than an
operator and we need a new notation to reflect this:

><
| ||                       |
|-||-----------------------|
| || ``x % m = r``         |
| || ``x &equiv; r mod m`` |
><

Going back to the example I used before, `7 % 3 = 1` would be written as
``7 &equiv; 1 mod 3``.

Notice how the equivalence (&equiv;) is used instead of an equals sign (=).
In modular arithmetic, we create **equivalence classes**.
This may seem like a big scary word, but it describes a concept we already saw
earlier when using modulo as just an operator.

><
| ||                                      |                                      |                                      |
|-||--------------------------------------|--------------------------------------|--------------------------------------|
| || `0 % 3 = 0`                          | `1 % 3 = 1`                          | `2 % 3 = 2`                          |
| || `3 % 3 = 0`                          | `4 % 3 = 1`                          | `5 % 3 = 2`                          |
| || `6 % 3 = 0`                          | `7 % 3 = 1`                          | `8 % 3 = 2`                          |
| || ``{ 0, 3, 6, ... } &equiv; 0 mod 3`` | ``{ 1, 4, 7, ... } &equiv; 1 mod 3`` | ``{ 2, 5, 8, ... } &equiv; 2 mod 3`` |
><

When we perform the operation `x % 3`, no matter what `x` is, we can only get
one of three possible answers: 0, 1, or 2.
We use the equivalent symbol to show that multiple values can produce the same
answer.

As you can see, we already know how to calculate the equivalence class of a
value: it's just calculating it's just performing a modulo operation.
What if we want to go the opposite direction.
Let's say we have an equivalence class and we want to know what values it
contains.
How would we compute these values?

If you look at the above table, you may not even need me to tell you the answer
here.
Notice how all the values that produce 0 are mulitples of 3.
Look a little closer.
Notice how all the values that produce 1 are multiples of 3 plus 1, with 2
following the same pattern.
We can easily translate this into a simple formula:

><
| ||                                 |
|-||---------------------------------|
| || `x % m = r`                     |
| || `x &equiv; r mod m`             |
| || `mi + r = x | i &isinv; &Zopf;` |
><

Don't get worried if this isn't the exact equation you were thinking of.
I added a missing piece to the equation, `i`.
There's not really a mathematical symbol that says "any value that's a multiple
of `m`".
Instead, I've introduced `i` and multiplied it by `m`.
I've put a limit on `i` and said it must exist in (&isinv;) the set of integers,
&Zopf;.
In math, we've got a bunch of these letters that represent different types of
numbers.
Since <code>i &isinv; &Zopf; = { ..., -2, -1, 0, 1, 2, ... }</code> (the set of
integers), when we multiply `m` by `i`, we will always produce a multiple of
`m`.

If you're still struggling with understanding equivalence classes, it's helpful
to think of them like a clock.

<center>
<img src="crypto/clock.png" style="max-width: 40ch">
</center>

This also helps us visualize addition.
If it's 10pm, in 3 hours it will be 1am, or in modular arithmetic,
<code>10 + 3 &equiv; 1 mod 12</code>.
We can also define addition and multiplication in a more formal sense:

><
| ||                                                 |
|-||-------------------------------------------------|
| || `(a + b) mod m = ((a mod m) + (b mod m)) mod m` |
| || `(ab) mod m = ((a mod m) * (b mod m)) mod m`    |
><

Test these out on your own.
Plug in values for `a`, `b`, and `m` that you can verify by hand.
Test out values for `a` and `b` that are larger than `m`, smaller than `m`, or
equal to `m`.

---

## Prime Numbers

You've most likely seen prime numbers before, just not in the context of
cryptography, so this section is super short.

A **prime number** is a number whose only factors are 1 and itself.
Prime numbers include 1, 2, 3, 5, 7, 11, 13, etc.

Two numbers are **coprime** or **relatively prime** if they share no common
factors.
Prime numbers are all coprime with each other.
Numbers that are not prime can be coprime.
Niether 8 nor 9 is prime, but they are coprime with each other.

---

## Phi

Euler, that one mathematician that figured out too many things ~~and probably
needed a hobby~~ also figured out &phi; (phi). This is also called the totient
function.

<code>&phi;(n)</code> is the number of values in the range `[1, n]` that are
coprime with `n`.
Below, I've used a table to show step by step how <code>&phi;(8)</code> can be
computed:

><
| || `i &isinv; [1, n]` | Factors of `i` | Shared Factors with `n` | Coprime with `n`? |
|-||--------------------|----------------|-------------------------|-------------------|
| || `1`                | `1`            | `1, 2`                  | yes               |
| || `2`                | `1, 2`         | `1`                     | no                |
| || `3`                | `1, 3`         | `1`                     | yes               |
| || `4`                | `1, 2, 4`      | `1, 2, 4`               | no                |
| || `5`                | `1, 5`         | `1`                     | yes               |
| || `6`                | `1, 2, 3, 6`   | `1, 2`                  | no                |
| || `7`                | `1, 7`         | `1`                     | yes               |
| || `8`                | `1, 2, 4, 8`   | `1, 2, 4, 8`            | no                |
><

As we can see, four numbers between 1 and 8 are coprime with 8, thus
<code>&phi;(8) = 4</code>.

Phi has some cool properties.
Let's look at two easy ones.

1. If `n` is prime, then <code>&phi;(n) = n-1</code>
2. Given relatively prime numbers `a` and `b`,
<code>&phi;(ab) = &phi;(a) \* &phi;(b)</code>

You may think _"Woah! Niether of these are easy! I have no idea what I'm looking
at!"_.
Even though we don't have much experience with phi, we can still verify these
properties the same way we calculated phi.

### If `n` is prime, then <code>&phi;(n) = n-1</code>

As we know, 5 is a prime number.
Its only factors are `1` and `5`.
Let's again use a table, this time to calculate <code>&phi;(5)</code>:

><
| || `i &isinv; [1, n]` | Factors of `i` | Shared Factors with `n` | Coprime with `n`? |
|-||--------------------|----------------|-------------------------|-------------------|
| || `1`                | `1`            | `1`                     | yes               |
| || `2`                | `1, 2`         | `1`                     | yes               |
| || `3`                | `1, 3`         | `1`                     | yes               |
| || `4`                | `1, 2, 4`      | `1`                     | yes               |
| || `5`                | `1, 5`         | `1`                     | no                |
><

As we can see, <code>&phi;(5) = 4</code>.
This matches the property we're trying to prove where if `n` is prime, then
<code>&phi;(n) = n - 1</code>.

This also makes sense without the table performing the calculation.
Phi is calculated based on how many numbers less than `n` are coprime to `n`.
Two numbers are coprime if the only factor they share is 1.
If a number is prime, its only factors are 1 and itself.
Thus, if a number is prime, all numbers less than `n` must be coprime with `n`
as they cannot share any factors with `n`.

### Given relatively prime numbers `a` and `b`, <code>&phi;(ab) = &phi;(a) \* &phi;(b)</code>

Again, this looks like another super complicated property that can never make
sense.
This time, we have multiple values.
How could we ever make a table for this?

Let's verify that <code>&phi;(20) = &phi;(4) \* &phi;(5)</code>.
Notice that even though 4 isn't prime, it is coprime with 5.
In this table, I've left out the "Comprime with `n`?" column.
Instead, I've highlighted the "1"s that indicate a number is coprime with `n`.

><
| || `i &isinv; [1, n]` | Factors of `i`       | Shared Factors with `4`     | Shared Factors with `5`     | Shared Factors with `20`    |
|-||--------------------|----------------------|-----------------------------|-----------------------------|-----------------------------|
| || `1`                | `1`                  | <span class="hi">`1`</span> | <span class="hi">`1`</span> | <span class="hi">`1`</span> |
| || `2`                | `1, 2`               | `1, 2`                      | <span class="hi">`1`</span> | `1, 2`                      |
| || `3`                | `1, 3`               | <span class="hi">`1`</span> | <span class="hi">`1`</span> | <span class="hi">`1`</span> |
| || `4`                | `1, 2, 4`            | `1, 2, 4`                   | <span class="hi">`1`</span> | `1, 2, 4`                   |
| || `5`                | `1, 5`               |                             | `1, 5`                      | `1, 5`                      |
| || `6`                | `1, 2, 3, 6`         |                             |                             | `1, 2`                      |
| || `7`                | `1, 7`               |                             |                             | <span class="hi">`1`</span> |
| || `8`                | `1, 2, 4, 8`         |                             |                             | `1, 2, 4, 8`                |
| || `9`                | `1, 3, 9`            |                             |                             | <span class="hi">`1`</span> |
| || `10`               | `1, 2, 5, 10`        |                             |                             | `1, 2, 5, 10`               |
| || `11`               | `1, 11`              |                             |                             | <span class="hi">`1`</span> |
| || `12`               | `1, 2, 3, 4, 6, 12`  |                             |                             | `1, 2, 4`                   |
| || `13`               | `1, 13`              |                             |                             | <span class="hi">`1`</span> |
| || `14`               | `1, 2, 7, 14`        |                             |                             | `1, 2`                      |
| || `15`               | `1, 3, 5, 15`        |                             |                             | `1, 5`                      |
| || `16`               | `1, 2, 4, 8, 16`     |                             |                             | `1, 2, 4`                   |
| || `17`               | `1, 17`              |                             |                             | <span class="hi">`1`</span> |
| || `18`               | `1, 2, 3, 6, 9, 18`  |                             |                             | `1, 2`                      |
| || `19`               | `1, 19`              |                             |                             | <span class="hi">`1`</span> |
| || `20`               | `1, 2, 4, 5, 10, 20` |                             |                             | `1, 2, 4, 5, 10, 20`        |
><

Based on the highlighted "1"s in the table, we can verify our property.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td><code>&phi;(ab) = &phi;(a) \* &phi;(b)</code></td>
<td class="left">The original property</td>
</tr>
<tr><th></th>
<td><code>&phi;(20) = &phi;(4) \* &phi;(5)</code></td>
<td class="left">Plug in values</td>
</tr>
<tr><th></th>
<td><code>8 = 2 \* 4</code></td>
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

---

## Modular Inverses

It appears as though we just covered two very different concepts.
We learned about modular arithmetic and equivalence classes, then we learned
about prime numbers and this new &phi; function.
Let's tie these concepts together.

A **modular inverse** is also called a **multiplicative inverse**.
In the domain of <code>&Zopf;~m~</code> (the set of integers `[0, m)`), `a` and
`b` are inverses if <code>ab &equiv; 1 mod m</code>.
We can also write the inverse of `a` as <code>a^-1^</code>.

It is important to note that it is not guaranteed for `a` to have an inverse in
<code>&Zopf;~m~</code>.
Only if `a` and `m` are coprime, `a` has an inverse in <code>&Zopf;~m~</code>.
This means if `m` is prime, then <code>a^-1^</code> exists for all
<code>a > 0</code>.
If `m` is not prime, only <code>&phi;(n)</code> elements have inverses in
<code>&Zopf;~m~</code>.

Before we move further, let's verify this by plugging in some values:

><
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td colspan='2'>**When `m` is prime**</td>
</tr>
<tr><th></th>
<td colspan='2'><code>m = 5, &Zopf;~5~ = { 0, 1, 2, 3, 4 }</code></td>
</tr>
<tr><th></th>
<td>`1 * 1 = 1 &equiv; 1 mod 5`</td>
<td class="left">When `a = 1`, <code>a^-1^ = 1</code></td>
</tr>
<tr><th></th>
<td>`2 * 3 = 6 &equiv; 1 mod 5`</td>
<td class="left">When `a = 2`, <code>a^-1^ = 3</code><br>When `a = 3`,
<code>a^-1^ = 2</code></td>
</tr>
<tr><th></th>
<td>`4 * 4 = 16 &equiv; 1 mod 5`</td>
<td class="left">When `a = 4`, <code>a^-1^ = 4</code></td>
</tr>
<tr><th></th>
<td colspan='2'>**When `m` is not prime**</td>
</tr>
<tr><th></th>
<td colspan='2'><code>m = 4, &Zopf;~4~ = { 0, 1, 2, 3 }</code></td>
</tr>
<tr><th></th>
<td>`1 * 1 = 1 &equiv; 1 mod 4`</td>
<td class="left">When `a = 1`, <code>a^-1^ = 1</code></td>
</tr>
<tr><th></th>
<td>`2 * 1 = 2 &equiv; 2 mod 4`
<br>`2 * 2 = 4 &equiv; 0 mod 4`
<br>`2 * 3 = 6 &equiv; 2 mod 4`
</td>
<td class="left">When `a = 2`, <code>a^-1^</code> does not exist</td>
</tr>
<tr><th></th>
<td>`3 * 3 = 9 &equiv; 1 mod 4`</td>
<td class="left">When `a = 3`, <code>a^-1^ = 3</code></td>
</tr>
</tbody>
</table>
><

As we can see, 5 is prime and all non-zero elements have inverses in
<code>&Zopf;~5~</code>.
Meanwhile, 4 is not prime, so only the number of elements that are coprime with
4 have inverses in <code>&Zopf;~4~</code>.

In order to calculate a modular inverse, you _could_ do what I did and test
every single value in the domain, however, this gets pretty time consuming when
we get to larger numbers.
If only Euler wasn't such a slacker and thought of a theorem to calculate
modular inverses.
Oh, wait, he did!

><
| || Euler's Theorem                                           |
|-||-----------------------------------------------------------|
| || If `a` and `m` are coprime then ``a^&phi;(m)^ = 1 mod m`` |
><

Well thanks for the theorem buddy, but that doesn't help very much.
For an inverse, I need to multiply two numbers together to get 1, you only gave
me one.
Since Euler couldn't even give us two numbers, we should make sure this theorem
actually works.

><
| ||                                                          |
|-||----------------------------------------------------------|
| || **When `m` is prime**                                    |
| || ``m = 5, &phi;(5) = 4<br>&Zopf;~5~ = { 0, 1, 2, 3, 4 }`` |
| || ``1^4^ = 1 &equiv; 1 mod 5``                             |
| || ``2^4^ = 16 &equiv; 1 mod 5``                            |
| || ``3^4^ = 81 &equiv; 1 mod 5``                            |
| || ``4^4^ = 256 &equiv; 1 mod 5``                           |
| || **When `m` is not prime**                                |
| || ``m = 4, &phi;(4) = 2<br>&Zopf;~4~ = { 0, 1, 2, 3 }``    |
| || ``1^2^ = 1 &equiv; 1 mod 4``                             |
| || ``3^2^ = 9 &equiv; 1 mod 4``                             |
><

Turns out Euler wasn't joking.
His theorem is correct, but how can we use it to calculate inverses?

Looking at our cases when `m = 4`, we see that <code>1^2^ &equiv; 1 mod 4</code>
and <code>3^2^ &equiv; 1 mod 4</code>.
This looks very similar to when I had calculated the inverses.
We saw that <code>1 * 1 &equiv; 1 mod 4</code> and <code>3 * 3 &equiv; 1 mod 4</code>.
It looks like Euler gave us two numbers after all, he just hid them in the exponents.

Does this work for our cases when `m = 5` too?
It's not as obvious and we need to apply our multiplication rules from above.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td><code>m = 5, &phi;(5) = 4<br>&Zopf;~5~ = { 0, 1, 2, 3, 4 }</code></td></tr>
</tr>
<tr><th></th>
<td><code>a = 1, a^-1^ = 1<br>1 \* 1^3^ = 1 \* 1 &equiv; 1 mod 5</code></td>
</tr>
<tr><th></th>
<td><code>a = 2, a^-1^ = 3<br>2 \* 2^3^ &equiv; 1 mod 5
<br>2 \* 8  &equiv; 1 mod 5
<br>8 &equiv; 3 mod 5
<br>2 \* 3 = 6 &equiv; 1 mod 5</code></td>
</tr>
<tr><th></th>
<td><code>a = 3, a^-1^ = 2<br>3 \* 3^3^ &equiv; 1 mod 5
<br>3 \* 27  &equiv; 1 mod 5
<br>27 &equiv; 2 mod 5
<br>3 \* 2 = 6 &equiv; 1 mod 5</code></td>
</tr>
<tr><th></th>
<td><code>a = 4, a^-1^ = 4<br>4 \* 4^3^ &equiv; 1 mod 5
<br>4 \* 64  &equiv; 1 mod 5
<br>64 &equiv; 4 mod 5
<br>4 \* 4 = 16 &equiv; 1 mod 5</code></td>
</tr>
</tbody>
</table>
</center>

As simple as that, by testing a few small numbers, not only were we able to
understand Euler's theorem, but we can also put together our own formula to
calculate modular inverses.

><
| ||                                                                             |
|-||-----------------------------------------------------------------------------|
| || If `a` and `m` are coprime then<br><code>a^-1^ = a^&phi;(m)-1^ mod m</code> |
><

---

If you've made it this far, I hope you've found this as cool as I do.
If you understand this math, first, give yourself a pat on the back, especially
if it's your first time seeing this content.
Just because content is new doesn't mean it has to be difficult or scary.
If you're feeling super confident, try using your newfound knowledge to break
encryption and calculate your friends keys in lab.




