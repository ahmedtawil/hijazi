"use strict";


// Class definition
var KTDeleteCart = function () {

    const deleteCart = () => {

    }



    const save = () => {
        return $('.save').on('click', function (e) {
            e.preventDefault()
            Swal.fire({
                text: "هل تريد حفظ الطلبية ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(async function (result) {
                if (result.isConfirmed) {

                    // Enable submit button after loading
                    const res = await fetch(`/cart/save`)
                    const save = await res.json()
                    if (save.success) {
                        Swal.fire({
                            text: "تم حفظ الطلبية بنجاح!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "حسنا",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                // Hide modal
                                window.location = '/items/page/get'
                                // Enable submit button after loading

                            }
                        })
                    }else{
                        Swal.fire({
                            text: "فشل في حفظ الطلبية!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "حسنا",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        })
                    }



                }
            })
        })

    }












    return {
        // Public functions
        init: function () {
            save()
        }
    };
}();









// On document ready
KTUtil.onDOMContentLoaded(function () {

    KTDeleteCart.init();
});

                                                                                                                                                              