#!/bin/bash

TEMPLATE=$(cat template.html)
MD_SRC='./markdownfiles'


# IMPORTANT LINES DON"T BREAK

echo "Building HTML files from Markdown..."

for IN_FILE in ${MD_SRC}/*
do
	OUT_FILE=.${IN_FILE#${MD_SRC}}
	OUT_FILE=${OUT_FILE%.md}.html
	
	echo "Building ${OUT_FILE} from ${IN_FILE}..."

	CONTENT=$(pandoc --preserve-tabs ${IN_FILE})
	echo "${TEMPLATE/<!-- CONTENT -->/${CONTENT}}" > ${OUT_FILE}
done

echo "Completed"
