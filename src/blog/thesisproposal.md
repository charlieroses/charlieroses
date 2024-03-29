# Undergraduate Thesis Proposal

On December 10th, I successfully proposed my undergraduate thesis to my
committee. Given this is an undergraduate thesis, not a graduate thesis, I
didn't have much a choice in whether or not I succeeded. I have to graduate in
June of 2022 whether my thesis is good or not. I'm measuring success not by if I
have to propose again, but instead by how the proposal went and how prepared I
was.

I can't say I expected the proposal to go as well as it did. I've been busy with
researching grad schools, preparing the proposal, my own undergraduate finals,
and preparing final grades for my 360 freshmen. For the past few weeks, I've had
the incredibly healthy sleep schedule of 5am to 8am. I even mentioned to my
advisor it was a little unfair I was experiencing the stress of grad school and
the stress of grad school applications at the same time. He just laughed.
Despite all the stress I still managed to pull off a pretty good presentation
after a whopping 0 hours of sleep. I can confidently say I'm prepared to do this
again in graduate school.

I figured I'd take the time to write about the process, post my slides, and
explain things the slides don't capture very well.

!![Winona, my pitbull, laying on my bed on top of some research papers after deciding she is more important](winona.jpg)

Plan 9 is an operating system written at Bell Labs in the 1980s. It's been
coined as "More-Unix-Than-Unix" in how far the phrase "everything is a file"
really goes. The authors, Ken Thompson, Rob Pike, Dave Presotto, and Phil
Winterbottom, wanted to see if they could address the issues they saw with the
growth of UNIX. As the operating system developed, they began to use it
exclusively at Bell Labs. It never became a mainstream operating system. It was
under a very tight license until 2000 when it was released as open source. In
2012, Richard Miller wrote a port of Plan 9 for the Raspberry Pi. This became a
popular platform to use Plan 9 on. In 2015, the Raspberry Pi Foundation released
the 7 inch touch screen for the Pi. This is not compatible with Miller's port.
My research has two main focuses. First, I'll be implementing the 7 inch screen
as a traditional computer monitor. Additionally, I'll be researching the touch
screen aspect of the screen and if it's possible to implement it with the unique
usage of the mouse in Plan 9.

My literature review was a little less than traditional. The only formal
literature I could find was written almost entirely by Rob Pike. It was
primarily the documentation he wrote when Plan 9 was released. This was greatly
beneficial to understanding the original intentions and principles of Plan 9. I
want my implementations to be as seamless as possible. The other large part of
my lit review was trying to address my problem specifically. Why hadn't anyone
implemented this yet? What were other touch screen solutions? Those questions
had me searching through years of email archives and Reddit posts to no avail.
I found some implementations for other screens on other ports. As far as I can
tell the reason no one's written a driver for the 7 inch touch screen is because
no one has needed to yet. I was able to find a few ideas for how to utilize the
touch screen.

In my rabbit hole of email archives, I found the never ending drama surrounding
Plan 9. There is a lot of strong opinions and controversy in the Plan 9
community about the design, implementation, and interface. I'm going to make it
a point to stay as far away from this as possible. I could write a second thesis
specifically about the opinions of the group and if there is a solution. To stay
on topic, I want to prioritize making my implementations a patch on
[9legacy](http://9legacy.org/)
and following their mentality, _"We strongly believe it is not a good idea to
fork Plan 9 from Bell Labs. Too many communities is the enemy of the community.
Plan 9 from Bell Labs is and will always be the reference distribution of Plan
9"_. In some ways, this could be considered taking a stance in the discussion. I
just want to extend the existing Plan 9, not create a new operating system.

My slide deck covers the actual usage of the mouse in Plan 9. To summarize, a
three button mouse is absolutely necessary. It is possible to use a two button
mouse and use the Shift key as a toggle. The Mac port of Plan 9 allows for the
one button touchpad to be used with the CMD and Alt keys as toggles. All three
mouse buttons are heavily used in a variety of ways. All buttons can be used for
clicking, double clicking, sweeping (clicking and dragging), and chording (using
multiple mouse buttons in sequence). How do I capture such a wide array of
behaviors with a touch screen?

As of right now, my approach will be to have two external buttons to toggle
the type of mouse button being used. Users on the email thread mentioned
struggling with chording in this approach. There is also the approach of using a
stylus. Plan 9 does have a port for the COMPAQ IPAQ, a personal digital
assistant from 2000. This used a stylus to interact with the touch screen. This
framework already exists and is named "bitsy". It may be possible to take a
similar approach using a stylus with the 7 inch screen. People in the email
threads also mentioned the possibility of using multi-touch. Tapping the screen
in a variety of ways with a variety of finger positions to emulate the mouse. I
will not be taking this into account. First, I think fingers are already too
large and inaccurate to be using on the small screen. Then to include multiple
fingers would be overwhelming. I also don't think it's possible to be able to
capture all the behavior necessary with multitouch.

From there, the committee didn't have many questions. The main question was
asking for a timeline of deliverables and back up plans. Right now, the plan is
to have the screen functioning as a monitor by the end of the winter term
(late March). From there, see if it's possible to utilize the touch screen, and
then implement it. Overall, they said they were impressed.

The experience was fun, but surprisingly manageable. I spent so long stressing
about the proposal, but once I got going, I didn't stop. You can find my
[[slide deck here]](../../research/files/proposal.pdf).
I designed the slides based on the acme editor. I used Google Docs to write the
slides since it was 4am. I'm working on making a proper acme beamer template for
future presentations. I'm almost done that and I'll get that posted over the
winter break between classes. I also need to clean up my rio code and post that
soon. I'll use this upcoming break to clean up the work I've done so far and get
moving towards the next phase of research in the winter.
