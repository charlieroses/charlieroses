RSA Encryption was introduced in 1977 by Ron Rivest, Adi Shamir and Leonard
Adleman at MIT; hence the name "RSA".
On the lecture slides, it's also called Public Key Encryption (PKE) and PKC
(Public Key Cryptography).

Some links you may find helpful in this section

- [RSA Key Generation Worksheet](https://www.cs.drexel.edu/~jpopyack/Courses/CSP/Wi19/notes/10.1_Cryptography/RSAWorksheetv4f.html)
- [RSA Encryption/Decryption Calculator](https://www.cs.drexel.edu/~jpopyack/Courses/CSP/Wi19/notes/10.1_Cryptography/RSA_Express_EncryptDecrypt_v2.html)
- [Dr. Stuart's Public Key Cryptography Lecture](https://1513041.mediaspace.kaltura.com/media/CS475+Crypto+3/1_st8qnz7g)

---

The [RSA Key Generation Worksheet](https://www.cs.drexel.edu/~jpopyack/Courses/CSP/Wi19/notes/10.1_Cryptography/RSAWorksheetv4f.html)
does most of this for you.
The math relies on a lot of properties of prime numbers in modular arithmetic.
The previous section (that I haven't written yet) covers it more.
You can also read through my notes from when I took
[CS-303: Algorithmic Number Theory & Cryptography](../ref/cs303.pdf)
CS-303 was a lot of work, but I really enjoyed the class.
When you actually got the chance to sit down and play with the material, the way
the numbers just worked was really cool.


#### 1. Select `p` and `q`

`p` and `q` must be two random prime numbers.
The larger the number, the more secure.
Think about how long it would take to check the primeness of a number.

#### 2. Compute `n`

`n = pq`

Since `p` and `q` are both prime, `n` only has four factors: `{1, p, q, n}`.
Even though `n` will be made public, it's still very difficult to calculate the
prime factorization of `n`.

#### 3. Compute <code>&phi;(n)</code>

<code>&phi;(n) = (p - 1)(q - 1)</code>

It may be tempting to just accept this new seemingly random formula without
question.
I urge you to look a little deeper into where this formula came from.

If we look back at the [the phi function](crypto/math.html#phi), we see that
the <code>&phi;(n)</code> function calculates how many values less than `n` are
coprime to `n`.
Why are we using subtraction and multiplication here?
Why aren't we using a loop to count the number of values?

In the aforementioned [math section](crypto/math.html#phi), I also showed you
the proof for two cool properties that &phi; has:

1. If `n` is prime, <code>&phi(n) = n - 1</code>
2. If `a` and `b` are coprime, then <code>&phi;(ab) = &phi;(a) * &phi;(b)</code>

Since we chose `p` and `q` to be prime numbers, when we put this all together we
get:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td>`n = pq`</td>
<td class="left">Definition of `n`</td>
</tr>
<tr><th></th>
<td><code>&phi;(n) = &phi;(pq)</code></td>
<td class="left">Substitute definition</td>
</tr>
<tr><th></th>
<td><code>&phi;(pq) = &phi;(p) * &phi;(q)</code></td>
<td class="left">Property of &phi;</td>
</tr>
<tr><th></th>
<td><code>&phi;(p) = p - 1</code></td>
<td class="left">Property of &phi;</td>
</tr>
<tr><th></th>
<td><code>&phi;(q) = q - 1</code></td>
<td class="left">Property of &phi;</td>
</tr>
<tr><th></th>
<td><code>&phi;(n) = (p - 1)(q - 1)</code></td>
<td class="left">Substitution</td>
</tr>
</tbody>
</table>
</center>

#### Choose `e` and `d`

`e` will be our public key and `d` will be our private key.

Choose `e` such that it is relatively prime to <code>&phi;(n)</code>

We then calculate `d` such that it becomes the inverse of `e`.
To do this, we use the following formula:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody><tr><th></th><td><code>ed &equiv; 1 mod &phi;(n)</code></td></tr></tbody>
</table>
</center>

Whoa!
That's a lot of strange new notation!
This form of equation is used primarily in modular arithmetic.
Even though it's a new notation, it's actually a concept we've seen before.
If you look back at the
[Base-2 section](numbers/baseTwo.html#introducing-modulo)
where I first introduced modulo, we used the notation `x % m = r`.
To translate this to the notation we see above, we just shuffle variables around
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

We've already seen things like `7 % 2 = 1`.
This would translate to <code>7 &equiv; 1 mod 2</code>.
Going the other way around, <code>ed &equiv; 1 mod &phi;(n)</code> would
translate to <code>ed % &phi;(n) = 1</code>.

I'm not going to cover the actual generation of `d` based on this formula.
I don't think it's worth explaining all of modular arithmetic and inverses to
understand this one part.

The [RSA Key Generation Worksheet](https://www.cs.drexel.edu/~jpopyack/Courses/CSP/Wi19/notes/10.1_Cryptography/RSAWorksheetv4f.html)
you use in lab generates possible `K` candidates which you choose to be factored
into `e` and `d`.
`K = (p - 1)(q - 1)i + 1` where `i` is a random number.
This is a possible approach because the numbers we are using on the worksheet
are very small.
In practice, it's much harder to generate the factors of a large number.

At first glance, the math for key generation appears to be very complicated and
overwhelming, but if we look at it closely, even the unfamiliar math is much
easier than it looks.


