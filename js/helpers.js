function checkEnter(field, event) {
	var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if(theCode == 13) {
        const id = '#do-' + field.id.split('-')[0];
        $(id)[0].click();
		return false;
	} else {
		return true;
	}
}

function getName(input, btn, msg) {
	if (input.length === 0) {
		// Create fields to register
		btn.click(registerUsername);
		input.focus();
        return false;
	}
    // Try a registration
    input.attr('disabled', true);
    btn.attr('disabled', true).unbind('click');
    const username = input.val();
    if (username === "") {
        msg.removeClass().addClass('label label-warning')
            .html("Insert your display name");
        input.removeAttr('disabled');
        btn.removeAttr('disabled').click(registerUsername);
        return false;
    }
    if (/[^a-zA-Z0-9]/.test(username)) {
        msg.removeClass().addClass('label label-warning')
            .html('Input is not alphanumeric');
        input.removeAttr('disabled').val("");
        btn.removeAttr('disabled').click(registerUsername);
        return false;
    }

    return username;
}

// Helper to parse query string
function getQueryStringValue(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Helper to escape XML tags
function escapeXmlTags(value) {
	if (value) {
		var escapedValue = value.replace(new RegExp('<', 'g'), '&lt');
		escapedValue = escapedValue.replace(new RegExp('>', 'g'), '&gt');
		return escapedValue;
	}
}
