BEGIN {
	FS="\t"
	W = 5
	print "\t<center>"
}

/^POP/ {
	print "\t</center>"
	print "\t<hr>"
	print "\t<center>"
}

NR % 2 == 0 {
	CLASS = "even"
}

NR % 2 == 1 {
	CLASS = "odd"
}

{
	T = $1
	gsub( /[^0-9a-zA-Z]/, "", T )
	print "\t<a href=\"index.html#" tolower(T) "\" class=\"" CLASS " series\">" $1 "</a><br>"
}

END {
	print "\t</center>"
}
