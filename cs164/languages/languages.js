function interpretHTML()
{
    var userInText = window.embed.userHTMLIn.document.getElementById("userHTMLText");
    var output = window.embed.userHTMLOut.document.getElementById("outputDiv");

    output.innerHTML = userInText.value;
}
