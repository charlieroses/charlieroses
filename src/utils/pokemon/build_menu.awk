function id ( name ) {
	ret = name
	gsub( /[^0-9a-zA-Z]/, "", ret )
	return tolower(ret)
}

BEGIN {
	W=ARGV[1]
	ARGC=1
	FS="\t"
	while( "ls pokemon/images/seticons" | getline I )
		IMGS[I] = 1
	print "<center>"
	print "<table class=\"menu\">"
	print "\t<tr>"
}

NR > 1 && NR % W == 1 {
	print "\t</tr><tr>"
}

{
	TITLE = "<b>" $1 "</b>"
	IMG = id($1) ".png"
	FILE = id($1) ".html"
	TSV = id($1) ".tsv"
	HREF = " href=\"" FILE "\" "
	CLASS = "incomplete"
	if( ! IMGS[IMG] )
		IMG = ""
}

length($7) > 0 {
	TITLE = TITLE "<sup><b>&starf;</b></sup>"
}

length($6) > 0 {
	FILE = id($1) "_" id($6) ".html"
	HREF = " href=\"" FILE "\" "
	TITLE = TITLE "<br><i>" $6 "</i>"
}

$6 ~ /Black Star Promos/ {
	IMG = "blackstarpromos.png"
}

$5 ~ /X/ {
	CLASS = "complete"
}

$5 ~ /0/ {
	CLASS = "nocards"
	HREF = ""
}

{
	if( length(IMG) > 0 )
		IMG = "<div class=\"imgdiv\"><img src=\"images/seticons/" IMG "\"></div>"
	TITLE = "<div class=\"titlediv\">" TITLE "</div>"
	print "<td class=\"" CLASS "\"><a" HREF ">" IMG TITLE "</a></td>"
}

END {
	print "</tr>"
	print "</table>"
	print "</center>"
}
