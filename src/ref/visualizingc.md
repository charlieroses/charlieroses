# Visualizing C

At the time I'm writing this, I'm TAing a data structures course in C. Not to be
a massive nerd, but data structures in C is so much fun. I was taught data
structures in Python and it's just not the same. The benefit of using C is when
we draw our data structures, the syntax falls so perfectly into place. I have
many students that refuse to draw their data structures before writing code, so
I'm writing this in hopes that they understand what they're drawing better.
Hopefully people beyond my students can benefit from this. Also it is worth
noting that this is what _I_ do when I draw things out. It doesn't mean it's the
only way to do things. It's just how I like to draw things out and the way I
teach my students

The goal is to make boxes and arrows to visualize our memory to make pointers
less scary and to make us better programmers.

- [The Basics](#the-basics)
- [Data Structures](#data-structures)


---

## The Basics

<span id="intexample">Single</span> boxes are going to be our basic data types
like `int`, `long`, `float`, `char`, etc. Given the code:

```C
int a, b, c;
char s;

a = 10;
b = a;
c = a + b;
s = 'a';
```

We'd get something that looks like this:

![Example 1](imgs/intabc_chars.png)


This is pretty basic. Now lets do the same with two strings. Ones gonna be put
on the stack (memory that only exists within the bounds of a function), the
other on the heap (memory that exists everywhere). The code would look like
this to start:

```C
char *strA;
char strB[5];
```

Which would give us the corresponding image:

![Example 2 Part A](imgs/strsA.png)


First, remember that strings are just arrays of `char`s. Second, remember that
arrays are just multiple pieces of memory next to each other all referenced
through the same variable. In this case `strB` get's 5 boxes next to each other
since 5 `char`s will be in the string.

<span id="pointernumber">Meanwhile,</span>
`strA` is just a pointer (note the `*`) so it gets a box too, but
only one box. Pointers reference another memory location. Later, we'll draw
pointers as arrows, but really they are just a big hexadecimal number that
references a location in memory. However, when trying to visualize memory, a hex
number isn't very useful. Since we haven't yet given `strA` any memory to look
at yet, I just gave it a dot to show it's a pointer with no memory to point to.

Moving on, let's fill these variables.

```C
char *strA;
char strB[5];

strA = malloc( sizeof(char) * 5 );

strcpy( strA, "ciao" );
strcpy( strB, "ciao" );
```

![Example 2 Part B](imgs/strsB.png)

I've `malloc`ed some memory for `strA` which allocates a chunk of memory on the
heap for me, and returns a pointer to that memory. In my diagram, I've drawn
this as new boxes drawn next to each other with the arrow pointing to the first
box of memory. There are 5 boxes because I allocated enough room for 5 `char`s.
Technically, the `sizeof(char)` is equal to 1 byte, so I don't need it there,
but I like to include it when I'm teaching C to first timers because it reduces
issues for `malloc`ing other types of arrays.

I tend not to draw the blue dotted line in my diagrams because I've been doing C
for a while, but I drew a blue line to separate the stack and the heap memory.
While both `strA` and `strB` have the same values (the word "ciao") and take up
the same amount of memory (5 characters), they're in different places in memory
and at the end of this function, the memory `strA` will still exist. `strB` will
not. This is shown better in the <span id="stackheap">snippet below</span>:

```C
char *fooA() {
	char *strA;
	char strB[5];

	strA = malloc( sizeof(char) * 5 );

	strcpy( strA, "ciao" );
	strcpy( strB, "ciao" );

	return strA;
}

char *fooB() {
	char *strA;
	char strB[5];

	strA = malloc( sizeof(char) * 5 );

	strcpy( strA, "ciao" );
	strcpy( strB, "ciao" );

	return strB;
}

void main() {
	char *strC;

	strC = fooA();
	printf("%s\n", strC); // "ciao" will print!
	// While the specific pointer strA does not exist anymore, the memory
	// it referenced does

	strC = fooB();
	printf("%s\n", strC); // "ciao" will not print :(
	// Both the pointer strB and the memory it referenced were on the stack and
	// no longer exist
}
```

How do we clean up this `malloc`ed memory though? With a `free`:

```C
char *strA;
char strB[5];

strA = malloc( sizeof(char) * 5 );

strcpy( strA, "ciao" );
strcpy( strB, "ciao" );

free( strA );
```

Which then "deletes" the memory pointed to by `strA` and the pointer is now
`NULL`. This gives us the following diagram:

![Example 2 Part C](imgs/strsC.png)

One final thing to cover is a <span id="structintro">`struct`</span>. This is
going to be drawn similar to an array with boxes next to each other, but instead
of being referenced through indices, we use members.

```C
typedef struct S {
	int l;
	char *str;
} S;

void main() {
	struct S stA;
	struct S *stB;
	struct S *stC;

	stA.l = 6;
	stA.str = malloc( stA.l );
	strcpy( stA.str, "hello" );

	stB = malloc( sizeof(struct S) );
	stB->l = 12;
	stB->str = malloc( stB->l );
	strcpy( stB.str, "hello there" );

	stC = stB;

	printf("A String: %s\n", stA.str);  // hello
	printf("B String: %s\n", stB->str); // hello there
	printf("C String: %s\n", stC->str); // hello there

	// Diagram is memory at this point

	free( stA.str );
	free( stB->str );
	free( stB );
}
```

![Example 3](imgs/structsB.png)

I mentioned in the snippet, but note that the diagram is the memory before it's
all `free`d. One of the many benefits of drawing everything out is it's easy to
tell what memory needs to be `free`d.

Looking at the snippet, `stA` is on the stack along with pointers `stB` and
`stC`. While `stA` is on the stack, it's string component needs to be
`malloc`ed which puts the string memory on the heap. Only `stA.str` needs to be
`free`d, not `stA`.

Pointer `stB` has it's `struct` data `malloc`ed, putting the data on the heap.
It's string still needs to be `malloc`ed in its own statement.

It's important to note, both strings "hello" and "hello there" will exist at the
end of the function. The struct pointed to by `stB` will also exist at the end
of the function. The struct `stA` will not.

I also introduced `stC` which does not get `malloc`ed. This means it does not
get it's own set of boxes. It has to share boxes with another pointer. When I do
`stC = stB;` I am telling `stB` to "share" with `stC`. This __does not__ make
`stC` point to `stB`. This line has `stC` point to the same memory that `stB`
points to. As mentioned [before](#pointernumber), pointers are just numbers.
This is similar to the
[above example](#intexample) where when doing `b = a;` didn't create an arrow
from `b` to `a`, but just copied the number.

Since `stC` and `stB` are pointing to the same memory, when I print out all the
strings, `stC` and `stB` will print the same thing. This means that I can change
the string "hello there" through `stB` or `stC`. This is easier to see in the
following snippet:

```C
stB->str[6] = 'w';

printf("%s %s\n", stB->str, stC->str); // hello where hello where

stC->str[9] = 'n';
stC->str[10] = '\0';

printf("%s %s\n", stB->str, stC->str); // hello when hello when
```

I'll also mention, you may notice the syntax change between `stA` and `stB`. I
cover this [later](#structsyntax) in the "putting it all together" data
structure section with more context.

Before moving forward, I will mention that I draw structs a variety of different
ways depending on the application. Here's a few different options I use.

![Structs](imgs/structsA.png)


### Recap

Before moving onto larger code that combines all these features, let's recap the
basics.

**Primitives :** Single box (`int`, `float`, `char`, etc)

**Arrays :** Many boxes right next to each other, referenced by index

**Structs :** Boxes next to each other, referenced by members

**Pointers :** Dots in a single box and arrows to another box

`malloc` **:** Creates new box(es) and an arrow pointing to them

`free` **:** Removes box(es) and the arrows pointing to them. The "opposite" or
"undo" of `malloc`

---

## Data Structures

Now that we understand the basics, let's use these tools to make a complex
implementation of a simple data structure. We're going to create a dynamically
allocated queue implemented over an array. For the sake of application, we'll
say our queue is a line of people making reservations at a restaurant. So each
"thing" in the queue needs to have a name and a number of people in the party.

This is a variation on the first assignment we gave in the data structures
class. They had to do a dynamically allocated list implemented over an array. I
don't want to duplicate the assignment obviously. We provided the students with
the `struct`s needed. It was up to them to implement all the functions. I'll
provide the `struct`s here too.

```C
typedef struct Queue {
	int size;
	int alloc;
	QEntry **data;
	QEntry *tail;
} Queue;

typdef struct QEntry {
	int party;
	int l;
	char *name;
} QEntry;
```

Many students got stuck with how these `struct`s translate into a Queue of
people, so I ended up drawing a diagram similar to this about a million times.
First, let's just draw the basic `struct`s on their own so we can see what we're
dealing with. I've drawn the <span class="dpurple">`Queue`</span> with a
<span class="dpurple">purple</span> outline and the
<span class="dblue">`QEntry`</span> with a <span class="blue">blue</span>
outline just so they're easier to find later. Here, I listed the full types and
names of each member of the struct. These will get shortened to single letters
in the larger diagram.

![Queue structs](imgs/qstructs,png)

We can see here that even though `data` is a `QEntry**` it's still only one dot,
not two. This means that `data` will point to another dot, which will then
point to some `QEntry` data.

How we use and draw these is up to the problem at hand. It's safe to assume that
`data` is going to be the array of "people" in the queue. It's also pretty easy
to tell that `size` is going to be the number of "people" currently in the
queue and `alloc` is the number of people we can put in the queue in total.
However, `tail` is a pointer. We know a tail pointer in a queue points to where
the end is, but should it be `malloc`ed?

Let's build the data structure based on our knowledge of queues.

![Queue Structure](imgs/qblank.png)

In this drawing, I've decided to `alloc`ate 4 spaces in the queue for 4
potential "people". Only 3 people are currently in "line", meaning the `size` of
the queue is 3.

This drawing matches shows me exactly what I need to `malloc`.

- I need 1 `malloc` for the `Queue`.
- I need 1 `malloc` for the `data`. In this `malloc`, I need to make sure I have
	enough space for `alloc` pointers to `QEntry`s. 
- I need a `malloc` for every `QEntry` that exists. In this case, there are 3
	`malloc`s. In the general case, you'd need the amount of `size`.
- For every `QEntry`, I also need a `malloc` for each `name`. This needs to give
	me enough `char`s to fit all the letters in the person's name in addition to
	the null terminator `\0`

This gives me a total of 8 `malloc`s and like my drawing shows, there are 8
blocks of memory. The `Queue` pointer is on the stack.

This also shows I do not need to `malloc` the `tail` pointer, since it points
to an already existing block of memory.

I only have one variable on the stack, `myQ`. How do I reference all this data
through this single pointer?

![Queue Structure](imgs/qred.png)

Let's start at the top. We have `myQ` without anything else around it. This
alone gives us access to the pointer to the full data structure. Since `myQ` is
on the stack, it will not exist at the end of the function. Though, as we saw
[before](#stackheap) we can pass this pointer around between functions and the
`malloc`ed heap memory will still exist.

![Queue Structure](imgs/qorange.png)

Now we start playing <span id="structsyntax">chutes and ladders</span>. We use a
`*` to "travel down" an arrow. [Above](#structintro) we saw the members of
`struct`s on the stack being referenced with the dot (`.`) notation. We also saw
members of `struct`s on the heap being referenced with the arrow (`->`)
notation.

The most important thing here is `aStruct->aMember == (*aStruct).aMember`.

At this "layer", we can print out the `size` and `alloc` of the `Queue`. We have
access to the `tail` and `data` pointers, but we haven't "travelled" far enough
yet to see what they point to.

_It's also worth noting, while not relevant to this example, while a `*` will
allow us to "travel down a chute", a `&` will allow us to "travel up a ladder"._

![Queue Structure](imgs/qyellow.png)

We're going to travel down another chute to access elements of the `data` array.
At this layer, once again, we haven't "travelled far enough" to gain access to
any of the "people" information, but there's something more important to note
here.

We know we "travel down" using the `*` syntax, but when we access array indices,
we use `arr[i]`. Remember when I said [before](#pointernumber) that pointers are
numbers? These numbers can be added to and subtracted from. Similar how with
structs, the arrow notation is shorthand for the pointer and dot notation, the
bracket notation in arrays is shorthand for pointer arithmetic.

This is shown above in the context of the data structure, but without all the
extra stuff, `arr[i] == *(arr + i)`

Pointer arithmetic is confusing the first time you see it, but it's fundamental
in understanding why arrays work. All the elements in an array can be accessed
through one variable and an index. If this variable (`arr`) is a pointer and has
a hex value of (hypothetically) `0x1a2b`, then we expect the first element of
the array to be at the memory location `0x1a2b`. The second element of the array
(index 1) needs to be the next "box" of memory. Given an array of `char`s, the
`sizeof(char)` is 1 byte. This means `arr + 1 = 0x1a2b + 0x0008 = 0x1a33` which
is the address we can expect to find the next `char`. We then use the `*` to
"travel" to this new address. This is a lot to unpack when learning C.

TL;DR: `arr[i] == *(arr + i)` and `aStruct->aMember == (*aStruct).aMember` and
we use the `*` to travel down a pointer.

![Queue Structure](imgs/qgreen.png)

At this "layer" we know everything we need to know about pointers to keep going.
Just to refresh ourselves, we use the arrow notation `->` to travel to the
`QEntry` and access its members. I also included the pointer arithmetic with all
the `*` to show that we have travelled down 3 arrows and there are 3 `*`s in
that clunky syntax.

Here, we can finally access our specific restaurant guest name and party info.

![Queue Structure](imgs/qblue.png)

Finally, if we want to access the specific characters of the reservations'
names, we can index the string. This information is not relevant to the problem
at hand.

![Queue Structure](imgs/qlayers.png)

I'm including this last image just to show the syntax and "layers" without the
arrows showing the "trail" we took to get there. It's a bit cleaner.


This is all I have for this reference. This might as well be an entire lecture
on its own. TL;DR: draw your data structures before you write code.


