# That One String Pointer Error

I've explained this error a million times to a million students and I'm sure
I'll explain it a million more. I've managed to explain it everytime with the
same images and explanations I wrote the first time around. This is my attempt
to clean that explanation up so I can copy and paste it in the future.

---

Let's say you're reading a file of words and numbers and it looks something like
this:

```
apple 5
banana 6
blueberry 9
grape 5
```

And you want to store all these ~~fruits~~ words and their lengths in separate
`struct`s that you have stored in an array for future use. The output you WANT
is:

```
[ apple : 5 ]
[ banana : 6 ]
[ blueberry : 9 ]
[ grape : 5 ]
```

But the output you GET is:

```
[ grape : 5 ]
[ grape : 6 ]
[ grape : 9 ]
[ grape : 5 ]
```

Oh no! It looks like that last string duplicated to be every string! How did
this happen?

I'm willing to bet you've got some code that looks something like this:

```C
#include<stdio.h>
#include<stdlib.h>

typedef struct Fruit {
	char *word;
	int len;
} Fruit;

void main() {
	FILE *fp;
	char buf[10];
	int n, i;
	struct Fruit input[4];

	fp = fopen( "fruitfile.txt", "r" );

	i = 0;
	while( fscanf(fp, "%s %d", buf, &n) != EOF ) {
		input[i].word = buf;
		input[i].len = n;
		i++;
	}

	fclose( fp );

	for( i = 0; i < 4; i++ )
		printf("[ %s : %d ]\n", input[i].word, input[i].len);
}
```

_Note: Only one line of this code actually matters regarding the error_


So let's [draw it out](visualizingc.html). We've got two main variables `word`
and `n` and a big data structure `input`. This looks something like:

![Empty Data](imgs/stringerrA.png)

Every iteration of the `while` loop, `buf` and `n` are filled with the values
from the file. These change each iteration of the loop. We then use the next
lines `input[i].word = buf` and `input[i].len` to store those values into our
data structure. The result after the first iteration looks like this:

![apple input](imgs/stringerrB.png)

So now we iterate again. We fill `buf` and `n` with our new values, then store
those in our data structure. After `banana` our data looks like this:

![banana input](imgs/stringerrC.png)

Here we can start to see where the source of our error is. We changes the values
of `n` and `buf`. Since `n` is an `int`, the value just gets "copied" over to
the data structure. Since `buf` is a pointer to a string, the pointer gets
"copied" to the data structure, not the actual string. At the end of the `while`
loop, everything points to `buf` which stores the last input.

Here are those last two iterations:

![blueberry input](imgs/stringerrD.png)

![grape input](imgs/stringerrE.png)

How do we fix this? How do we store the actual characters into the data
structure and not just copy the pointer?

Easy, we just need to `malloc` the necessary data and use `strcpy`

```C
// Copies pointer
input[i].word = buf;

// Copies character data
input[i].word = malloc( n );
strcpy( input[i].word, buf );
```

This would give us the following structure. Even with one iteration, we can see
that we'll avoid all the pointers pointing to the same place.

![With strcpy](imgs/stringerrF.png)
