What is state? Yes, it could perhaps be a place that you live in.
However, I am notoriously bad at geography, so today, it is not. This
may be the worst definition, but state defines the current state your
program is in. What defines the current state of your program? The state
is a snapshot in time. At any given moment in time, what are the
variables in scope and what are their values? Based on their values,
what will happen next? State gets a little more complex than this in
future classes. For the purpose of CS-164, this is as deep as you need
to know it.

---

## State Machines and Diagrams

One of the things that we work with in CS-164 is the concept of state
machines. This is something we use to very basically explain the way a
program functions, what the variables we have mean, and how they affect
the way the program will run.

### With One Variable

We create a state machine in typically the [seventh lab](https://www.cs.drexel.edu/~src322/cs164/labs/fsmlab.html).
The state machine in this lab relies on one
variable and a user input to determine how a program will run and react
to the user input. In this state machine, there are three button user
inputs. Based on which button is pressed in which state, you move to a
different state. While there are three states and three buttons, each
state is not directly tied to a specific button. I'm going to further
disect what this state machine is doing and how we describe that
behavior since the actual lab mainly deals with the coding part.

In this state machine, we have one variable named `state` to define what
state we are currently in. This variable has an integer range from 0-2
inclusively. This means there are three states that our program can be
in. These three states have no analogy as to what's going on. There is
no "good" state to be in and no "bad" state to be in. The code can have
side affects based on what state we are currently in. For example, the
light will turn red when we move from state 2 to state 0 via the O
button. However, this red can be achieved through a variety of different
pathways. Obviously, this description of behavior gets unwieldy quickly.
To describe the behavior, we can use two different types of state
diagrams.

<div class="container">
<div>
<center>
<b>Table Approach</b>
<br>
<table>
<tr>
<th></th>
<th>0</th>
<th>1</th>
<th>2</th>
</tr>
<tr>
<th>O</th>
<td>1/G</td>
<td>0/G</td>
<td>0/R</td>
</tr>
<tr>
<th>P</th>
<td>0/R</td>
<td>2/G</td>
<td>1/R</td>
</tr>
<tr>
<th>W</th>
<td>0/R</td>
<td>1/R</td>
<td>1/G</td>
</tr>
</table>

</center>
</div>

<div>
<center>
<b>Graphical Bubble Approach</b>
<br>
<img src="https://www.cs.drexel.edu/~src322/cs164/labs/fsm.png">
</center>
</div>
</div>


Both of the above images describe the state machine from lab 7. In the
table approach, we have the user inputs in one axis and the state in
another axis. In the bubble approach, we have each state as a bubble,
then the user input being an arrow from each to another. Which ever you
choose to use is up to you and how you best interpret images.

### With More Than One Variable

The final project for this class is a virtual pet project. It's a really
glorified state machine. You interact with your pet via buttons and the
pet responds accordingly with emotions and actions. Most people tend to
do rather simple state machines with a single `state` variable. This is
the most straight forward approach. However, we tend to have students
create pets with certain statistics like hunger and happy levels, then
have the emotion of the pet be a side effect of that. I want to take the
time to explain the complexity of a state machine with multiple
variables.

Let's think about a state machine where, instead of one `state`
variable, our state is defined by two parts, `valA` and `valB`. In our
purposes, both variables can have values 1-3 inclusively. This gives
each variable three values each. Now, there is no longer three states
that our program can be in, there's actually many more. There are now
nine states our state machine can be in. There is a state for each
combination of variables. Below, I've created a table to give a letter
to each combination of variables. This way we can create an easier to
understand state diagram.

<center>
<table>
<tr>
<th>State</th>
<th>A</th>
<th>B</th>
<th>C</th>
<th>D</th>
<th>E</th>
<th>F</th>
<th>G</th>
<th>H</th>
<th>I</th>
</tr>
<tr>
<th>valA</th>
<td>1</td>
<td>2</td>
<td>3</td>
<td>1</td>
<td>2</td>
<td>3</td>
<td>1</td>
<td>2</td>
<td>3</td>
</tr>
<tr>
<th>valB</th>
<td>1</td>
<td>1</td>
<td>1</td>
<td>2</td>
<td>2</td>
<td>2</td>
<td>3</td>
<td>3</td>
<td>3</td>
</tr>
</table>
</center>

Now that I've described the nine possible states my program can be in,
let's think about possible user input. Let's say there's 4 buttons,
labelled W, X, Y, and Z. Button W adds 1 to valA. Button X subtracts 1
from valA. Button Y adds 1 to valB. Button Z subtracts 1 from valB. For
our ease, let's assume that there are strict upper and lower bounds.
Adding to an upper bound will keep us there. Subtracting from a lower
bound will keep us there. Now that we have a description of the states
and the corresponding buttons, we can make a diagram that accurately
describes this.

<div class="container">
<table>
<tr>
<th></th>
<th>A</th>
<th>B</th>
<th>C</th>
<th>D</th>
<th>E</th>
<th>F</th>
<th>G</th>
<th>H</th>
<th>I</th>
</tr>
<tr>
<th>W</th>
<td>B</td>
<td>C</td>
<td>C</td>
<td>E</td>
<td>F</td>
<td>F</td>
<td>H</td>
<td>I</td>
<td>I</td>
</tr>
<tr>
<th>X</th>
<td>A</td>
<td>A</td>
<td>B</td>
<td>D</td>
<td>D</td>
<td>E</td>
<td>G</td>
<td>G</td>
<td>H</td>
</tr>
<tr>
<th>Y</th>
<td>D</td>
<td>E</td>
<td>F</td>
<td>G</td>
<td>H</td>
<td>I</td>
<td>G</td>
<td>H</td>
<td>I</td>
</tr>
<tr>
<th>Z</th>
<td>A</td>
<td>B</td>
<td>C</td>
<td>A</td>
<td>B</td>
<td>C</td>
<td>D</td>
<td>E</td>
<td>F</td>
</tr>	
</table>

![](languages/2varfsm.png)

</div>

Clearly, our state diagram has gotten very complex. Using our diagram,
we can see that in order to get from state A to state H, we need to
press the buttons, Y, then W, then Y in order. We really get to see the
behavior of our program now. From here, we can have further side effects
to our program. In states where valA is greater than valB (B, C, F)
perhaps a yellow light turns on. While multiple states can have the same
side effect, they are still separate states with separate values for
their variables. As you increase the number of variables and the number
of values for each variable, you exponentially increase the complexity
of the program. Just something to keep in mind.


