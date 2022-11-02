The Universal Coded Character Set, or Unicode for short, is an extension
of ASCII. The first 128 codepoints are the same as ASCII. The next
1,113,984 codepoints are literally anything else. What do I mean by
"literally anything else"? What are these over 1 million codepoints?

---

## The "Literally Anything Else"

I feel rude calling this section "literally anything else". It makes it
seem pointless, even though there are many important codepoints in
Unicode. This includes accents on letters and special characters for
non-Latin alphabets. From a communication standpoint, this is very
important. Unicode added mathematic symbols and greek letters. Now we
can better express mathematic expresssions. It's important to recognize
that computers could compute these expressions. Now, we can type these
formulas. I use Unicode in future sections with boolean algebra. Below,
I included tables with a few characters that are important.

<center>
<div class="horizDiv">
<div>
<table>
<tr>
<th colspan="3"><b>Mathematic Characters</b></th>
</tr>
<tr>
<th>Name</th>
<th>UTF-16 Code</th>
<th>Character</th>
</tr>
<tr>
<td>Plus Sign</td>
<td>0x002B</td>
<td>&#43;</td>
</tr>
<tr>
<td>Multiplication</td>
<td>0x00D7</td>
<td>&#215;</td>
</tr>
<tr>
<td>Division</td>
<td>0x00F7</td>
<td>&#247;</td>
</tr>
<tr>
<td>Equals Sign</td>
<td>0x003D</td>
<td>&#61;</td>
</tr>
</table>
</div>
<!-- ############ NEW TABLE ############# -->
<div>
<table>
<tr>
<th colspan="3"><b>Accented Characters</b></th>
</tr> 
<tr>
<th>Name</th>
<th>UTF-16 Code</th>
<th>Character</th>
</tr>
<tr>
<td>a acute</td>
<td>0x00E0</td>
<td>&aacute;</td>
</tr>
<tr>
<td>E grave</td>
<td>0x00C8</td>
<td>&Egrave;</td>
</tr>
<tr>
<td>c cedilla</td>
<td>0x00E7</td>
<td>&ccedil;</td>
</tr>
<tr>
<td>n tilde</td>
<td>0x00F1</td>
<td>&ntilde;</td>
</tr>
</table>
</div>
<!-- ############ NEW TABLE ############# -->
<div>
<table>
<tr>
<th colspan="3"><b>Boolean Characters</b></th>
</tr>
<tr>
<th>Name</th>
<th>UTF-16 Code</th>
<th>Character</th>
</tr>
<tr>
<td>Not</td>
<td>0x00AC</td>
<td>&#172;</td>
</tr>
<tr>
<td>And</td>
<td>0x2227</td>
<td>&#8743;</td>
</tr>
<tr>
<td>Or</td>
<td>0x2228</td>
<td>&#8744;</td>
</tr>
<tr>
<td>Xor</td>
<td>0x22BB</td>
<td>&#8891;</td>
</tr>
</table>
</div>
</div>
</center>

Clearly unicode contains many important characters. That doesn't mean
*ALL* unicode characters are important. With over a million codepoints,
there is a whole lot of unimportant and useless. Just because something
is useless, doesn't mean that it's not fun. Now, I'm not a trekkie
(sorry), but unicode includes the klingon alphabet, or as named by Marc
Okrand in *The Klingon Dictionary*, pIqaD. If you don't have the proper
fonts downloaded in your browser, the Klingon letters won't display
properly. Hopefully, since you're probably a computer science major,
you're a massive nerd. Hopefully, being a massive nerd, you're prepared
for this situation. Along with the highly important Klingon language,
unicode also contains chess pieces. Don't worry, there are white and
black chess pieces. Long story short, unicode is very inclusive.

<center>
<div class="horizDiv">
<div>
<table>
<tr>
<th colspan="3"><b>pIqaD</b></th>
</tr>
<tr>
<th>Name</th>
<th>UTF-16 Code</th>
<th>Character</th>
</tr>
<tr>
<td>A</td>
<td>0xF8D0</td>
<td>&#xf8d0;</td>
</tr>
<tr>
<td>B</td>
<td>0xF8D1</td>
<td>&#xf8d1;</td>
</tr>
<tr>
<td>CH</td>
<td>0xF8D2</td>
<td>&#xf8d2;</td>
</tr>
<tr>
<td>D</td>
<td>0xF8D3</td>
<td>&#xf8d3;</td>
</tr>
</table>
</div>
<!-- ############ NEW TABLE ############# -->
<div>
<table>
<tr>
<th colspan="3"><b>Chess</b></th>
</tr> 
<tr>
<th>Name</th>
<th>UTF-16 Code</th>
<th>Character</th>
</tr>
<tr>
<td>Black King</td>
<td>0x265A</td>
<td>&#9818;</td>
</tr>
<tr>
<td>White King</td>
<td>0x2654</td>
<td>&#9812;</td>
</tr>
<tr>
<td>Black Pawn</td>
<td>0x265F</td>
<td>&#9823;</td>
</tr>
<tr>
<td>White Pawn</td>
<td>0x2659</td>
<td>&#9817;</td>
</tr>
</table>
</div>
</div>
</center>

---

## UTF Encoding

So if you were paying attention to the table, you noticed that one of
the columns is "UTF-16 Code". If you were really paying attention, you
noticed I didn't explain what that was. Well now, I'm gonna explain that
to you! Aren't I a sweetheart. Anyway. Encodings. So unicode is composed
of a whole lotta codepoints. We need some way of numbering and ordering
them. UTF stands for Unicode Transformation Format. The following number
is the number of bits. UTF-8 would be 8 bits, UTF-16 would be 16 bits,
etc. etc. As the unicode library grows, you would need more bits to hold
each value.

---

## In HTML

If you are on a computer, I want you to look down at your keyboard.
Count how many characters you can type. I counted 26 capital letters, 26
lowercase letters, 10 numbers, and 32 symbols on my laptop. That's 94
symbols I can type out. Now, that sure is a problem if I wanna print out
the other 1,114,018 codepoints. One solution is a very large keyboard.
Now, that's not exactly practical.\
Now this entire textbook I've written is in HTML. How did I display the
character above in the table? HTML has unicode compatibility. The format
is: & \# NUMBER ; or & KEYWORD ; So Δ is & \# 9 1 6 ; or & Delta ; There
actually wouldn't be any spaces. I only did that to avoid HTML. Below is
a link to a whole bunch of HTML entities. I also made a little tool for
you to try them out on your own.

[FreeFormatter](https://www.freeformatter.com/html-entities.html)

### HTML Entity Tester

<center>
To Use:

Enter a #Number or Keyword for an HTML entity. Make sure to include the '#' for numbers.

<table>
<tr>
<td id="entityOut">&#916;</td>
</tr>
<tr>
<td style="width: 0px; height: 0px; background-color: rgba(0,0,0,0)">
<textarea id="entityIn"></textarea>
</td>
</tr>
<tr>
<td style="width: 0px; height: 0px; background-color: rgba(0,0,0,0)">
<button id="entityButton" onclick="makeEntity()">Display</button>
</td>
</tr>
</table>
</center>

---

## More Unicode

So since there are over 1 million unicode codepoints, I'm not going to
write them all out. However! Other people have already done that for me!
Here are a few websites that I used for reference.

[Compart : Unicode Library](https://www.compart.com/en/unicode/)

[Wikipedia : List of Unicode
Characters](https://en.wikipedia.org/wiki/List_of_Unicode_characters)


