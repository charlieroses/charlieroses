While there are many different character sets, the one we're gonna focus
on is ASCII. ASCII stands for the **A**merican **S**tandard **C**ode for
**I**nformation **I**nterchange. It's a character set which means it was
created for computers to display information. As we know, computers can
only store 0s and 1s. However, what if we want to display the text
"Hello"? We cannot store the letters themselves in the computers code.
ASCII is a 7 bit binary code for each letter. Typically the 7 bits are
separated into a set of 3 and 4 with a space. This is only for
readability purposes. These 7 bits allows strings of text to be stored
within the computer to be displayed later. ASCII has 128 characters in
the table. I have been very generous and listed them all below.

<center>

+----------+---------+------------+---+---------+---------+-----------+---+----------+---------+-----------+---+----------+---------+-----------+
| Binary   | Decimal | Character  |   | Binary  | Decimal | Character |   | Binary   | Decimal | Character |   | Binary   | Decimal | Character |
+----------+---------+------------+---+---------+---------+-----------+---+----------+---------+-----------+---+----------+---------+-----------+
| 000 0000 | 0       | NUL (null) |   | 010 000 | 32      | Space     |   | 100 0000 | 64      | @         |   | 110 0000 | 96      | \`        |
+----------+---------+------------+---+---------+---------+-----------+---+----------+---------+-----------+---+----------+---------+-----------+


<table>
<tr>
<th class="ascii"><b>Binary</b></th>
<th class="ascii"><b>Decimal</b></th>
<th class="ascii"><b>Character</b></th>
<th class="asciiMidT"></th>
<th class="ascii"><b>Binary</b></th>
<th class="ascii"><b>Decimal</b></th>
<th class="ascii"><b>Character</b></th>
<th class="asciiMidT"></th>
<th class="ascii"><b>Binary</b></th>
<th class="ascii"><b>Decimal</b></th>
<th class="ascii"><b>Character</b></th>
<th class="asciiMidT"></th>
<th class="ascii"><b>Binary</b></th>
<th class="ascii"><b>Decimal</b></th>
<th class="ascii"><b>Character</b></th>
</tr>
<tr>
<td class="ascii">000 0000</td>
<td class="ascii">0</td>
<td class="ascii">NUL (null)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0000</td>
<td class="ascii">32</td>
<td class="ascii">Space</td>
<td class="asciiMid"></td>
<td class="ascii">100 0000</td>
<td class="ascii">64</td>
<td class="ascii">@</td>
<td class="asciiMid"></td>
<td class="ascii">110 0000</td>
<td class="ascii">96</td>
<td class="ascii">\`</td>
</tr>
<tr>
<td class="ascii">000 0001</td>
<td class="ascii">1</td>
<td class="ascii">SOH (start of heading)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0001</td>
<td class="ascii">33</td>
<td class="ascii">!</td>
<td class="asciiMid"></td>
<td class="ascii">100 0001</td>
<td class="ascii">65</td>
<td class="ascii">A</td>
<td class="asciiMid"></td>
<td class="ascii">110 0001</td>
<td class="ascii">97</td>
<td class="ascii">a</td>
</tr>
<tr>
<td class="ascii">000 0010</td>
<td class="ascii">2</td>
<td class="ascii">STX (start of text)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0010</td>
<td class="ascii">34</td>
<td class="ascii">"</td>
<td class="asciiMid"></td>
<td class="ascii">100 0010</td>
<td class="ascii">66</td>
<td class="ascii">B</td>
<td class="asciiMid"></td>
<td class="ascii">110 0010</td>
<td class="ascii">98</td>
<td class="ascii">b</td>
</tr>
<tr>
<td class="ascii">000 0011</td>
<td class="ascii">3</td>
<td class="ascii">ETX (end of text)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0011</td>
<td class="ascii">35</td>
<td class="ascii">#</td>
<td class="asciiMid"></td>
<td class="ascii">100 0011</td>
<td class="ascii">67</td>
<td class="ascii">C</td>
<td class="asciiMid"></td>
<td class="ascii">1100001</td>
<td class="ascii">99</td>
<td class="ascii">c</td>
</tr>
<tr>
<td class="ascii">000 0100</td>
<td class="ascii">4</td>
<td class="ascii">EOT (end of transmission)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0100</td>
<td class="ascii">36</td>
<td class="ascii">$</td>
<td class="asciiMid"></td>
<td class="ascii">100 0100</td>
<td class="ascii">68</td>
<td class="ascii">D</td>
<td class="asciiMid"></td>
<td class="ascii">110 0100</td>
<td class="ascii">100</td>
<td class="ascii">d</td>
</tr>
<tr>
<td class="ascii">000 0101</td>
<td class="ascii">5</td>
<td class="ascii">ENQ (enquiry)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0101</td>
<td class="ascii">37</td>
<td class="ascii">%</td>
<td class="asciiMid"></td>
<td class="ascii">100 0101</td>
<td class="ascii">69</td>
<td class="ascii">E</td>
<td class="asciiMid"></td>
<td class="ascii">110 0101</td>
<td class="ascii">101</td>
<td class="ascii">e</td>
</tr>
<tr>
<td class="ascii">000 0110</td>
<td class="ascii">6</td>
<td class="ascii">ACK (acknowledge)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0110</td>
<td class="ascii">38</td>
<td class="ascii">&</td>
<td class="asciiMid"></td>
<td class="ascii">100 0110</td>
<td class="ascii">70</td>
<td class="ascii">F</td>
<td class="asciiMid"></td>
<td class="ascii">110 0110</td>
<td class="ascii">102</td>
<td class="ascii">f</td>
</tr>
<tr>
<td class="ascii">000 0111</td>
<td class="ascii">7</td>
<td class="ascii">BEL (bell)</td>
<td class="asciiMid"></td>
<td class="ascii">010 0111</td>
<td class="ascii">39</td>
<td class="ascii">'</td>
<td class="asciiMid"></td>
<td class="ascii">100 0111</td>
<td class="ascii">71</td>
<td class="ascii">G</td>
<td class="asciiMid"></td>
<td class="ascii">110 0111</td>
<td class="ascii">103</td>
<td class="ascii">g</td>
</tr>
<tr>
<td class="ascii">000 1000</td>
<td class="ascii">8</td>
<td class="ascii">BS (backspace)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1000</td>
<td class="ascii">40</td>
<td class="ascii">(</td>
<td class="asciiMid"></td>
<td class="ascii">100 1000</td>
<td class="ascii">72</td>
<td class="ascii">H</td>
<td class="asciiMid"></td>
<td class="ascii">110 1000</td>
<td class="ascii">104</td>
<td class="ascii">h</td>
</tr>
<tr>
<td class="ascii">000 1001</td>
<td class="ascii">9</td>
<td class="ascii">TAB (horizontal tab)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1001</td>
<td class="ascii">41</td>
<td class="ascii">)</td>
<td class="asciiMid"></td>
<td class="ascii">100 1001</td>
<td class="ascii">73</td>
<td class="ascii">I</td>
<td class="asciiMid"></td>
<td class="ascii">110 1001</td>
<td class="ascii">105</td>
<td class="ascii">i</td>
</tr>
<tr>
<td class="ascii">000 1010</td>
<td class="ascii">10</td>
<td class="ascii">LF (new line)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1010</td>
<td class="ascii">42</td>
<td class="ascii">\*</td>
<td class="asciiMid"></td>
<td class="ascii">100 1010</td>
<td class="ascii">74</td>
<td class="ascii">J</td>
<td class="asciiMid"></td>
<td class="ascii">110 1010</td>
<td class="ascii">106</td>
<td class="ascii">j</td>
</tr>
<tr>
<td class="ascii">000 1011</td>
<td class="ascii">11</td>
<td class="ascii">VT (vertical tab)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1011</td>
<td class="ascii">43</td>
<td class="ascii">+</td>
<td class="asciiMid"></td>
<td class="ascii">100 1011</td>
<td class="ascii">75</td>
<td class="ascii">K</td>
<td class="asciiMid"></td>
<td class="ascii">110 1011</td>
<td class="ascii">107</td>
<td class="ascii">k</td>
</tr>
<tr>
<td class="ascii">000 1100</td>
<td class="ascii">12</td>
<td class="ascii">FF (new page)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1100</td>
<td class="ascii">44</td>
<td class="ascii">,</td>
<td class="asciiMid"></td>
<td class="ascii">100 1100</td>
<td class="ascii">76</td>
<td class="ascii">L</td>
<td class="asciiMid"></td>
<td class="ascii">110 1100</td>
<td class="ascii">108</td>
<td class="ascii">l</td>
</tr>
<tr>
<td class="ascii">000 1101</td>
<td class="ascii">13</td>
<td class="ascii">CR (carriage return)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1101</td>
<td class="ascii">45</td>
<td class="ascii">-</td>
<td class="asciiMid"></td>
<td class="ascii">100 1101</td>
<td class="ascii">77</td>
<td class="ascii">M</td>
<td class="asciiMid"></td>
<td class="ascii">110 1101</td>
<td class="ascii">109</td>
<td class="ascii">m</td>
</tr>
<tr>
<td class="ascii">000 1110</td>
<td class="ascii">14</td>
<td class="ascii">SO (shift out)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1110</td>
<td class="ascii">46</td>
<td class="ascii">.</td>
<td class="asciiMid"></td>
<td class="ascii">100 1110</td>
<td class="ascii">78</td>
<td class="ascii">N</td>
<td class="asciiMid"></td>
<td class="ascii">110 1110</td>
<td class="ascii">110</td>
<td class="ascii">n</td>
</tr>
<tr>
<td class="ascii">000 1111</td>
<td class="ascii">15</td>
<td class="ascii">SI (shift in)</td>
<td class="asciiMid"></td>
<td class="ascii">010 1111</td>
<td class="ascii">47</td>
<td class="ascii">/</td>
<td class="asciiMid"></td>
<td class="ascii">100 1111</td>
<td class="ascii">79</td>
<td class="ascii">O</td>
<td class="asciiMid"></td>
<td class="ascii">110 1111</td>
<td class="ascii">111</td>
<td class="ascii">0</td>
</tr>
<tr>
<td class="ascii">001 0000</td>
<td class="ascii">16</td>
<td class="ascii">DLE (data link escape)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0000</td>
<td class="ascii">48</td>
<td class="ascii">0</td>
<td class="asciiMid"></td>
<td class="ascii">101 0000</td>
<td class="ascii">80</td>
<td class="ascii">P</td>
<td class="asciiMid"></td>
<td class="ascii">111 0000</td>
<td class="ascii">112</td>
<td class="ascii">p</td>
</tr>
<tr>
<td class="ascii">001 0001</td>
<td class="ascii">17</td>
<td class="ascii">DC1 (device control 1)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0001</td>
<td class="ascii">49</td>
<td class="ascii">1</td>
<td class="asciiMid"></td>
<td class="ascii">101 0001</td>
<td class="ascii">81</td>
<td class="ascii">Q</td>
<td class="asciiMid"></td>
<td class="ascii">111 0001</td>
<td class="ascii">113</td>
<td class="ascii">q</td>
</tr>
<tr>
<td class="ascii">001 0010</td>
<td class="ascii">18</td>
<td class="ascii">DC2 (device control 2)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0010</td>
<td class="ascii">50</td>
<td class="ascii">2</td>
<td class="asciiMid"></td>
<td class="ascii">101 0010</td>
<td class="ascii">82</td>
<td class="ascii">R</td>
<td class="asciiMid"></td>
<td class="ascii">111 0010</td>
<td class="ascii">114</td>
<td class="ascii">r</td>
</tr>
<tr>
<td class="ascii">001 0011</td>
<td class="ascii">19</td>
<td class="ascii">DC3 (device control 3)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0011</td>
<td class="ascii">51</td>
<td class="ascii">3</td>
<td class="asciiMid"></td>
<td class="ascii">101 0011</td>
<td class="ascii">83</td>
<td class="ascii">S</td>
<td class="asciiMid"></td>
<td class="ascii">111 0011</td>
<td class="ascii">115</td>
<td class="ascii">s</td>
</tr>
<tr>
<td class="ascii">001 0100</td>
<td class="ascii">20</td>
<td class="ascii">DC4 (device control 4)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0100</td>
<td class="ascii">52</td>
<td class="ascii">4</td>
<td class="asciiMid"></td>
<td class="ascii">101 0100</td>
<td class="ascii">84</td>
<td class="ascii">T</td>
<td class="asciiMid"></td>
<td class="ascii">111 0100</td>
<td class="ascii">116</td>
<td class="ascii">t</td>
</tr>
<tr>
<td class="ascii">001 0101</td>
<td class="ascii">21</td>
<td class="ascii">NAK (negative acknowledge)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0101</td>
<td class="ascii">53</td>
<td class="ascii">5</td>
<td class="asciiMid"></td>
<td class="ascii">101 0101</td>
<td class="ascii">85</td>
<td class="ascii">U</td>
<td class="asciiMid"></td>
<td class="ascii">111 0101</td>
<td class="ascii">117</td>
<td class="ascii">u</td>
</tr>
<tr>
<td class="ascii">001 0110</td>
<td class="ascii">22</td>
<td class="ascii">SYN (synchronous idle)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0110</td>
<td class="ascii">54</td>
<td class="ascii">6</td>
<td class="asciiMid"></td>
<td class="ascii">101 0110</td>
<td class="ascii">86</td>
<td class="ascii">V</td>
<td class="asciiMid"></td>
<td class="ascii">111 0110</td>
<td class="ascii">118</td>
<td class="ascii">v</td>
</tr>
<tr>
<td class="ascii">001 0111</td>
<td class="ascii">23</td>
<td class="ascii">ETB (end of trans. block)</td>
<td class="asciiMid"></td>
<td class="ascii">011 0111</td>
<td class="ascii">55</td>
<td class="ascii">7</td>
<td class="asciiMid"></td>
<td class="ascii">101 0111</td>
<td class="ascii">87</td>
<td class="ascii">W</td>
<td class="asciiMid"></td>
<td class="ascii">111 0111</td>
<td class="ascii">119</td>
<td class="ascii">w</td>
</tr>
<tr>
<td class="ascii">001 1000</td>
<td class="ascii">24</td>
<td class="ascii">CAN (cancel)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1000</td>
<td class="ascii">56</td>
<td class="ascii">8</td>
<td class="asciiMid"></td>
<td class="ascii">101 1000</td>
<td class="ascii">88</td>
<td class="ascii">X</td>
<td class="asciiMid"></td>
<td class="ascii">111 1000</td>
<td class="ascii">120</td>
<td class="ascii">x</td>
</tr>
<tr>
<td class="ascii">001 1001</td>
<td class="ascii">25</td>
<td class="ascii">EM (end of medium)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1001</td>
<td class="ascii">57</td>
<td class="ascii">9</td>
<td class="asciiMid"></td>
<td class="ascii">101 1001</td>
<td class="ascii">89</td>
<td class="ascii">Y</td>
<td class="asciiMid"></td>
<td class="ascii">111 1001</td>
<td class="ascii">121</td>
<td class="ascii">y</td>
</tr>
<tr>
<td class="ascii">001 1010</td>
<td class="ascii">26</td>
<td class="ascii">SUB (substitute)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1010</td>
<td class="ascii">58</td>
<td class="ascii">:</td>
<td class="asciiMid"></td>
<td class="ascii">101 1010</td>
<td class="ascii">90</td>
<td class="ascii">Z</td>
<td class="asciiMid"></td>
<td class="ascii">111 1010</td>
<td class="ascii">122</td>
<td class="ascii">z</td>
</tr>
<tr>
<td class="ascii">001 1011</td>
<td class="ascii">27</td>
<td class="ascii">ESC (escape)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1011</td>
<td class="ascii">59</td>
<td class="ascii">;</td>
<td class="asciiMid"></td>
<td class="ascii">101 1011</td>
<td class="ascii">91</td>
<td class="ascii">[</td>
<td class="asciiMid"></td>
<td class="ascii">111 1011</td>
<td class="ascii">123</td>
<td class="ascii">{</td>
</tr>
<tr>
<td class="ascii">001 1100</td>
<td class="ascii">28</td>
<td class="ascii">FS (file separator)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1100</td>
<td class="ascii">60</td>
<td class="ascii"><</td>
<td class="asciiMid"></td>
<td class="ascii">101 1100</td>
<td class="ascii">92</td>
<td class="ascii">\\</td>
<td class="asciiMid"></td>
<td class="ascii">111 1100</td>
<td class="ascii">124</td>
<td class="ascii">|</td>
</tr>
<tr>
<td class="ascii">001 1101</td>
<td class="ascii">29</td>
<td class="ascii">GS (group separator)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1101</td>
<td class="ascii">61</td>
<td class="ascii">=</td>
<td class="asciiMid"></td>
<td class="ascii">101 1101</td>
<td class="ascii">93</td>
<td class="ascii">]</td>
<td class="asciiMid"></td>
<td class="ascii">111 1101</td>
<td class="ascii">125</td>
<td class="ascii">}</td>
</tr>
<tr>
<td class="ascii">001 1110</td>
<td class="ascii">30</td>
<td class="ascii">RS (record separator)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1110</td>
<td class="ascii">62</td>
<td class="ascii">\></td>
<td class="asciiMid"></td>
<td class="ascii">101 1110</td>
<td class="ascii">94</td>
<td class="ascii">^</td>
<td class="asciiMid"></td>
<td class="ascii">111 1110</td>
<td class="ascii">126</td>
<td class="ascii">~</td>
</tr>
<tr>
<td class="ascii">001 1111</td>
<td class="ascii">31</td>
<td class="ascii">US (unit separator)</td>
<td class="asciiMid"></td>
<td class="ascii">011 1111</td>
<td class="ascii">63</td>
<td class="ascii">?</td>
<td class="asciiMid"></td>
<td class="ascii">101 1111</td>
<td class="ascii">95</td>
<td class="ascii">\_</td>
<td class="asciiMid"></td>
<td class="ascii">111 1111</td>
<td class="ascii">127</td>
<td class="ascii">DEL</td>
</tr>
</table>
</center>


---

## Displaying Information

So now that we know how to represent each character, let's use this in
practice. Let's say we want to display the string, "I'm Charlie". I
chose this phrase because it has lowercase letters, capital letters,
punctuation, spaces, and I am, in fact, Charlie.

<code>
	<tab5><b>Choose Phrase:</b> I'm Charlie</tab5>
	<br>
	<br>
	<tab5><b>Relate Letters to Binary:</b> I = 1001001 ' = 0100111 m = 1101101 etc.</tab5>
	<br>
	<br>
	<tab5><b>Put it Together:</b> 1001001 0100111 1101101 0100000 1000011 1101000 1100001 1110010 1101100 1101001 1100101</tab5>
	<br>
	<br>
	<tab5><b>Remove Spaces:</b> 10010010100111110110101000001000011110100011000011110010110110011010011100101</tab5>
	<br>
</code>

As you can see the process is very simple. Translate the characters into
numbers using the chart, then concatenate. While using binary is most
common, you can also use the base-10 numbers. I chose binary because
that's what computers read. You should try this on your own with your
own phrases.

