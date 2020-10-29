function get_random_color() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function change_color() {
    let random_color = get_random_color()
    $(".inner").offsetParent().css('background-color', random_color)
}

function change_width() {
    $("#list_1 .list_item").width(function(i,val) {
        return val + 10;
    })
}


let text_to_detach;
let text_to_remove;
function clear_text() {
    text_to_detach = $("#text_to_detach").detach()
    text_to_remove = $("#text_to_remove").remove()
}

function recover_text() {
    if ( text_to_detach ) {
        text_to_detach.appendTo(".container")
    }
    if ( text_to_remove ) {
        text_to_remove.appendTo(".container")
    }
}

function check_checkboxes() {
    let checkbox = $('.form_with_checkboxes input:checkbox')
    if( checkbox.is(":checked") ) {
        checkbox.prop('checked', false)
    } else {
        checkbox.prop('checked', true)
    }
}

function undelegate() {
    $(".background_changer_parent").undelegate(".background_changer", "click")
}

$("#text_to_click").click(function () {
    let text_to_hide = $("#text_to_hide")
    if (text_to_hide.is(":hidden")) {
        text_to_hide.show("slow")
    } else {
        text_to_hide.hide("slow")
    }
})

$("#text_to_detach").click(function() {
    console.log("text_to_detached clicked")
})

$("#text_to_remove").click(function() {
    console.log("text_to_remove clicked")
})

$(".background_changer_parent").delegate(".background_changer","click", function () {
    let color = get_random_color()
    $(".background_changer").css("background-color", color)
})

