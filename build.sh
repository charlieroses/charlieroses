#!/bin/bash
# Charlie Rose
# A script to build my webpages for my personal site

ACT_TEMPLATE=$(cat template_a.html)
TEMPLATE=$(cat template.html)
MD_SRC='./markdownfiles'

declare -A HEADERS
HEADERS=( ["activism.html"]="Activism Work"
		  ["experience.html"]="Professional Experience"
		  ["index.html"]=" "
		  ["projects.html"]="Personal Projects")

echo "Building HTML files from Markdown..."

for IN_FILE in ${MD_SRC}/*
do
	OUT_FILE=.${IN_FILE#${MD_SRC}}
	OUT_FILE=${OUT_FILE%.md}.html

	echo "Building ${OUT_FILE} from ${IN_FILE}..."
	
	HEADER=${HEADERS[${OUT_FILE#./}]}
	if [ ! "$OUT_FILE" = "./index.html" ]
	then
		HEADER=" - $HEADER"
	fi

	CONTENT=$(pandoc --preserve-tabs ${IN_FILE})
	
	if [ "$OUT_FILE" = "./activism.html" ]
	then
		HTMLPAGE="${ACT_TEMPLATE}"
	else
		HTMLPAGE="${TEMPLATE}"
	fi
	
	HTMLPAGE="${HTMLPAGE/<!-- HEADING -->/${HEADER}}"
	HTMLPAGE="${HTMLPAGE/<!-- CONTENT -->/${CONTENT}}"

	echo "${HTMLPAGE}" > ${OUT_FILE}
done

echo "Completed"
