So there's a million programming languages out there, with a million
different concepts and a million different syntaxes. Obviously, I can't
go over all of them. I'm gonna go over a few different types of
programming approaches, and and more general things that are important
in all languages. For a more in depth tutorial on Tranquility, check out
the [tutorial](https://www.cs.drexel.edu/~src322/cs164/labs/tranqtut/tranq.html) from Lab 6.

---

## Program Flow

The most important thing to know in program flow, is the progression of
code. As with the CARDIAC, the computer follows the code line by line
until it is told not to. Typically by a loop or an if statement.

**If statements** tell the computer to run a section of code, if a
statment is true. This is seen with the CARDIAC command TAC. The basic
idea of an if statement is that only the if or the else runs. Both do
not run. The boolean expression cannot be both true and false. Just like
with TAC, the program will not jump and do the statement directly
following it.

```
if ( a boolean statment) {
sprint("Do these statments if the boolean expression is true")
}
else {
sprint("Do these statments if the boolean expression is false")
}
```

**Loops** are control statements that repeat code. We could rewrite the
same code multiple times in a row, but that gets tedious, especially
when we want to run code upwards of thousands of times. So we can write
a loop that runs code multiple times until a certain condition is met.
The syntax in Tranquiliy, the programming language we will use in this
class, is as following.

```
loop {
until ( a boolean statement)
sprint("Do these statements until the boolean statement is true")
}
```

**Functions** are blocks that we use to organize our code. We can use
these blocks repeatedly without copying and pasting code. Similar to
functions in math, we can put values in and get a new value out. The
values we put into a function are called the parameters. Just as in
functions in math, you can only get one value out of a function. The
output value is called the `return` value and requires a `return`
statement to be outputted. The `return` statement will end the function
and cease it's running whether there are statements after it or not. The
Tranquility syntax for functions is as follows.

```
fun functionName( optional list of parameters ) {
sprint("Perform these statements")
return value # This is also optional
}
```

Functions are special in that there are two parts. There is the block of
code that is the function itself, and then the call to that function.
Calling a function will execute the code within the function and, if
there's a return statement, will return the value in place of the
function. When calling the function, you will provide the values for the
parameters. Different languages have different syntax for calling
functions. In Tranquility, you use the following.

```
functionName( values for parameters )
```

Now, sometimes, we want to reference a function without actually calling
it. We do this a lot with buttons. We attach functions to buttons to
call later, when the button is pressed. The syntax for that in
Tranquility would be the following. As you can see, we call the function
but without the parentheses and parameters. This allows us to pass a
reference to a function without calling it.

```
button("This is a button", functionName )
```

There is a lot more to programming than these few topics. Overall, this
is more than enough for this class. All the assignments in this class
can be accomplished using the aforementioned topics.


