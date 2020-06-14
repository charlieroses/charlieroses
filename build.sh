#!/bin/bash
# Charlie Rose
# A script to build my webpages for my personal site

TEMPLATE=$(cat template.html)
MD_SRC='./markdownfiles'
BLOGMD_SRC=${MD_SRC}/blog
BLOGPOST_SRC="./blogposts"

declare -A HEADERS
HEADERS=( ["activism.html"]="Activism Work"
		  ["blog.html"]="Blog"
		  ["experience.html"]="Professional Experience"
		  ["index.html"]=" "
		  ["projects.html"]="Personal Projects")

echo "Building main HTML files from Markdown..."

for IN_FILE in ${MD_SRC}/*
do
	if [ -d ${IN_FILE} ]
	then
		continue
	fi

	OUT_FILE=.${IN_FILE#${MD_SRC}}
	OUT_FILE=${OUT_FILE%.md}.html

	echo "Building ${OUT_FILE} from ${IN_FILE}..."
	
	HEADER=${HEADERS[${OUT_FILE#./}]}
	if [ ! "$OUT_FILE" = "./index.html" ]
	then
		HEADER=" - $HEADER"
	fi

	CONTENT=$(pandoc --preserve-tabs ${IN_FILE})

	HTMLPAGE=${TEMPLATE}
	HTMLPAGE="${HTMLPAGE/<!-- HEADING -->/${HEADER}}"
	HTMLPAGE="${HTMLPAGE/<!-- CONTENT -->/${CONTENT}}"

	echo "${HTMLPAGE}" > ${OUT_FILE}
done


if [ ! -e "${BLOGPOST_SRC}" ]
then
	echo "Building blogpost directory..."
	mkdir ${BLOGPOST_SRC}
fi

echo "Building blog HTML files from Markdown..."

for IN_FILE in ${BLOGMD_SRC}/*
do
	# Only build the page if it's not in progress
	if [ "${IN_FILE}" = "${IN_FILE%wip*}" ]
	then
		OUT_FILE=${BLOGPOST_SRC}${IN_FILE#${BLOGMD_SRC}}
		OUT_FILE=${OUT_FILE%.md}.html

		echo "Building ${OUT_FILE} from ${IN_FILE}..."

		TITLE=`head -n 1 ${IN_FILE}`
		TITLE=${TITLE#"# "}
		
		HEADER=" - ${HEADERS[blog.html]}"

		CONTENT=$(pandoc --preserve-tabs ${IN_FILE})

		HTMLPAGE=${TEMPLATE}
		HTMLPAGE="${HTMLPAGE/<!-- HEADING -->/${HEADER}}"
		HTMLPAGE="${HTMLPAGE/<!-- CONTENT -->/${CONTENT}}"

		echo "${HTMLPAGE}" > ${OUT_FILE}
	else
		echo "Ignoring work in progress file ${IN_FILE}"
	fi

done

echo "Completed"
