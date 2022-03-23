# Stop Complaining About Vim

I've noticed many of my students try to find any way possible to avoid using a
terminal based plain text editor. They always seem to find these complex work
arounds that end up being a lot more complicated than just learning how to use
a terminal.

So here's a list of the most common complaints I get about `vim` and their
"fixes". Plus a few more tricks I appreciate at the end.

---

### "There's no line numbers"

In your `.vimrc` add:

```
set number
```

---

### "I can't use my mouse"

In your `.vimrc` add:

```
set mouse=a
```

---

### "I can only open one file at a time"

```
:vsplit filename
```

Then `Ctrl-w-w` to switch between windows and `:resize` and `:verical resize` to
change the size.

---

### "I don't like the colors"

If the text is too dark, start with:

```
set bg=dark
```

Then if you want to toggle specific colors of specific syntax categories, use
`:hi`. I like to turn my whitespace on so I can see tabs and spaces. I make them
a dark gray that blends in with my background nice. Easy to ignore, but easy to
spot inconsistencies.

```
set listchars=tab:>-,trail:.
set list
hi SpecialKey ctermfg=240
```

---

### Find and Replace

To "comment" lines 10 through 100 (replace the front of the line (`^`) with a
hash):

```
:10,100s/^/#/
```

To "uncomment" lines 10 through 100 (replace hashes at the start of a line with
nothing):

```
:10,100s/^#//
```

Here's a quick "find and replace" tutorial in `vim` (it's basically just baby
`sed`). This isn't exhaustive.

```
:s/find/replace/options
```

`find` and `replace` are straight forward. These are the pattens you want to
find and replace. You can use regex and sed patterns and such. You can also
replace the `/` with another character if you have a lot of slashes in your
patterns.

You can prepend the `s` with:

- `%` : All lines in the file
- `s,e` : Where `s` is the starting line number and `e` is the ending line
	number. This range is inclusive
- `.` : The current line
- `$` : The last line
- `+-` : Plus or minus a certain number of lines based on the preceeding number

So `:.,+5s/^/#/` comments the current line and the next 5. No prepend will only
affect the current line.

Then you've got the following available `options`:

- `g` : Replace all occurances in the line. By default, only the first occurance
	of each line is changed
- `c` : Asks for confirmation before replacing each match
- `i` : Ignore case

---

### Spellcheck

```
:setlocal spell! spelllang=en_us,es
```

In my `.vimrc` I have it set that `F6` toggles spellcheck on and off:

```
map <F6> :setlocal spell! spelllang=en_us,es<CR>
```

---

### Man Pages

If you add these lines to your `.vimrc`:

```
runtime! ftplugin/man.vim
let g:ft_man_open_mode = "vert"
```

You enable the `man` page plugins. Then you can use `:Man` to open `man` pages
in splitscreen. You can also use `!man` for a similar effect without the plugin,
but I prefer seeing my code and the manual side by side.

