# Drexel CCI : CARDIAC Arrest Workshop Notes

---

## Links

-   [CARDIAC Simulator](https://www.cs.drexel.edu/~bls96/museum/cardsim.html)
-   [CARDIAC Manual](https://www.cs.drexel.edu/~bls96/museum/CARDIAC_manual.pdf)
-   [More Information on the CARDIAC](https://www.cs.drexel.edu/~bls96/museum/cardiac.html)
-   [Example Code](https://www.cs.drexel.edu/~bls96/cardiacex.html)
-   [Example Code Explanation](https://www.cs.drexel.edu/~bls96/cardiacans.html)

---

## Vocabulary


**Accumulator :** A register that can be operated on

**Assembler :** Translates assembly code into machine code that the
computer can understand

**Assembly Code :** A type of "psuedocode" that is used by humans to
better comprehend machine code

**ALU :** Arithmetic Logic Unit, performs calculations

**Decoder :** Decodes the instructions from the Instruction Register
into something the ALU can understand and operate with

**Disassembler :** Translates machine code into assembly language

**Instruction Register :** A register that hold the current instruction
while the decoder interprets it

**Machine Code :** The code that computers understand and interpret

**Program Counter :** Keeps track of where in the program we are at and
what instruction is executed.

**Register :** A dedicated location for information to be stored.

---

## The Program

Next here is the CARDIAC program that we run in the simulator:

```
04   000    N     DATA    0
05   000    D     DATA    0
06   000    Q     DATA    0

10   100          CLA     00
11   700          SUB     00
12   606          STO     Q
13   004          INP     N
14   005          INP     D
15   104    LOOP  CLA     N
16   705          SUB     D
17   323          TAC     DONE
18   604          STO     N
19   106          CLA     Q
20   200          ADD     00
21   606          STO     Q
22   815          JMP     LOOP
23   506    DONE  OUT     Q
24   504          OUT     N
25   900          HRS
```

---

## Running the Program

Steps to run the program in the simulator:

For each line of the program:

1. Enter the number in the second column into the memory box labeled by
	the number in the first column
2. Enter two numbers into the Deck box on separate lines
3. Click the Load button to put the Deck into the Reader
4. Enter the number 10 in the PC box
5. Click the Slow button and watch the program run

---

## Can You Guess What the Program Does?

Try these pairs of numbers to see what it does. What is the output for
each set of numbers? How does the output relate to the input?

-   12 3
-   3 2
-   3 5
-   11 4

---

## Questions?

If you have any questions about this example or anything we covered
today, you can reach me at bls96@drexel.edu or the Head Teaching
Assistant, Charlie at src322@drexel.edu.

---

## Photos

![](cardiac/cardbk.jpg) ![](cardiac/cardiac2-s.jpg)
