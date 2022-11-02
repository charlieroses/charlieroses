Now we know the roles the operating system plays, but what is it
responsible for getting done. There are plenty of responsibilities that
I don't cover in this section, but I wanted to give a general
understanding of the range of things operating systems deal with, since
Windows and MACOS do a lot of extra things.

---

## Hardware

So this section is honestly just easier to list out.

CPU

Input and Output Devices

-   Provides common devise interface tasks
-   Hides device details
-   Establish access to a device
-   Manages exclusive access
-   Release a device
-   Read form a device
-   Write to a device
-   Grant access to a device
-   Provide special device operations

Memory

-   Assigns areas of memory belonging to processes to areas of physical
    space
-   -   Manages requests that are greater than available memory
-   Controls sharing of memory
-   Direct allocation requests
-   Direct freeing of memory
-   Serving memory needs implicit in other services
-   Managing sharing of areas of memory
-   This is a large part of "resource management"

---

## File Systems

We're not going to go incredibly in depth as to how file systems work in
this course. You've been interacting with file systems your whole
computer life though. You've been interacting a little more in depth in
this course on Tux with the command line. One of the great things your
operating system does is it manages a lot of this file stuff. It manages
the names of files and the storage of them. It also covers the basic
file services, which I'll list below.

-   Opening files
-   Closing files
-   Reading files
-   Writing to files
-   Seeking in a file
-   Querying and modifying file parameters

---

## Processes

Before we start, a process can be simply known as the execution of code.
While, in a single program, only one line of code will execute at a
time, we can run multiple programs at the same time. In one program, it
is very simple to make sure that memory locations aren't been written
over each other, and the programmer can handle that for the most part.
However, when we run multiple programs at the same time, we run into the
issue of resource management. This was also touched upon in the previous
section about how the operating system acts as a resource manager. With
these processes, the OS deals with the management of memory and
resources, like mentioned above. The OS also deals with the execution of
these programs. In a "breaking the fourth wall" moment, the OS also
deals with the execution of the programs that makes the OS. I've listed
below a few different things that the OS also deals with in terms of
processes.

-   Creating processes
-   Destroying processes
-   Changing priorities of processes
-   Providing interprocess communication
-   Process synchronization

---

## Security

If you read above, you'll see we already touch upon aspects of security.
The operating system frequently manages permissions between users and
what they can access. It also manages processes and making sure they
don't write over each other. There's also the more common aspect of
security that is what normally comes to mind in the digital age. When an
OS recieves a network request, the OS deals with the authentication of
that and the security policies surrounding those requests.

---

## Other Areas



