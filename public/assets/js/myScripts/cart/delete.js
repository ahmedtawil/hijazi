"use strict";


// Class definition
var KTDeleteCart = function () {

    const deleteCart = () => {

    }



    const deleteItemFromCart = () => {
        return $('.delete').on('click', function (e) {
            e.preventDefault()
            const itemID = $(this).attr('itemid')

            Swal.fire({
                text: "هل تريد حذف العنصر ؟",
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
                    const res = await fetch(`/cart/delete/item/${itemID}`)
                    const dleteItem = await res.json()
                    console.log(dleteItem);
                    if (dleteItem.success) {
                        Swal.fire({
                            text: "تم حذف العنصر بنجاح!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "حسنا",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                // Hide modal
                                location.reload();
                                // Enable submit button after loading

                            }
                        })
                    }else{
                        Swal.fire({
                            text: "فشل في حذف العنصر!",
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
            deleteCart()
            deleteItemFromCart()
        }
    };
}();









// On document ready
KTUtil.onDOMContentLoaded(function () {

    KTDeleteCart.init();
});
