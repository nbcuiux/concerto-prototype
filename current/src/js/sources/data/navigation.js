function handleMenuClick(e) {
    console.log($('#leavePagePrompt').length);
    if ($('#leavePagePrompt').length > 0) {
        e.stopPropagation();
        e.preventDefault();

        var linkText = $(e.target).text(),
            linkSrc = e.target.href;

        console.log(linkText, linkSrc);

        //Inbund actons from buttons
        $('#leavePagePrompt .buttons').unbind('click');

        //Set confirmation button
        $('#leavePage').text('Go to ' + linkText).click(function() {window.location.href = linkSrc;});

        //Set cancelation button
        $('#cancelLeavePage').click(function() {$('#leavePagePrompt').toggleClass('hidden modal');});

        //Show confirmation prompt
        $('#leavePagePrompt').toggleClass('hidden modal');
    }
}
