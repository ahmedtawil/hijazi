"use strict";

// Class definition
var KTitemsList = function () {
    // Define shared variables

    
   
    $('.color').on('click' , function (e) {
        const itemid = $(this).attr('itemid')
        const colorURL = $(this).find('img').attr('src')
        $(`#${itemid}`).css('background-image' , `url(${colorURL})`)
        $(`[colorGroupid=${itemid}] .color`).each(function(i, obj) {
                $(obj).attr('active' , false) 
        });
        $(this).attr('active' , true)     
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