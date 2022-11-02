So now that we know the layout of the CARDIAC, let's do some
programming. Many verbose coding languages use words like println, or
print, or Console.Write to denote something to be outputted to the
screen. The CARDIAC does not use any words. It uses numbers. A "Command"
consists of two parts, the opcode, and the operand. The opcode is a
single number that denotes what happens. The operand is a two digit
number that denotes the memory position the opcode is referring to. This
forms a 3 digit number. A very important thing to recognize about this 3
digit number, is that it is just a number. Yes, it can perform commands
with it. We can also use this number in math. I'll cover this more
later. Let's focus on commands right now.

<center>
<table>
<tr>
<th id="b2t"><b>Opcode</b></th>
<th id="b2t" colspan="2"><b>Operand</b></th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">0</td>
<td id="b2t">0</td>
</tr>
</table>
</center>


So this is a base-10 number. That means each digit can hold numbers 0-9.
This means there are 10 different commands to use and 100 different
memory points to reference. Like we said above in the Memory section the
CARDIAC has 100 memory points. Above we had to formula 2^n^-1. This
tells us how many memory points we have and through which numbers
they're labelled. Since we're using base-10 we sub 10 in for 2. Since
there are 2 digits, n=2. Then calculate 10^2^-1 = 99. This means we have
memory points 00-99. This makes sense since we have two base-10 digits
which have numbers ranging 0-9. Below are the opcodes for the CARDIAC
and which operation each corresponds to. You don't have to memorize it,
however, after doing many programs you might.

<center>
<table>
<tr>
<th id="b2t"><b>Opcode</b></th>
<th id="b2t"><b>Abbreviation</b></th>
<th id="b2t" style="width:400px"><b>Operation</b></th>
</tr>
<tr>
<td id="b2t">0</td>
<td id="b2t">INP</td>
<td id="b2t">Read a card into memory</td>
</tr>
<tr>
<td id="b2t">1</td>
<td id="b2t">CLA</td>
<td id="b2t">Clear accumulator and add from memory</td>
</tr>
<tr>
<td id="b2t">2</td>
<td id="b2t">ADD</td>
<td id="b2t">Add from memory into accumulator</td>
</tr>
<tr>
<td id="b2t">3</td>
<td id="b2t">TAC</td>
<td id="b2t">Test accumulator. Jump to memory if negative</td>
</tr>
<tr>
<td id="b2t">4</td>
<td id="b2t">SFT</td>
<td id="b2t">Shift accumulator</td>
</tr>
<tr>
<td id="b2t">5</td>
<td id="b2t">OUT</td>
<td id="b2t">Write memory to output</td>
</tr>
<tr>
<td id="b2t">6</td>
<td id="b2t">STO</td>
<td id="b2t">Store accumulator into memory</td>
</tr>
<tr>
<td id="b2t">7</td>
<td id="b2t">SUB</td>
<td id="b2t">Subtract memory from accumulator</td>
</tr>
<tr>
<td id="b2t">8</td>
<td id="b2t">JMP</td>
<td id="b2t">Jump to memory position</td>
</tr>
<tr>
<td id="b2t">9</td>
<td id="b2t">HRS</td>
<td id="b2t">Halt and Reset: Ends the Program</td>
</tr>
</table>
</center>


Notice how when I described each operation, I mentioned how the memory
relates to the operation. The first digit corresponds to the opcode. The
second two being to the memory point it references. Let's say we have
the number **103** and in memory point 03 we have the number 002. The
opcode **1** means we have to clear the accumulator. Then we add
whatever is in memory point **03**. This means 002 is now what is in the
accumulator. If we use the command **800**, it means we jump (**8**) to
memory point **00**.

If you notice, there are two commands that do not relate to the memory,
SFT (4) and HRS (9). Since HRS halts and resets the program, you do not
need to reference a memory point. SFT on the other hand is a little more
difficult. The first digit in SFT is 4. Right now we have 4--. The
second digit shifts the digits in the accumulator over to the left n
amount of places. If 1234 was stored in the accumulator, and we called
42-, it would shift the places to now 3400. We have now lost the values
1 and 2. We cannot retrieve them. They are lost. The third digit in the
SFT operation shifts the accumulator to the right n amount of digits. So
if we have 422, 1234 first becomes 3400. The accumulator shifts the
other way and becomes 0034. Like I said before, when the accumulator
shifts, you lose the digits.


