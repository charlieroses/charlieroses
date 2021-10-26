Technical
styles.css
# Resizmple

The past few months I've been doing research on
[Richard Miller's port of Plan9 for the Raspberry Pi4](https://youtu.be/O7ZELOUIyvw)
with the intention of writing my senior thesis about my work. I think it's
mentioned in my Experience or Projects section, but I also haven't updated
either of those in a moment.

Recently, I was in the class I TA for. My students were quietly working on their
assignment. It was 9am, so the other TA and I were exhausted, running on nothing
but coffee and Monster energy drinks. We were making jokes about putting the
iconic
[Windows XP](windowsxp.jpg)
background on things that definitely should not have the Windows XP background.
I mentioned it would be funny to put it on Plan9 as a way of bothering the
professor we TA for and my research advisor, Dr. Stuart. When I got home from
lab, instead of working on my research like a good student, I sat down and
decided to see how viable my joke would be.

[Rio](https://plan9.io/magic/man2html/1/rio)
is the windowing system for Plan9. It normally does not support wallpapers. It
typically has a plain gray background (HC#777777#, to be exact). After a quick
Google search, I was able to find an implementation for a wallpaper by
[Devine Lu Linvega](https://wiki.xxiivv.com/site/rio.html).
After a little fiddling, I was able to create the following image, which I
emailed over to my research advisor.

<center>
<img src="Plan9XP.png">
</center>

This earned me a quick 11pm "Uh huh" email. The next morning I got a second
response, "Wait, did you actually modify rio to support wallpapers or is that
image modified?" I gave Devine the credit they deserve, but mentioned I've got
more plans for the wallpaper. Devine's implementation relys on the image already
being the size of the window. If it's too small, it gets tiled. If it's too
large, it gets cut off. Resizing the window only increases the tiling. I decided
to take it upon myself to implement this functionality myself. As far as I'm
aware, no one has done this for Plan9 yet.

I originally used the
[resample](https://plan9.io/magic/man2html/1/resample)
function to resize the image based on the dimensions of my monitor. A similar
function didn't exist in C. So I took the time to learn the
[Plan9 Image format](https://plan9.io/magic/man2html/6/image)
and wrote my own. I'm quite proud of how elegant the function turned out, so
this blogpost is a tribute to it and the hours I poured into a whiteboard. I'll
post the rest of the wallpaper implementation in about a week when I finish
cleaning up other parts of the code.

I didn't know the
[difference between resampling and resizing an image](https://printingsourcebr.com/ufaqs/difference-between-resizing-and-resampling-an-image/)
at first, so I called my function `resizmple` as a joke while testing. The name
has grown on me now and I can't imagine changing it.

```psuedo
fun resizmple(io, xo, yo, in, xn, yn, d)
	// Decide and calculate scalars xs and ys

	ro := 0
	for rn := 0 to yn do
		if yn > yo then
			if (rn * yo) > (ro * yn) then
				ro++
		else
			if (rn * yo) < (ro * yn) then
				ro++
		fi

		co := 0
		for cn := 0 to xn do
			if xn > xo then
				if (cn * xo) > (co * xn) then
					co++
			else
				if (cn * xo) < (co * xn) then
					co++
			fi

			po := ((ro * xo) + co) * d
			pn := ((rn * xn) + cn) * d

			for i := 0 to d do
				in[pn + i] := io[po + i]
			rof
	
			if xo > xn then
				co += xs
		rof

		if yo > yn then
			ro += ys
	rof
end resizmple
```

## Resizmple V1

I've taken enough Data Structures and Algorithms courses to know that it's
important to have a solid foundation on how you'll store your data before you
try writing an algorithm for it. I know the uncompressed Plan9 image format that
I would be working with gives me `w * h` pixels, each represented by `d` bytes.
I've got two main options for storing this data:

1. A simple array of length `w * h * d` that matches how the image data is
	actually stored
	- The index of pixel `p` at location `(c, r)` is referenced with
		`((r * w) + c) * d)`
2. A three dimensional array that simulates the images output
	- An outermost array of length `h`
	- It's subarrays represent each row and have length `w`
	- It's subarrays represent each pixel and have length `d`
	- The index of pixel `p` at location `(c, r)` is referenced with `i[r][c]`

While the second option appears more "intuitive", its over complicating the
problem and the way the memory is being handled. I decided I can handle a simple
math problem if it means I don't have to play with pointers. This brings me to
my two major design principles I refused to waiver on:

1. The images are represented through one dimensional arrays
2. No fractional numbers

The fractional numbers just aren't worth the effort. This is meant to be a joke
project. I don't want to fight the intricacies of floating point numbers for a
silly background image. I use integer division to find our scalar `xs`. If we're
getting bigger, `xs = ceil(xn/xo)`. If we're getting smaller, `xs = ceil(xo/xn)`
If we're getting smaller, the new image will take every `xs`th pixel from the
old image:

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| a |   | b |   | c |   | d |   |
</div>

<div class="imgtbl">
| 0 | 1 | 2 | 3 |
|---|---|---|---|
| a | b | c | d |
</div>

If we're getting bigger, each pixel in the old image will be duplicated `xs`
times:

<div class="imgtbl">
| 0 | 1 | 2 | 3 |
|---|---|---|---|
| a | b | c | d |
</div>

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| a | a | b | b | c | c | d | d |
</div>

This doesn't create the prettiest output. Decreasing the size of the image is
lossy. Increasing the size of the image will create a blocky image. It's a small
price to pay for Plan9XP. I'm not a computer vision or graphics manipulation
person. I'm not going to write a resizing function based on color and eyes and
behavior and stuff. I just want my silly joke to work.

The reason I avoid software engineering at all costs is that the user exists and
interacts with my code. Typically I try to avoid writing code where the user has
options, but I think tiled wallpapers are hideous in every situation, so I gave
the user can specify how the image is scaled.

The image is not keeping the same dimensions
- `x` and `y` are being scaled independently and have separate `xs` and `ys`
	scalars

The image is keeping the same dimensions
- The image is being scaled by `xs`
	- `yn := yo * xs`
	- `ys := xs`
- The image is being scaled by `ys`
	- `xn := xo * ys`
	- `xs := ys`
- The image is not being scaled, and will be tiled across the screen
	- `xs = ys = 1`
	- `xn := xo`
	- `yn := yo`

In addition to this, going back to my core design principles, I want everything
done with integer values. So `xs` and ys` must be whole numbers. I need to
independently handle the cases where `xn > xo`, `xo > xn`, `yn > yo`, and
`yo > yn`. Depending on the orginal size of the image and the size of the
window, these can be used in a variety of combinations with the above. I refuse
to write 30 different loops for each combination. I want to write one general
loop that can apply universally. Knowing that every single pixel in the new
image needs to be filled, I get the following starting structure for my loop:

```psuedo
for rn := 0 to yn do
	for cn := 0 to xn do
		pn := ((rn * xn) + cn) * d
		po := ((ro * xo) + co) * d

		for i := 0 to d do
			in[pn + i] = io[po + i]
		rof
	rof
rof
```

The next task is to decide which pixel `po` at location `(co, ro)` gets selected
from the old image `io` to be copied over to the new image `in`.
One of the benefits of the way I'm choosing pixels is that the rows and columns
are taken independently. The column being grabbed has no impact on the row being
grabbed and vice versa. So for the remainder of the explanation, I'm going to
focus on the `x` component only, since I know its concepts will apply to the `y`
component too. I'm also going to ignore the depth of the image for the time
being, since it has no affect on the pixel selection.

The image getting larger is easy because `co` is just `cn * xs`:

```psuedo
for cn := 0 to xn do
	if xo > xn then
		co = cn * xs
rof
```

Getting smaller isn't as easy because `xo` is now smaller than `xn`, meaning
`co` is smaller than `cn` and cannot equal `cn * xs`. We would instead get that
`co = floor(cn / xs)` which is using fractional numbers, which I don't want to
do. 

Thinking about the rows and columns through a multiplication perspective won't
work. Knowing that multiplication is just repeated addition and a loop is
equivalent to a summation, then as `cn` increases by 1 each iteration, then
`co` increases by `xs`.

How does `co` increase when the image is getting smaller though? Pixels in the
old image are repeated in the new image. This means as `cn` increments by 1 each
iteration, `co` only increments by 1 every `xs`th iteration. I can adjust my
function accordingly:

```psuedo
co = 0
for cn := 0 to xn do
	if xo > xn then
		co += xs
	else if (xn > xo) and (cn % xs == 0) then
		co++
	fi
rof
```

Then this works and does what I wanted. Then I apply it to the full `resizmple`
function. Note that in practice, the scalars are calculated and decided based on
a `config` file the user writes.

```psuedo
fun resizmple(io, xo, yo, in, xn, yn, d)
	// Decide and calculate scalars xs ys

	ro := 0
	for rn := 0 to yn do
		co := 0
		for cn := 0 to xn do
			po := ((ro * xo) + co) * d
			pn := ((rn * xn) + cn) * d

			for i := 0 to d do
				in[pn + i] := io[po + i]
			rof

			if xo > xn then
				co += xs
			else if (xn > xo) and (cn % xs == 0) then
				co++
			fi
		rof

		if yo > yn then
			ro += ys
		else if (yn > yo) and (rn % ys  == 0) then
			ro++
		fi
	rof
end resizmple
```

I wasn't exactly thrilled with this solution. While I knew I wasn't entirely
serious about this and didn't need the most robust scaling system, this was
borderline nonfunctional. I could only scale by values 1/n or n/1. Given
`xo = 6` and `xn = 9` then `xs = ceil(xn / xo) = 2`. So the image would double
in size, then get cut off. I had other fish to fry, so rewriting `resizmple`
would have to wait.


## Resizmple V2

When I did get around to rewriting `resizmple` to support
non-integer scale values, I didn't want to actually use `float`s in my
algorithm. I was very happy with how my algorithm relied only on addition to
calculate the rows and columns and had no intention of changing this. I knew the
behavior I wanted to mimic, but I didn't know how to implement it. Given
`xo := 13` and `xn := 5`, I wanted something like:

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|----|----|----|
| a |   |   | b |   |   | c |   |   | d |    |    | e  |
</div>

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| a | b | c | d | e |
</div>

Here, the value I increase `co` by is not constant. I'm still losing `xo - xn`
columns of pixels in the compression, and that where I grabbed those columns
wouldn't matter too much, but I cared more about rewriting my algorithm to
handle scaling better. The biggest challenge would be calculating when I skip an
extra column. To get a better idea, I decided to look at how this would be
affected if I floored fractional numbers:

```eqn
xo / xn = 13 / 5 = 2.2
c0 = floor(cn * 2.2)
```

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|----|----|----|
| a |   | b |   |   | c |   | d |   |   | e  |    |    |
</div>

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| a | b | c | d | e |
</div>

I figured there has to be a way to do this using the modulo. So I made a few
more tables trying to figure out how to incorporate a modulo:

```eqn
xo / xn = v / 5
c0 = floor(cn * (v/5))
```

| 5 | 11 | 12 | 13 | 14 |
|---|----|----|----|----|
| 0 |  0 |  0 |  0 |  0 |
| 1 |  2 |  2 |  2 |  2 |
| 2 |  4 |  4 |  5 |  5 |
| 3 |  6 |  7 |  7 |  8 |
| 4 |  8 |  9 | 10 | 11 |

How much was co increased by?

| 5 | 11 | 12 | 13 | 14 |
|---|----|----|----|----|
| 0 |    |    |    |    |
| 1 |  2 |  2 |  2 |  2 |
| 2 |  2 |  2 |  3 |  3 |
| 3 |  2 |  3 |  2 |  3 |
| 4 |  2 |  2 |  3 |  3 |


When was `co` extra increased?

| 11 |    12     |    13     |    14     |
|----|-----------|-----------|-----------|
|    | 3 * (2/5) | 2 * (3/5) | 2 * (4/5) |
|    |           | 4 * (3/5) | 3 * (4/5) |
|    |           |           | 4 * (4/5) |

| 11 | 12  |  13  |  14  |
|----|-----|------|------|
|    | 6/5 |  6/5 |  8/5 |
|    |     | 12/5 | 12/5 |
|    |     |      | 16/5 |

From this I realized that I've figured it out, and ended up with:

```psuedo
xd := xo / xn
xm := xo % xn
xmi := 0

co += xd
if (cn * xm) > (xm * xmi ) then
	co++
	xmi++
fi
```

Now what if we're getting larger?

```eqn
cn = floor((xn / xo) * co)
```

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| a | b | c | d | e |
</div>

<div class="imgtbl">
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|----|----|----|
| a | a | b | b | b | c | c | d | d | d | e  | e  | e  |
</div>

This technically works, but `co` is our unknown, and we can't take it out of the
`floor`. If we took it out and only `floor`ed the division step, then we'd lose
the non integer scale value I've been trying to hold onto. Looking at how many
extra variables I had to add for getting smaller and then the problem in front
of me, I was about to give up and use floats when I realized:

```eqn
cn     xn
--  =  --
co     xo
```

It's just a ratio. ~~I wrote the explanation for V2 before V1, so in writing how
I wrote V1, I'm kicking myself a lot for not recognizing this earlier.~~
We already know the scale is `xn/xo`. If `cn` is consistently
increasing, then we need to increase `co` when this ratio doesn't hold anymore.
This gives:

```eqn
cn * xo = co * xn
```

When we're getting bigger and `xn > xo` then the ratio "breaks" when
`cn * xo > co * xn`. Now we need to increase `co`. This ensures we grab many
`co` for each `cn`. Then when getting smaller and `xo > xn` then the ratio
"breaks" when `cn * xo < co * xn`. The key here is that `co` is already
increasing by the integer division `xo/xn` each turn, so it has to remain
"further along" than `cn`. Instead of that ugly modulus mess above, I now can
apply this concept to both the `x` and `y` components and get my `resizmple`
algorithm with no division!

```psuedo
fun resizmple(io, xo, yo, in, xn, yn, d)
	// Decide and calculate scalars xs and ys

	ro := 0
	for rn := 0 to yn do
		if yn > yo then
			if (rn * yo) > (ro * yn) then
				ro++
		else
			if (rn * yo) < (ro * yn) then
				ro++
		fi

		co := 0
		for cn := 0 to xn do
			if xn > xo then
				if (cn * xo) > (co * xn) then
					co++
			else
				if (cn * xo) < (co * xn) then
					co++
			fi

			po := ((ro * xo) + co) * d
			pn := ((rn * xn) + cn) * d

			for i := 0 to d do
				in[pn] := io[po]
			rof

			if xo > xn then
				co += xs
		rof

		if yo > yn then
			ro += ys
	rof
end resizmple
```

While the scalars appear to be calculated through division and flooring, it's
not necessary. For a dimension `d`, the scalar `ds` between two values where
`d1 > d0` is calculated with:

```psuedo
for( ds := 0; ds * d0 < d1; ds++ )
```

Overall, I'm very proud of my little solution. My advisor related it to
[Bresenham's Line Drawing Algorithm](https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm)
in how Bresenham probably figured out his solution. He told me to write down my
solution. I'm glad I did. It was fun to break it down and reinforce why it
works. I also took the time to do a _bit_ of reformatting on the site and wrote
a syntax highlighter for psuedo code. Those are separate blogposts though. I've

