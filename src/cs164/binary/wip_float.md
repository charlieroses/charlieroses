This page is currently under construction.

Floating point numbers are a rather complex topic that we don't touch
much in this class. We want you to have a general understanding of the
topic.

---

## Scientific Notation

Before we look at floating point, a topic we don't understand, let's
look at a similar topic we do understand. Scientific notation is a
notation most commonly used in Chemistry and Physics to represent both
very large and very small numbers. Scientific notation has the following
format.

			<code>
				<center size="+4">
				<b>x * 10<sup>n</sup></b>
				</center>
				<br>
				<tab5>x : A number ranged [1.0, 10.0)</tab5>
				<br>
				<tab5>n : The power to which 10 is raised to</tab5>
				<br>
				<br>
				<tab5>Examples :</tab5>
				<br>
				<tab5>4500000000 : 4.5 * 10<sup>9</sup></tab5>
				<br>
				<tab5>0.0000000391 : 3.91 * 10<sup>-8</sup></tab5>
			</code>

As you can see, there is a very specific format this follows. The *x* is
never greater than 10. If *x* were to be greater than 10, it means that
we can multiply the answer by 10 again, and increase *n* accordingly.
This process is incredibly important to understand, as it is very
closely mimicked in floating point.

---

## The Process

---

## The Representation


Now that we understand how a floating point number works, we can look at
how the computer will represent this number. As we mentioned before, the
computer stores everything in strings of 0s and 1s. We've represented
numbers fairly easily using a string of 0s and 1s, however, floating
point isn't just a straight number. In floating point, we have a number,
multiplied by another number that is raised to a power. Now, we could
just take that answer and represent it using twos complement. However,
we can use floating point to represent both very large and very small
numbers. If we're using a 32 bit system, we wouldn't be able to
represent all numbers that floating point can represent. If only there
was a way to represent the full floating point number in binary... Oh
wait, there is!

<center>
`seeeeeeeemmmmmmmmmmmmmmmmmmmmmmm`
</center>


That clearly makes so much sense. Nothing confusing about that.
Absolutely easy to understand.

What does that long string of random letters mean? First, let's
recognize that each letter represents a bit, a 0 or 1. This would make
the above a 32 bit number. This has one *s* bit, 8 *e* bits, and 23 *m*
bits. Now, what do those letters mean?

			<code>
				<center size="+4">
					<b>m * 2<sup>e</sup></b>
				</center>
				<br>
				<tab5>s : sign (positive or negative)</tab5>
				<br>
				<tab5>e : exponent</tab5>
				<br>
				<tab5>m : mantissa</tab5>
			</code>

Just as before, the leftmost bit is the MSB (Most Significant Bit) and
represents the sign of the number. The exponent, in a 32 bit structure,
is an 8 bit number. Finally, the mantissa is the main number. Let's look
at the example in the slides.

<center>
<code>
+0.11 * 2<sup>1</sup>
</code>
</center>

---

## Applications
