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
<table>
<colgroup>
<col span="1" class="red">
<col span="2">
<col span="1" class="gray">
<col span="2">
<col span="1" class="gray">
<col span="2">
<col span="1" class="gray">
</colgroup>
<thead>
<tr>
<th></th>
<th>Binary</th><th>Decimal</th><th>Character</th>
<th>Binary</th><th>Decimal</th><th>Character</th>
<th>Binary</th><th>Decimal</th><th>Character</th>
<th>Binary</th><th>Decimal</th><th>Character</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>000 0000</td><td>0</td><td>NUL (null)</td>
<td>010 0000</td><td>32</td><td>Space</td>
<td>100 0000</td><td>64</td><td>@</td>
<td>110 0000</td><td>96</td><td>\`</td>
</tr>
<tr>
<th></th>
<td>000 0001</td><td>1</td><td>SOH (start of heading)</td>
<td>010 0001</td><td>33</td><td>!</td>
<td>100 0001</td><td>65</td><td>A</td>
<td>110 0001</td><td>97</td><td>a</td>
</tr>
<tr>
<th></th>
<td>000 0010</td><td>2</td><td>STX (start of text)</td>
<td>010 0010</td><td>34</td><td>"</td>
<td>100 0010</td><td>66</td><td>B</td>
<td>110 0010</td><td>98</td><td>b</td>
</tr>
<tr>
<th></th>
<td>000 0011</td><td>3</td><td>ETX (end of text)</td>
<td>010 0011</td><td>35</td><td>#</td>
<td>100 0011</td><td>67</td><td>C</td>
<td>1100001</td><td>99</td><td>c</td>
</tr>
<tr>
<th></th>
<td>000 0100</td><td>4</td><td>EOT (end of transmission)</td>
<td>010 0100</td><td>36</td><td>$</td>
<td>100 0100</td><td>68</td><td>D</td>
<td>110 0100</td><td>100</td><td>d</td>
</tr>
<tr>
<th></th>
<td>000 0101</td><td>5</td><td>ENQ (enquiry)</td>
<td>010 0101</td><td>37</td><td>%</td>
<td>100 0101</td><td>69</td><td>E</td>
<td>110 0101</td><td>101</td><td>e</td>
</tr>
<tr>
<th></th>
<td>000 0110</td><td>6</td><td>ACK (acknowledge)</td>
<td>010 0110</td><td>38</td><td>&</td>
<td>100 0110</td><td>70</td><td>F</td>
<td>110 0110</td><td>102</td><td>f</td>
</tr>
<tr>
<th></th>
<td>000 0111</td><td>7</td><td>BEL (bell)</td>
<td>010 0111</td><td>39</td><td>'</td>
<td>100 0111</td><td>71</td><td>G</td>
<td>110 0111</td><td>103</td><td>g</td>
</tr>
<tr>
<th></th>
<td>000 1000</td><td>8</td><td>BS (backspace)</td>
<td>010 1000</td><td>40</td><td>(</td>
<td>100 1000</td><td>72</td><td>H</td>
<td>110 1000</td><td>104</td><td>h</td>
</tr>
<tr>
<th></th>
<td>000 1001</td><td>9</td><td>TAB (horizontal tab)</td>
<td>010 1001</td><td>41</td><td>)</td>
<td>100 1001</td><td>73</td><td>I</td>
<td>110 1001</td><td>105</td><td>i</td>
</tr>
<tr>
<th></th>
<td>000 1010</td><td>10</td><td>LF (new line)</td>
<td>010 1010</td><td>42</td><td>\*</td>
<td>100 1010</td><td>74</td><td>J</td>
<td>110 1010</td><td>106</td><td>j</td>
</tr>
<tr>
<th></th>
<td>000 1011</td><td>11</td><td>VT (vertical tab)</td>
<td>010 1011</td><td>43</td><td>+</td>
<td>100 1011</td><td>75</td><td>K</td>
<td>110 1011</td><td>107</td><td>k</td>
</tr>
<tr>
<th></th>
<td>000 1100</td><td>12</td><td>FF (new page)</td>
<td>010 1100</td><td>44</td><td>,</td>
<td>100 1100</td><td>76</td><td>L</td>
<td>110 1100</td><td>108</td><td>l</td>
</tr>
<tr>
<th></th>
<td>000 1101</td><td>13</td><td>CR (carriage return)</td>
<td>010 1101</td><td>45</td><td>-</td>
<td>100 1101</td><td>77</td><td>M</td>
<td>110 1101</td><td>109</td><td>m</td>
</tr>
<tr>
<th></th>
<td>000 1110</td><td>14</td><td>SO (shift out)</td>
<td>010 1110</td><td>46</td><td>.</td>
<td>100 1110</td><td>78</td><td>N</td>
<td>110 1110</td><td>110</td><td>n</td>
</tr>
<tr>
<th></th>
<td>000 1111</td><td>15</td><td>SI (shift in)</td>
<td>010 1111</td><td>47</td><td>/</td>
<td>100 1111</td><td>79</td><td>O</td>
<td>110 1111</td><td>111</td><td>0</td>
</tr>
<tr>
<th></th>
<td>001 0000</td><td>16</td><td>DLE (data link escape)</td>
<td>011 0000</td><td>48</td><td>0</td>
<td>101 0000</td><td>80</td><td>P</td>
<td>111 0000</td><td>112</td><td>p</td>
</tr>
<tr>
<th></th>
<td>001 0001</td><td>17</td><td>DC1 (device control 1)</td>
<td>011 0001</td><td>49</td><td>1</td>
<td>101 0001</td><td>81</td><td>Q</td>
<td>111 0001</td><td>113</td><td>q</td>
</tr>
<tr>
<th></th>
<td>001 0010</td><td>18</td><td>DC2 (device control 2)</td>
<td>011 0010</td><td>50</td><td>2</td>
<td>101 0010</td><td>82</td><td>R</td>
<td>111 0010</td><td>114</td><td>r</td>
</tr>
<tr>
<th></th>
<td>001 0011</td><td>19</td><td>DC3 (device control 3)</td>
<td>011 0011</td><td>51</td><td>3</td>
<td>101 0011</td><td>83</td><td>S</td>
<td>111 0011</td><td>115</td><td>s</td>
</tr>
<tr>
<th></th>
<td>001 0100</td><td>20</td><td>DC4 (device control 4)</td>
<td>011 0100</td><td>52</td><td>4</td>
<td>101 0100</td><td>84</td><td>T</td>
<td>111 0100</td><td>116</td><td>t</td>
</tr>
<tr>
<th></th>
<td>001 0101</td><td>21</td><td>NAK (negative acknowledge)</td>
<td>011 0101</td><td>53</td><td>5</td>
<td>101 0101</td><td>85</td><td>U</td>
<td>111 0101</td><td>117</td><td>u</td>
</tr>
<tr>
<th></th>
<td>001 0110</td><td>22</td><td>SYN (synchronous idle)</td>
<td>011 0110</td><td>54</td><td>6</td>
<td>101 0110</td><td>86</td><td>V</td>
<td>111 0110</td><td>118</td><td>v</td>
</tr>
<tr>
<th></th>
<td>001 0111</td><td>23</td><td>ETB (end of trans. block)</td>
<td>011 0111</td><td>55</td><td>7</td>
<td>101 0111</td><td>87</td><td>W</td>
<td>111 0111</td><td>119</td><td>w</td>
</tr>
<tr>
<th></th>
<td>001 1000</td><td>24</td><td>CAN (cancel)</td>
<td>011 1000</td><td>56</td><td>8</td>
<td>101 1000</td><td>88</td><td>X</td>
<td>111 1000</td><td>120</td><td>x</td>
</tr>
<tr>
<th></th>
<td>001 1001</td><td>25</td><td>EM (end of medium)</td>
<td>011 1001</td><td>57</td><td>9</td>
<td>101 1001</td><td>89</td><td>Y</td>
<td>111 1001</td><td>121</td><td>y</td>
</tr>
<tr>
<th></th>
<td>001 1010</td><td>26</td><td>SUB (substitute)</td>
<td>011 1010</td><td>58</td><td>:</td>
<td>101 1010</td><td>90</td><td>Z</td>
<td>111 1010</td><td>122</td><td>z</td>
</tr>
<tr>
<th></th>
<td>001 1011</td><td>27</td><td>ESC (escape)</td>
<td>011 1011</td><td>59</td><td>;</td>
<td>101 1011</td><td>91</td><td>[</td>
<td>111 1011</td><td>123</td><td>{</td>
</tr>
<tr>
<th></th>
<td>001 1100</td><td>28</td><td>FS (file separator)</td>
<td>011 1100</td><td>60</td><td><</td>
<td>101 1100</td><td>92</td><td>\\</td>
<td>111 1100</td><td>124</td><td>|</td>
</tr>
<tr>
<th></th>
<td>001 1101</td><td>29</td><td>GS (group separator)</td>
<td>011 1101</td><td>61</td><td>=</td>
<td>101 1101</td><td>93</td><td>]</td>
<td>111 1101</td><td>125</td><td>}</td>
</tr>
<tr>
<th></th>
<td>001 1110</td><td>30</td><td>RS (record separator)</td>
<td>011 1110</td><td>62</td><td>\></td>
<td>101 1110</td><td>94</td><td>^</td>
<td>111 1110</td><td>126</td><td>~</td>
</tr>
<tr>
<th></th>
<td>001 1111</td><td>31</td><td>US (unit separator)</td>
<td>011 1111</td><td>63</td><td>?</td>
<td>101 1111</td><td>95</td><td>\_</td>
<td>111 1111</td><td>127</td><td>DEL</td>
</tr>
</tbody>
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

