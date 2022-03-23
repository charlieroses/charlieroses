# Crash Course on Makefiles

This is a basic crash course on making basic makefiles and reading them and
understanding them and writing them. This is not a comprehensive "everything to
know about `make`" tutorial. It's meant for beginners who are required to submit
a makefile with their assignment but have no idea what that means.

I really like Kurt's [slides on make](https://www.cs.drexel.edu/~kschmidt/CS265/Lectures/Make/make.pdf)

- [Anatomy of a Target](#anatomy-of-a-target)
	- [PHONY Targets](#phony-targets)
	- [Variables](#variables)
- [Running a Makefile](#running-a-makefile)
- [More Complicated Makefiles](#more-complicated-makefiles)

---

## Anatomy of a Target

We use makefiles to make files. It's a very appropriately named utility.

A makefile is primarily comprised of **targets** that named after the file they
create. A target has the following structure:

```make
target: dependencies
	command
	command
	command
```

As said before the **target** is the name of the file being created. A target
that isn't the name of a file is typically labelled as `.PHONY`.

The **dependencies** are a list of files that are required to exist for the
target to run. If the files don't exist, the makefile stops execution.

The **commands** are the commands that will run assuming the dependencies exist.
If a command errors, then the entire makefile stops execution. You can prepend
a command with a `-` to have `make` ignore errors. Commands _need_ to be
prepended by _tabs, not spaces_. I like to turn on
[whitespace in vim](vimtricks.html#whitespace) for this reason.

Here's a basic target to compile C. This alone is a valid makefile.

```make
main: main.c
	gcc main.c -o main
```

### PHONY Targets

It's pretty common to see a target named `clean` in a makefile. This target
doesn't create a file named "clean", its used to remove all the files the
makefile created. We can label it as `.PHONY` as a reminder that it's not going
to make a file named clean. Expanding on the above makefile:


```make
.PHONY = clean

main: main.c
	gcc main.c -o main

foo.txt:
	touch foo.txt

clean:
	-rm foo.txt
	-rm main
```

I added a bit more for explanations sake. I added a target to create an empty
file `foo.txt`. Then the clean target removes both the `foo.txt` file and the
`main` executable. It doesn't matter if `foo.txt` exists or not before the
target is called. Since there's a `-`, even if `foo.txt` doesn't exist, the
makefile will continue.


### Variables

You can also use variables in make. So further expanding that above makefile:

```make
.PHONY = clean
TARGET = main

$(TARGET): $(TARGET).c
	gcc $(TARGET).c -o $(TARGET)

foo.txt:
	touch foo.txt

clean:
	-rm foo.txt
	-rm $(TARGET)
```

---

## Running a Makefile

When running makefiles, you've got a few options.

To run the first target in the file (in our case, our `main` compilation) just
use:

```
$ make
```

To run a specific target, no matter where it is in the file, you can run:

```
$ make foo.txt
```

Let's say we're working on a basic C file that isn't named `main.c` but we want
to use our makefile on it. We can edit the `TARGET` variable too with:

```
$ make TARGET=foo
```

It's important to note that a target will only run if:

1. The file doesn't already exist
2. The file does exist, but is "older" than its dependencies (they were editted
	more recently than it was created)

---

## More Complicated Makefiles

The reason makefiles are so wonderful is because we can recursively build
dependencies if they don't exist.

Let's say I'm working on a C project and I have the following set up:

- `foo.c` : Some function definitions
- `foo.h` : The function prototypes for `foo.c`
- `main.c` : The main source code that uses the functions in `foo.c` and
	`#include"foo.h"`

`main.c` depends on two things (that isn't itself). It needs the header file to
exist, it also needs `foo.c` to be compiled into `foo.o` to use it's functions.
I can write the following makefile:

```make
.PHONY = clean

main : main.c foo.h foo.o
	gcc -o main main.c foo.o

foo.o : foo.c
	gcc -c foo.c

clean:
	-rm main
	-rm *.o
```

You may think, "oh to compile `main`, I first run `make foo.o` then I can run
`make` since `main` depends on `foo.o`". Technically that's correct, but life
can be easier!


By typing `make` alone, we run `make main`. It will only run if it's
dependencies exist. Assuming we're starting with a clean slate, `main.c` and
`foo.h` will exist, but `foo.o` will not. Before stopping excution, the makefile
will check to see if a target exists under that name. If it doesn't exist, the
makefile fails. If it does exist, it will be recursively run.

So in this case, when running `make`, the following happens

- `main` is the first target
	- Does the file `main.c` exist? :check: Continue
	- Does the file `foo.h` exist? :check: Continue
	- Does the file `foo.o` exist? :cross: Check for target
		- Does `foo.o` have a target? :check: Run target
		- Does the file `foo.c` exist? :check: Continue
		- Run `gcc` command to compile `foo.c`
		- `foo.o` now exists :check:
	- Run the `gcc` command to compile `main.c`
- Makefile successful!

This is just a quick overview, there's plenty more to know. about using `make`
efficiently. This should be enough to get you functional.

