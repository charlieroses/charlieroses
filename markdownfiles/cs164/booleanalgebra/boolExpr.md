Now that we know our basic operators, we can form much larger
expressions. We use larger expressions to do more math and create
processors like the ones in your computer. But how do we evaluate these
expressions? We break each expression into smaller expressions and use a
truth table.

<center>
<code>(P v Q)' ^ (R ^ (P' v Q))</code>
<br>
<br>
<table>
<tr>			
<th><b>P</b></th>
<th><b>Q</b></th>
<th><b>R</b></th>
<th><b>P v Q</b></th>
<th><b>(P v Q)'</b></th>
<th><b>P'</b></th>
<th><b>P' v Q</b></th>
<th><b>R ^ (P' v Q)</b></th>
<th><b>(P v Q)' ^ (R ^ (P' v Q))</b></th>
</tr>
<tr>			
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>			
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td style="background-color: rgb(140,140,140)">1</td>
</tr>
<tr>			
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>			
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>			
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>			
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>			
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td style="background-color: rgb(140,140,140)">0</td>
</tr>
<tr>			
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td style="background-color: rgb(140,140,140)">0</td>
</tr>
</table>
</center>

---

## De Morgan's Law

Augustus De Morgan was a British mathematician and logician. De Morgan's
laws are named for him. It is through De Morgan's laws that it is
possible for NOR and NAND to be universal gates. The laws are the
following.

<center>
<code>
(P &or; Q)' == P' &and; Q'
<br>
<br>
(P &and; Q)' == P' &or; Q'
</code>
</center>

De Morgans law is the act of distributing a negation. The negation is
distributed to each of the inner terms, then the operation is flipped.
The AND is turned into an OR, the OR is turned into an AND. This is why
NAND and NOR are universal gates.

Above we see a NAND turned into a NOT val OR NOT val expression. A NOR
is turned into a NOT val AND NOT val expression. Since we can create a
negation by putting the same value into a NOR or NAND gate twice, we can
do (x NAND x) NAND (y NAND y) (x' ∧ y')' to get (x ∨ y). The same
applies to NOR. We can do (x NOR x) NOR (y NOR y) (x' ∨ y')' to get (x ∧
y).


