RSA Encryption was introduced in 1977 by Ron Rivest, Adi Shamir and Leonard
Adleman at MIT; hence the name "RSA".
On the lecture slides, it's also called Public Key Encryption (PKE) and PKC
(Public Key Cryptography).

Some links you may find helpful in this section

- [RSA Key Generation Worksheet](https://www.cs.drexel.edu/~jpopyack/Courses/CSP/Wi19/notes/10.1_Cryptography/RSAWorksheetv4f.html)
- [RSA Encryption/Decryption Calculator](https://www.cs.drexel.edu/~jpopyack/Courses/CSP/Wi19/notes/10.1_Cryptography/RSA_Express_EncryptDecrypt_v2.html)
- [Dr. Stuart's Public Key Cryptography Lecture](https://1513041.mediaspace.kaltura.com/media/CS475+Crypto+3/1_st8qnz7g)

---

# How it Works

Let's start with a set of generated keys:

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th><td><code>e</code>= A Public Key</td></tr>
<tr><th></th><td><code>d</code>= A Private Key</td></tr>
<tr><th></th><td><code>n</code>= Shared Public Modulo</td></tr>
</tbody>
</table>
</center>

Given that we are using PKC, we use the following encryption and decryption
functions to encrypt and decrypt our message <code>m</code>.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th><td><code>E(m, k) = m^k^ mod n</code></td></tr>
<tr><th></th><td><code>D(m, k) = m^k^ mod n</code></td></tr>
</tbody>
</table>
</center>

When you look at these functions, you may have some hypothetical confusions.

_"Encryption and decryption are the same function.
How can we encrypt and decrypt at the same time?"_
When we generate <code>e</code> and <code>d</code>, they become inverses of each
other.
Since you most likely haven't been taught modular arithmetic yet, let's look at
some inverses in math that we already know: fractions.
Below, I've created two sets of keys, one for person A, one for person B.
For the sake of simplicity, I've removed <code>n</code> the shared public
modulo.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td colspan=2><code>e~A~ = 2, d~A~ = 1/2</code></td>
<td class="left">A set of matching keys</td>
</tr>
<tr><th></th>
<td colspan=2><code>e~B~ = 5, d~B~ = 1/5</code></td>
<td class="left">A different set of matching keys</td>
</tr>
<tr><th></th>
<td colspan=2><code>E(m, k) = m^k^</code></td>
<td class="left">Encryption function</td>
</tr>
<tr><th></th>
<td colspan=2><code>E(m, e~A~) = m^e~A~^</code></td>
<td class="left">Encrypt with <code>e~A~</code></td>
</tr>
<tr><th></th>
<td colspan=2><code>E(m, e~A~) = m^2^</code></td>
<td class="left">Plug in <code>e~A~ = 2</code></td>
</tr>
<tr><th></th>
<td>**Decrypting with the**<br>**Right Key**</td>
<td>**Decrypting with the**<br>**Wrong Key**</td>
</tr>
<tr><th></th>
<td><code>D(m, k) = m^k^</code></td>
<td><code>D(m, k) = m^k^</code></td>
<td class="left">Decryption function</td>
</tr>
<tr><th></th>
<td><code>D(E(m, e~A~), d~A~) = E(m, e~A~)^d~A~^</code></td>
<td><code>D(E(m, e~A~), d~B~) = E(m, e~A~)^d~B~^</code></td>
<td class="left">Plug in keys</td>
</tr>
<tr><th></th>
<td><code>D(E(m, e~A~), d~A~) = (m^2^)^1/2^</code></td>
<td><code>D(E(m, e~A~), d~B~) = (m^2^)^1/5^</code></td>
<td class="left">Plug in values</td>
</tr>
<tr><th></th>
<td><code>D(E(m, e~A~), d~A~) = m^2\*(1/2)^</code></td>
<td><code>D(E(m, e~A~), d~B~) = m^2\*(1/5)^</code></td>
<td class="left">Exponent properties</td>
</tr>
<tr><th></th>
<td><code>D(E(m, e~A~), d~A~) = m</code></td>
<td><code>D(E(m, e~A~), d~B~) = m^2/5^</code></td>
<td class="left">Simplify</td>
</tr>
</tbody>
</table>
</center>

As we can see, just by plugging and chugging, since <code>e~A~</code> and
<code>d~A~</code> are inverses, they can be used together to encrypt and decrypt
messages.
The same applies to <code>e~B~</code> and <code>d~B~</code>.
Since these keys are inverses, they can encrypt and decrypt each others
messages.
If I don't use matching keys, I don't get the message I started with.

You may also say _"A message is a bunch of letters! How can I raise a word to an
exponent?"_
Remember in [the ASCII section](ascii/ascii.html), we learned we can use binary
to represent letters.
Using ASCII, we represent each letter as a number and concatenate them (smush
them together) to create one number that we raise to an exponent.
If we get a very long message, we can concatenate groups of numbers and then
encrypt each group separately.
Since we apply a modulo to the resulting exponent, this forces our value to be
within a certain range, which tells us how many letters would be concatenated
into one numeric part of the message.

Now that we've cleared up some hypothetical concerns about how these functions
work, let's deal with new hypothetical concerns about how to use these
functions.
We have lots of numbers here: <code>e~A~</code>, <code>d~A~</code>,
<code>e~B~</code>, <code>d~B~</code>, and <code>n</code>.
We also have two functions (which are really the same thing, just with different
notation so they're easier to tell apart): <code>E(m, k)</code> and
<code>D(m, k)</code>.
We know how to encrypt and decrypt messages, but how do we know what key to use?
How do we know when to use each type of key?

The answer is a lot simpler than you'd think.
When we want to send a message that only one person can read, we encrypt it in a
way such that only one person can decrypt it.
PKE can only work if <code>e</code> is always public and <code>d</code> is
always private.

---

## Scenario

My name is Charlie, I was the Head TA for CS-164 with Dr. Stuart for five years.
Being the Head TA, Dr. Stuart sent me lots of emails about students and their
grades.
These emails need to be private due to
[FERPA](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)
(fancy government policy making sure that your grades are private and won't be
shared without your permission).
Let's say we live in a world where emails are posted publicly; anyone can read
them.
This would make discussion about grades very difficult (and illegal).
In order to navigate this terrifying situation, instead of finding a new method
of communication, Dr. Stuart and I decide to use PKC to communicate over this
insecure network.

We start by each generating a set of keys for ourselves.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th><td><code>e~C~</code>= Charlie's Public Key</td></tr>
<tr><th></th><td><code>d~C~</code>= Charlie's Private Key</td></tr>
<tr><th></th><td><code>e~B~</code>= Dr. Stuart's Public Key</td></tr>
<tr><th></th><td><code>d~B~</code>= Dr. Stuart's Private Key</td></tr>
<tr><th></th><td><code>n</code>= Shared Public Modulo</td></tr>
</tbody>
</table>
</center>

For the remainder of this scenario, I'm intentionally leaving out <code>n</code>
for simplicity's sake.

<center>
<img src="crypto/rsa_setup.png">
</center>

Above, I use the "speech bubble" to show that we've announced our public keys
(<code>e~C~</code> and <code>e~B~</code>) to the world.
If someone would like to know our public keys, they just have to stand close
enough to hear it.
I don't have to see them for them to know my public key.
They don't have to see me to know my public key.

I use the "thought cloud" to show that our private keys (<code>d~C~</code> and
<code>d~B~</code>) are secret.
No one can hear my thoughts, thus, no one can know my private key.

To clear up some confusion, I am the figure on the left with the purple hair.
This may not be obvious as my hair color changes very frequently, but purple was
one of my favorites ~~(second to my orange/purple halloween hair)~~.
Dr. Stuart is the figure on the right.
You can tell since he is wearing glasses (I have 20/20 vision) and clearly does
not have a hair care regimen.

Dr. Stuart has recently met with a student (S) about their assignment.
He decides that the student should get a 90% on their assignment and would like
to send me a message to update the gradebook.
Knowing that our messages are public, how should he send this message so that
only I can read it?

<center>
<img src="crypto/rsa_msg.png">
</center>

We know we have to encrypt the message in some way.
To use our encryption function, we need a message <code>m</code> and a key
<code>k</code>.
We already know what <code>m</code> is.
What key should Dr. Stuart use to encrypt his message with?
Before we think about what key he _should_ use, let's look at what keys he _can_
use.

<center>
<img src="crypto/rsa_blsknow.png">
</center>

Dr. Stuart knows his public and private keys <code>(e~B~, d~B~)</code>, his
message (that he hasn't sent yet) <code>m</code>, and my public key
<code>e~C~</code>.
Dr. Stuart doesn't know what I'm thinking (and I'm sure he doesn't want to
either), so he does not know my private key <code>d~C~</code>.

This means he has three keys he can encrypt his message with: <code>e~B~</code>,
<code>d~B~</code>, and <code>e~C~</code>.
Which should he use?

To figure this out, he should then think about what I know.

<center>
<img src="crypto/rsa_charlieknow.png">
</center>

I know my public and private keys <code>(e~C~, d~C~)</code> and his public key
<code>e~B~</code>.
Again, I don't know what Dr. Stuart is thinking (nor do I want to) so I don't
know what message <code>m</code> he is trying to send and I don't know his
private key <code>d~B~</code>.

This means I have three keys I can decrypt with: <code>e~C~</code>,
<code>d~C~</code>, and <code>e~B~</code>.
Again, we have three keys.
How does this narrow down our options?

Remember, matching keys are needed to decrypt messages that have been encrypted.
Let's look at what Dr. Stuart and I know in a different format.
I've made a table.
One column has the keys that Dr. Stuart knows.
One column has the keys that I know.
The rows are keys that match.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead>
<tr><th></th>
<th>**Dr. Stuart can encrypt with**</th>
<th>**Charlie can decrypt with**</th>
</tr>
</thead>
<tbody>
<tr><th></th>
<td><code>e~B~</code></td>
<td></td>
</tr>
<tr><th></th>
<td><code>d~B~</code></td>
<td><code>e~B~</code></td>
</tr>
<tr><th></th>
<td><code>e~C~</code></td>
<td><code>d~C~</code></td>
</tr>
<tr><th></th>
<td></td>
<td><code>e~C~</code></td>
</tr>
</tbody>
</table>
</center>

Now we can see, even though Dr. Stuart _could_ encrypt with his public key, I
would not be able to decrypt his message because I don't know his private key.
I _could_ decrypt with my public key, but that would require Dr. Stuart sending
me a message with my private key, which he doesn't know.

This leaves him with two options.
He can encrypt his message with his private key, meaning I would decrypt with
his public key.
Or, he can encrypt with my public key, meaning I would decrypt with my private
key.
Both of these options will work, but which _should_ he use if he wants to send
me a message that only I can read?

He should use <span class="hide">my public</span> key to encrypt the message.

<center>
<img src="crypto/rsa_msgsent.png">
</center>

Dr. Stuart sends <code>E(m, e~C~)</code>.
Anyone can read this encrypted message, but that doesn't matter.
Since only I know my private key, only I can compute
<code>D(E(m, e~C~), d~C~)</code> to decrypt the message.

If he had used his private key <code>d~B~</code> to encrypt the message, I could
have decrypted it with his public key <code>e~B~</code>.
Unlike my private key, _everyone_ knows Dr. Stuart's public key meaning that
_everyone_ can decrypt his message.
This is not the best option for him to send me a secret message.

And that's how basic Public Key Cryptography works.
This next bit will expand on PKE by adding signatures to the mix.

---

## Signatures

After their meeting with Dr. Stuart, student S was very angry.
Despite not following the instructions on the lab, they felt they deserved a 100
on their assignment, not a 90.
Dr. Stuart was so unreasonable, he might as well have failed them for the class!
Does Dr. Stuart not realize that those 10 points on their lab would drop their
final grade by 0.38%?!?!
This is absurd!

The student, outraged by facing the consequences of not reading the
instructions, decides to take matters into their own hands.
They know Dr. Stuart is planning on sending me a message about their grade.
They also know that in order for this message to stay private, Dr. Stuart needs
to use my public key to encrypt the message.
This student generates their own RSA keys and sends me a message pretending to
be Dr. Stuart.
They write their own message, <code>m~S~ = "Give S a 100"</code>, encrypt it,
and send it to me.

<center>
<img src="crypto/rsasig_setup.png">
</center>

I check my mailbox and I see I've got two encrypted messages, <code>E~1~</code>
and <code>E~2~</code>.
I decrypt both of them with my private key.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td><code>D(E~1~, d~C~)</code></td>
<td><code>D(E~2~, d~C~)</code></td>
</tr>
<tr><th></th>
<td><code>E~1~^d~C~^</code></td>
<td><code>E~2~^d~C~^</code></td>
</tr>
<tr><th></th>
<td><code>(m~1~^e~C~^)^d~C~^</code></td>
<td><code>(m~2~^e~C~^)^d~C~^</code></td>
</tr>
<tr><th></th>
<td><code>m~1~^e~C~d~C~^</code></td>
<td><code>m~2~^e~C~d~C~^</code></td>
</tr>
<tr><th></th>
<td><code>m~1~</code></td>
<td><code>m~2~</code></td>
</tr>
<tr><th></th>
<td><code>"Give S a 100"</code></td>
<td><code>"Give S a 90"</code></td>
</tr>
</tbody>
</table>
</center>

Oh no.
I don't know which message came from Dr. Stuart.
How am I supposed to know which grade to give S?
Dr. Stuart and I could find some other way to communicate beyond email, but that
would be just as absurd as a 10 point deduction.

Dr. Stuart decides to put a signature on all his messages to me (more than just
the classic "BLS").
We mutually agree upon a **hash function** to use to sign our messages.

A hash function is a one-way function that creates a unique identifier that can
be used to describe messages.
Let's say I wanted to create a hash function to create unique identifiers for
students in my class.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th></tr></thead>
<tbody>
<tr><th></th><td>H(Student) = First letter of their first name</td></tr>
<tr><th></th><td>H(Alice) = A</td></tr>
<tr><th></th><td>H(Joe) = J</td></tr>
</tbody>
</table>
</center>

As you can see, <code>H(Joe)</code> will always produce <code>J</code>.
This is a different value from <code>H(Alice)</code> which will always produce
<code>A</code>.
If a student were to tell me their name and I asked for the first letter of
their name to verify who it was, I would know if Joe was pretending to be Alice
since <code>H(Alice) != J</code>.

However, this is a very bad hash function.
If I have a student in the class named "Alex", then we have a collision.
Both <code>H(Alice) = A</code> and <code>H(Alex) = A</code>.
Even though this is a bad hash function, if a student were to come up to me and
say <code>H(_me_) = A</code>, I would have no way of knowing if their name was
Alex or Alice.

Let's go back to our scenario.
Dr. Stuart and I mutually decide upon a hash function to use to sign our
messages.
We can't use <code>H(m) = First letter of their first name</code> because our
messages aren't about names.
The hash function must have some connection to the message.
Instead, we decide to use <code>H(m) = length of the message</code>.

<center>
<img src="crypto/rsasig_hashsetup.png">
</center>

Dr. Stuart is going to compute the hash of his message.
He then needs to send me this message in such a way that tells me which grade
he wants to give the student.
How should he send me this message?
Let's again look at who knows what, now with our angry student included.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead>
<tr><th></th>
<th>Dr. Stuart can <br> encrypt with</th>
<th>Student can <br> encrypt with</th>
<th>Charlie can <br> decrypt with</th>
</tr>
</thead>
<tbody>
<tr><th></th>
<td><code>e~S~</code></td>
<td><code>e~S~</code></td>
<td></td>
</tr>
<tr><th></th>
<td><code>e~B~</code></td>
<td><code>e~B~</code></td>
<td></td>
</tr>
<tr><th></th>
<td><code>e~C~</code></td>
<td><code>e~C~</code></td>
<td><code>d~C~</code></td>
</tr>
<tr><th></th>
<td><code>d~B~</code></td>
<td></td>
<td><code>e~B~</code></td>
</tr>
<tr><th></th>
<td></td>
<td><code>d~S~</code></td>
<td><code>e~S~</code></td>
</tr>
<tr><th></th>
<td></td>
<td></td>
<td><code>e~C~</code></td>
</tr>
</tbody>
</table>
</center>

Dr. Stuart _could_ use my public key for me to decrypt with my private key
again, but the student also can use my public key.
I wouldn't be able to tell them apart.

For the signature, Dr. Stuart will encrypt the hashed message with his private
key.
I will then decrypt it with his public key.

<center>
<img src="crypto/rsasig_hashsent.png">
</center>

Now you may think, "Wait, then the student will also be able to read the hashed
message. That's illegal!"
To which I say, you're right!
However, you need to remember that Dr. Stuart is encrypting the hashed message
with his private key, not the actual message.
This means all the student will see is <code>11</code> since
<code>H(Give S a 90) = 11</code>.
This is not enough information for the student (or anyone) to know what grade
the student received or which student is being talked about.
Dr. Stuart's message could have been about giving Joe a 80 on his assignment
since <code>H(Give J a 80) = 11</code>.

Even though anyone can read the hash, how can I be sure Dr. Stuart sent it?
Let's look at the four messages again.
Who could have sent them?
Who could have read them?

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th>
<th>Message</th>
<th>Encrypted <br> Message</th>
<th>Who Can <br> Encrypt?</th>
<th>Who Can <br> Decrypt?</th>
</tr></thead>
<tbody>
<tr><th></th>
<td><code>"Give S a 90"</code></td>
<td><code>E( m~B~, e~C~ )</code></td>
<td>Charlie <br> Dr. Stuart <br> Student</td>
<td>Charlie</td>
</tr>
<tr><th></th>
<td><code>"11"</code></td>
<td><code>E( H(m~B~), d~B~ )</code></td>
<td>Dr. Stuart</td>
<td>Charlie <br> Dr. Stuart<br> Student</td>
</tr>
<tr><th></th>
<td><code>"Give S a 100"</code></td>
<td><code>E( m~S~, e~C~ )</code></td>
<td>Charlie <br> Dr. Stuart <br> Student</td>
<td>Charlie</td>
</tr>
<tr><th></th>
<td><code>"12"</code></td>
<td><code>E( H(m~S~), d~S~ )</code></td>
<td>Student</td>
<td>Charlie <br> Dr. Stuart <br> Student</td>
</tr>
</tbody>
</table>
</center>

Now I can read through the four messages I have received: "Give S a 90", "Give
S a 100", "11", and "12".
I calculate the hash of each message: 11, 12, 2, and 2.
Since I didn't receive a "2" message, I know that "11" and "12" must be the
signatures that Dr. Stuart and the student sent.
Only Dr. Stuart could have sent me the message "11" (since only he knows his
private key).
Only the student could have sent me the message "12" (since only they know their
private key).
Even though anyone could have sent me the message "Give S a 90", I know it has
to be from Dr. Stuart.
Only Dr. Stuart knows the message he wanted to send, which means only Dr. Stuart
could calculate its hash and send it to me with his private key.

<center>
<img src="crypto/rsasig_calc.png">
</center>

(I had to abandon my though cloud, the text wouldn't fit, but you get the gist)
There's still a lot of text there, a lot of math, and a lot of parentheses.
Let's go through it slowly and hopefully it'll be easier to digest.

<center>
<table>
<colgroup><col span="1" class="red"></colgroup>
<thead><tr><th></th><th></th><th></th></tr></thead>
<tbody>
<tr><th></th>
<td><code>m~B~</code></td>
<td class="left">Dr. Stuart writes a message</td>
</tr>
<tr><th></th>
<td><code>H(m~B~)</code></td>
<td class="left">Dr. Stuart calculate the hash of his message</td>
</tr>
<tr><th></th>
<td><code>E(m~B~, e~C~)</code></td>
<td class="left">Dr. Stuart encrypts his message with<br>my public key</td>
</tr>
<tr><th></th>
<td><code>E(H(m~B~), d~B~)</code></td>
<td class="left">Dr. Stuart encrypts the hash of his message<br>with his private key</td>
</tr>
<tr><th></th>
<td><code>E(m~B~, e~C~)</code></td>
<td class="left">I receive a random encrypted message</td>
</tr>
<tr><th></th>
<td><code>D(E(m~B~, e~C~), d~C~) = m~B~</code></td>
<td class="left">I decrypt this message from anyone with my<br>private key</td>
</tr>
<tr><th></th>
<td><code>H(D(E(m~B~, e~C~), d~C~)) = H(m~B~)</code></td>
<td class="left">I calculate the hash of this message from<br>anyone</td>
</tr>
<tr><th></th>
<td><code>E(H(m~B~), d~B~)</code></td>
<td class="left">I receive a random encrypted message</td>
</tr>
<tr><th></th>
<td><code>D(E(H(m~B~), d~B~)) = H(m~B~)</code></td>
<td class="left">I decrypt this message from Dr. Stuart with his<br>public key</td>
</tr>
<tr><th></th>
<td><code>H(D(E(m~B~, e~C~), d~C~)) = D(E(H(m~B~), d~B~))</code><br>
<code>H(m~B~) = H(m~B~)</code></td>
<td class="left">I verify that the first message from "anyone"<br>came from Dr. Stuart</td>
</tbody>
</table>
</center>

This process works for anyone.
It doesn't matter if I send the message to Dr. Stuart or even if the student
sends another student a message.
The process is the same.
It all relies on everyone's <code>e</code> being public and everyone's
<code>d</code> being private.


---

## Certificates

It's time to grade!
Let me check my email to see if Dr. Stuart has sent me any updates.
I've recieved a message and a signature.
I use my public key to decrypt the message and see it says `"Give S a 90"`.
Hmmmm, let's check the signature to make sure this message came from Dr. Stuart.
I use Dr. Stuart's public key to decrypt his message.
And Dr. Stuart's public key is...
Uhm...
Well it's <code>e~B~</code>...
And <code>e~B~</code> is equal to...
Well, I'm sure Dr. Stuart told me once, but it appears I've fallen into the classic trap of not actually paying attention to him when he talks.
I should really start listening to him more.
It turns out that when professors talk, they say important things that I need to know later.

<center>
<img src="crypto/certificate_setup.png">
</center>


Well, what do I do now?
I've completely forgotten Dr. Stuart's public key.
How will I ever be able to decrypt his signature?
I could ask Dr. Stuart for his public key again, but it would be really embarrassing to tell him I don't listen to him.

To do this, we introduce a **Certifying Authority**.
This is an authority that we both trust to authenticate each others public keys.
We'll say our Certifying Authority is Associate Department Head of the Computer Science Department, Professor Adelaida Medlock.
(I 






---

## Practice

You're probably expecting to see some clicky JS thing I scrambled together so
you can get the instant gratification of a "right" or "wrong" answer.
Instead, here are some more "situations" for you to think about and muddle over.

The student can decrypt <code>E(H(m~B~), d~B~)</code> and tries to fool me.
The student decrypts the hash and sends me <code>E(H(m~B~), d~S~)</code>.
Would I be fooled into thinking Dr. Stuart sent me the message "Give S a 100"
instead of "Give S a 90"?
Why or why not?
