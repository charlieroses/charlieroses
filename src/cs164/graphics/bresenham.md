
Okay I should probably actually fill in the actual material for this section at
some point, but I had this idea for a thing and it's really cute.

```
plotLine(x0,y0, x1,y1)
	dx = x1-x0
	dy = y1-y0
	y = y0
	e = 0
	for x from x0 to x1
		plot(x,y)
		e = e + dy
		if 2*e &gt; dx
			y = y+1
			e = e - dx
```

Basically, the textareas give you the values for `(x0, y0)` and `(x1, y1)`.
These can be randomly generated or you can enter your own values.
Click on each cell to select it.
Click again to deselect it.

<center>
<table id="bresenhams-line-drawing-algorithm" class="practice">
<colgroup>
<col span="1" class="red">
</colgroup>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td></td>
<td>(x0, y0)</td>
<td>(x1, y1)</td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>(<textarea id="x0"></textarea>, <textarea id="y0"></textarea>)</td>
<td>(<textarea id="x1"></textarea>, <textarea id="y1"></textarea>)</td>
<td></td>
</tr>
<tr>
<td></td>
<td colspan=4><center><table id="bresenhamgrid"></table></center></td>
</tr>
<tr>
<td></td>
<td><button id="clear" onclick="cleargrid()">Reset Grid</button></td>
<td><button id="generate" onclick="generate()">Random Points</button></td>
<td><button id="verify" onclick="verify()">Check Answers</button></td>
<td><button id="solution" onclick="solution()">See Solution</button></td>
</tr>
</table>
</center>

</body>
<script>
init();
</script>
