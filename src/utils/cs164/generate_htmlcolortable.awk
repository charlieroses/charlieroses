BEGIN {
	print "<table>"
}

NR > 1 {
	print "\t<tr>"
	print "\t\t<td class=\"swatch\" style=\"background-color: " $2 " \"></td>"
	print "\t\t<td class=\"name\">" $1 "</td>"
	print "\t\t<td class=\"hex\">" $2 "</td>"
	print "\t</tr>"
}

END {
	print "</table>"
}
