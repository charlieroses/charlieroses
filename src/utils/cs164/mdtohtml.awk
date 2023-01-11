#!/usr/bin/awk -f

function processtext( str ) {
	str = processlinks( str )
	rstr = ""
	for( i = 1; i <= length(str); i++ ) {
		if( substr( str, i, 3 ) == "***" && textpre == 0 ) {
			if( substr( text, 0, 2 ) == "bi" ) {
				rstr = rstr "</b></i>"
				text = substr( text, 3 )
			}
			else {
				rstr = rstr "<i><b>"
				text = "bi" text
			}
			i += 2
		}
		else if( substr( str, i, 2 ) in txtmap && textpre == 0 ) {
			ss = substr( str, i, 2 )
#			print " > text: " text "\tsubstr: " ss "\t\n"
			if( substr( text, 0, length(txtmap[ss]) ) == txtmap[ss] ) {
				rstr = rstr "</" txtmap[ss] ">"
				text = substr( text, length(txtmap[ss])+1 )
			}
			else {
				rstr = rstr "<" txtmap[ss] ">"
				text = txtmap[ss] text
			}
			i++
		}
		else if( substr( str, i, 1 ) == "`" ) {
			if( textpre )
				rstr = rstr "</code>"
			else
				rstr = rstr "<code>"
			textpre = ! textpre;
		}
		else if( substr( str, i, 1 ) in txtmap && textpre == 0 ) {
			ss = substr( str, i, 1 )
#			print " > text: " text "\tsubstr: " ss "\t\n"
			if( substr( text, 0, length(txtmap[ss]) ) == txtmap[ss] ) {
				rstr = rstr "</" txtmap[ss] ">"
				text = substr( text, length(txtmap[ss])+1 )
			}
			else {
				rstr = rstr "<" txtmap[ss] ">"
				text = txtmap[ss] text
			}
		}
		else if( substr( str, i, 2 ) ~ /\\[*_~^`>:|]/ ) {
			rstr = rstr substr( str, i+1, 1 )
			i++
		}
		else {
			rstr = rstr substr( str, i, 1 )
		}
	}

	for( a in abbrvs ) {
		gsub( a, "<abbr title=\"" abbrvs[a] "\">" a "</abbr>", rstr )
	}
	return rstr
}

function processlinks( str ) {
	# Images
	while( match( str, /!\[[^]]*\]\([^)]*\)/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		alt = substr( ss, 0, index(ss, "](" )-1 )
		alt = substr( alt, 3 )
		src = substr( ss, index( ss, "](" )+2 )
		src = substr( src, 0, length(src)-1 )
		img = "<img src=\"" src "\""
		if( length(alt) )
			img = img " alt=\"" alt "\" id=\"" makeid(alt) "\""
		img = img ">"
		sub( /!\[[^]]*\]\([^)]*\)/, img, str )
	}
	# Links
	while( match( str, /\[[^]]*\]\([^)]*\)/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		alt = substr( ss, 0, index(ss, "](" )-1 )
		alt = substr( alt, 2 )
		src = substr( ss, index( ss, "](" )+2 )
		src = substr( src, 0, length(src)-1 )
		sub( /\[[^]]*\]\([^)]*\)/, "<a href=\"" src "\">" alt "</a>", str )
	}
	# Footnote Details
	while( match( str, /\[\^[0-9]+\]:/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		num = substr( ss, 0, length(ss)-2 )
		num = substr( num, 3 )
		sub( /\[\^[0-9]+\]:/, "<a href=\"#ref-" num "\" id=\"details-" num "\">[" num "]:</a>", str )
	}
	# Footnote Refs
	while( match( str, /\[\^[0-9]+\]/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		num = substr( ss, 0, length(ss)-1 )
		num = substr( num, 3 )
		sub( /\[\^[0-9]+\]/, "<a href=\"#details-" num "\" id=\"ref-" num "\"><sup>[" num "]</sup></a>", str )
	}
	return str
}

function printout( str, nl ) {
	if( nl )
		print str "\n"
	else
		print str
}

function opentag( t ) {
	printout( "<" tagmap[t] ">", 1 )
	tags = t tags
}

function closetags ( d ) {
	while( d > 0 ) {
		t = substr( tags, 1, 1 )
		printout( "</" tagmap[t] ">", 1 )
		tags = substr( tags, 2 )
		d--
	}
}

function makeid( str ) {
	s = tolower( str )
	gsub( /[^a-z0-9 ]/, "", s )
	gsub( / /, "-", s )
	return s
}

BEGIN {
	FS = "\n"
	ORS = ""

	tags = ""
	pre = 0
	text = ""
	textpre = 0
	table = ""
	center = ""

	tagmap["b"] = "blockquote"
	tagmap["p"] = "p"
	tagmap["u"] = "ul"
	tagmap["o"] = "ol"
	tagmap["l"] = "li"
	txtmap["**"] = "b"
	txtmap["__"] = "u"
	txtmap["~~"] = "del"
	txtmap["``"] = "code"
	txtmap["*"] = "i"
	txtmap["_"] = "i"
	txtmap["^"] = "sup"
	txtmap["~"] = "sub"

	printout( "<div class=\"content\">", 1 )
}

# Abbreviations
/^\[>[^\]]+\]:[ \t]+/ {
	abrv = substr( $0, 1, index( $0, ":" ) )
	abrv = substr( abrv, 3, length(abrv)-4 )
	ttle = substr( $0, index( $0, ":" )+1 )
	sub( /^[ \t]*/, "", ttle )
	sub( /[ \t]*$/, "", ttle )
	abbrvs[abrv] = ttle
	next
}

/```/ {
	if( pre != 0 ) {
		printout( "</pre>", 1 )
		pre = 0
	}
	else {
		sub( /```/, "", $0 )
		if( length($0) ) {
			printout( "<pre class=\"" $0 "\">", 0 )
			pre = $0
		}
		else {
			printout( "<pre>", 0 )
			pre = 1
		}
	}
	next
}

pre != 0 {
	print $0 "\n"
	next
}

# Rule
/^---/ {
	if( table ) {
		printout( "</tbody>", 1 )
		printout( "</table>", 1 )
		table = ""
	}
	closetags( length(tags) )

	printout( "</div>", 1 )
	printout( "<hr>", 1 )
	printout( "<div class=\"content\">", 1 )
	next
}

# Center
/^></ {
	if( table ) {
		printout( "</tbody>", 1 )
		printout( "</table>", 1 )
		table = ""
	}
	closetags( length(tags) )

	printout( "<" center "center>", 1 )
	if( center )
		center = ""
	else
		center = "/"
	next
}

# Blank lines
length($0) == 0 {
	if( table ) {
		printout( "</tbody>", 1 )
		printout( "</table>", 1 )
		table = ""
	}
	closetags( length(tags) )
	next
}

# Blockquote
/^>/ {
	match( $0, /^(>[ \t]*)+/ )
	blocks = substr( $0, RSTART, RLENGTH )
	bdepth = gsub( />/, "", blocks )
	i = gsub( /b/, "b", tags )
	sub( /^(>[ \t]*)+/, "", $0 )
	if( i < bdepth ) { # add block quotes
		for( i = i; i < bdepth; i++ )
			opentag( "b" )
	}
	else if ( i > bdepth ) { # remove blockquotes
		for( i = i; i > bdepth; i-- ) {
			closetags( index( tags, "b" ) )
		}
	}
	if( length($0) == 0 ) {
		closetags( index( tags, "b" )-1 )
		next
	}
}

# Header
/^#+[ \t]+/ {
	match( $0, /^#+[ \t]+/ )
	header = substr( $0, RSTART )
	hdepth = gsub( /#/, "", header )
	sub( /^#+[ \t]+/, "", $0 )
	printout( "<h" hdepth " id=\"" makeid($0) "\">" processtext( $0 ) "</h" hdepth ">", 1 )
	next
}

# Table
/^\|/ {
	gsub( /\\\|/, "&#124;", $0 )
	if( length(table) == 0 ) {
		ss = substr( $0, 1, index( $0, "||" )-1 )
		c = gsub( /\|/, "|", ss )
		printout( "<table>", 1 )
		printout( "<colgroup>", 1 )
		printout( "<col span=\"" c "\" class=\"red\">", 1 )
		printout( "</colgroup>", 1 )
		printout( "<thead>", 1 )
		table = "1"
		cell = "h"
	}
	if( $0 ~ /^\|[\:\-\|]*\|$/ ) {
		printout( "</thead>", 1 )
		printout( "<tbody>", 1 )
		cell = "d"
		next
	}
	sub( /^\|[ \t]*/, "", $0 )
	thcol = substr( $0, 0, index( $0, "||" ) )
	tdcol = substr( $0, index( $0, "||" ) )
	sub( /^\|\|/, "", tdcol )
	printout( "<tr>", 1 )
	b = index( thcol, "|" )
	while( b > 0 ) {
		text = substr( thcol, 1, b-1 )
		thcol = substr( thcol, b+1 )
		b = index( thcol, "|" )
		sub( /^[ \t]*/, "", text )
		sub( /[ \t]*$/, "", text )
		printout( "<th>", 0 )
		printout( processtext(text), 0 )
		printout( "</th>", 1 )
	}
	b = index( tdcol, "|" )
	while( b != 0 ) {
		text = substr( tdcol, 1, b-1 )
		tdcol = substr( tdcol, b+1 )
		b = index( tdcol, "|" )
		sub( /^[ \t]*/, "", text )
		sub( /[ \t]*$/, "", text )
		printout( "<t" cell ">", 0 )
		printout( processtext(text), 0 )
		printout( "</t" cell ">", 1 )
	}
	printout( "</tr>", 1 )
	next
}

## Ordered/Unordered List
/^[ \t]*-[ \t]+/ || /^[ \t]*[0-9]+\.[ \t]+/ {
	match( $0, /^[ \t]*[-0-9]/ )
	whitespace = substr( $0, RSTART, RLENGTH )
	ldepth = gsub( /[ \t]/, "", whitespace )
	cdepth = gsub( /u/, "u", tags )
	cdepth += gsub( /o/, "o", tags )
	if( ldepth+1 > cdepth ) { # add lists
		if( $0 ~ /^[ \t]*-/ )
			opentag( "u" )
		else
			opentag( "o" )
		opentag( "l" )
	}
	else if ( ldepth < cdepth-1 ) { # remove lists
		i = cdepth - ldepth - 1
		closetags( i * 2 )
	}
	else {
		closetags( 1 )
		opentag( "l" )
	}

	sub( /^[ \t]*((-)|([0-9]+\.))[ \t]+/, "", $0 )
}

# Text that needs to be formatted
{
	if( length(tags) == 0 || tags ~ /^[^pl]/ )
		opentag( "p" )
	sub( /^[ \t]*/, "", $0 )
	printout( processtext( $0 ), 1 )
}

END {
	if( table ) {
		printout( "</tbody>", 1 )
		printout( "</table>", 1 )
	}

	closetags( length(tags) )

	if( center ) {
		printout( "</center>", 1 )
	}

	printout( "</div>", 1 )
}
