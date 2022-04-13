So the operating system has a few different roles and purposes. This
section covers those different roles and what they mean.

---

## Resource Manager

If you actually read my little "History" section in the
[OSverview](os/intro.html), you'll recall I mentioned a desginated
*Almighty Computer Person* who was in charge of designating time for
programs to run on the computer. For the most part, this is very similar
to the function of a **resource manager**. Operating systems work as
resource managers in managing the physical resources and the memory that
each program uses. This makes sure everything stays where it needs to
stay and protects the system from attacks. What does this mean in a more
practical sense? Well, let's say we have program A and program B.
Resource managers means that these programs are going to operate in
separate chunks of memory. Let's say program A is an *evil program*.
This program A is going to edit the memory that program B is running on.
Program B will either crash now, or it will produce incorrect results.
Resource managers prevent this from happening.

---

## Service Provider

Operating systems also function as a service provider. Since operating
systems act as a bridge between hardware and the software that runs on
it, you could consider it as a piece of software that provides the
services of the hardware to the software and applcations we run on top
of it. This provides a common interface for applications to run on top
of.

---

## Virtual Machine

Above, we mention that the operating system acts as a service provider,
and one of the services it provides is a common interface for the
applications to run on top of. Looking at the operating system from the
perspective of an application, it draws no distinction between the
operating system and the hardware, since it has to use the OS to use the
hardware. This allows for flexibility in hardware design.


