"use strict";

// Class definition
var KTitemsList = function () {
    // Define shared variables

    
   
    $('.color').on('click' , function (e) {
        const itemid = $(this).attr('itemid')
        const colorURL = $(this).find('img').attr('src')
        $(`#${itemid}`).css('background-image' , `url(${colorURL})`)
        $(this).attr('active' , true)     
        $(`[colorGroupid=${itemid}] .color`).each(function(i, obj) {
                $(obj).css('border' , '0')
        });
        $(this).css('border' , '1px solid blue')
    })
    // Public methods
    return {


        init: function () {

        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTitemsList.init();

});