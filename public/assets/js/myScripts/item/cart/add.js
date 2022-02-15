"use strict";
// Class definition
var KTModalAddItemToCart = function () {
    var submitButton;
    var cancelButton;
    var closeButton;
    var validator;
    var form;
    var modal;
    let item
    let modal_item_title
    let modal_color_img
    let custom_size = false
    let height_size = 0
    let height_unit = 'yard'
    let width_size = 0
    let width_unit = 'yard'

    // Init form inputs
    var handleForm = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/


        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'name': {
                        validators: {
                            notEmpty: {
                                message: 'اسم المورد مطلوب.'
                            }
                        }
                    },

                    'formalID': {
                        validators: {
                            notEmpty: {
                                message: 'رقم الهوية مطلوب'
                            }, checkValidFormalID: {
                                message: 'رقم الهوية غير صالح'

                            },
                            checkIfFormalIDExist: {
                                message: 'رقم الهوية موجود مسبقاً.'

                            }

                        }
                    },

                    'phoneNumber': {
                        validators: {
                            notEmpty: {
                                message: 'رقم الجوال مطلوب'
                            },
                            stringLength: {
                                min: 10,
                                max: 10,
                                message: 'رقم الجوال يجب أن يحتوي على 10 أرقام.'
                            },
                            checkValidPhoneNumber: {
                                message: 'رقم الجوال غير صالح'
                            }
                        }
                    },

                    'address': {
                        validators: {
                            notEmpty: {
                                message: 'عنوان المورد مطلوب'
                            }

                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );/*

		// Revalidate country field. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="country"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validator.revalidateField('country');
        });
*/
        // Action buttons
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable submit button whilst loading
                        submitButton.disabled = true;
                        const payload = {
                            name: $("input[name=name]").val(),
                            formalID: $("input[name=formalID]").val(),
                            phoneNumber: $("input[name=phoneNumber]").val(),
                            address: $("input[name=address]").val(),
                        }

                        $.post('/cart/add', payload).then(recipientID => {
                            submitButton.removeAttribute('data-kt-indicator');

                            Swal.fire({
                                text: "تم إضافة المورد بنجاح!",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    // Hide modal
                                    modal.hide();

                                    // Enable submit button after loading
                                    submitButton.disabled = false;
                                    window.location = '/suppliers/page/get'

                                }
                            })
                        }).catch(err => {
                            Swal.fire({
                                text: errDisplay(err),
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });

                            submitButton.removeAttribute('data-kt-indicator');
                            submitButton.disabled = false;
                        })

                    } else {
                        Swal.fire({
                            text: "حصل خطأ ما ، يرجى المحاولة مرة أخرى!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "حسنا",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        submitButton.removeAttribute('data-kt-indicator');

                    }
                });
            }
        });

        cancelButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "هل تريد إلغاء العملية ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal	
                    window.location = `/suppliers/page/get`
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "لم يتم إلغاء نموذج الإضافة!",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسنا",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        closeButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "هل أنت متأكد من إلغاء العملية ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal	
                    window.location = `/suppliers/page/get`


                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "لم يتم إلغاء العملية!",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسنا",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        })
    }

    const getItemById = async (id) => {
        const res = await fetch(`/item/get/${id}`)
        return await res.json()
    }

    const getSelectedColorId = () => {
        let id = null
        $(`[colorGroupid=${item._id}] .color`).each(function (i, obj) {
            if ($(obj).attr('active') == 'true') {
                id = $(obj).attr('colorId')
            }
        });
        return id
    }

    const getColorById = (id) => {
        return item.colors.filter(si => si.color._id == id)[0]
    }


    $('.addToCart').on('click', async function (e) {
        e.preventDefault()

        const itemID = $(this).attr('itemid')
        item = await getItemById(itemID)
        let colorId = getSelectedColorId()
        let color = getColorById(colorId)
        if (colorId == null) {
            color = item.colors[0]
        }

        $('#color').empty()
        item.colors.forEach(color => {
            $('#color').append($('<option/>', {
                value: color.color._id,
                text: color.color.name
            }));
        })

        $('#modal_item_title').text(item.title)
        $('#color').val(color.color._id).change()
        $('#modal_color_img').attr('src', color.image)

        $('#kt_modal_add_item_to_cart').modal('toggle');

    })
    $('#color').on('change', function (e) {
        const optVal = $(this).val()
        const color = getColorById(optVal)
        $('#modal_color_img').attr('src', color.image)
    })

    $('#size').on('change', async function (e) {
        const optVal = $(this).val()
        const custom_size_block = $('#custom_size_block')
        if (optVal == 'custom') {
            custom_size_block.removeClass('d-none')
            custom_size = true
        } else {
            custom_size_block.addClass('d-none')
            custom_size = false
        }

    })

    const calcPrice = async (data) => {
        const res = await fetch('/price/calculate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(data)
        });
        const price = await res.json()
        return price.toFixed(2)
    }

    const triggerPriceCalc = async ()=>{
        let price = 0
        const defaultSize = $('#size option:selected').val()
        if(defaultSize != 'custom'){
            price = await calcPrice([{unit:'yard' , size:defaultSize}])
        }else{
             height_size = $('#height_size').val()
             height_unit = $('#height_unit option:selected').val()

             width_size = $('#width_size').val()
             width_unit = $('#width_unit option:selected').val()
             console.log(width_size , width_unit);
             price = await calcPrice([{unit:height_unit , size:height_size} , {unit:width_unit , size:width_size}])
        }
        $('#price').html(`${price} شيكل`)
    }
    triggerPriceCalc()
    $('.calcPrice').on('change keyup' , async function (e) {
        await triggerPriceCalc()
    })


    return {
        // Public functions
        init: function () {
            // Elements
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_add_item_to_cart'));

            form = document.querySelector('#kt_modal_add_item_to_cart_form');
            submitButton = form.querySelector('#kt_modal_add_item_to_cart_submit');
            cancelButton = form.querySelector('#kt_modal_add_item_to_cart_cancel');
            closeButton = form.querySelector('#kt_modal_add_item_to_cart_close');
            modal_item_title = form.querySelector('#modal_item_title');
            modal_color_img = form.querySelector('#modal_color_img');


            handleForm();
        }
    };
}();









// On document ready
KTUtil.onDOMContentLoaded(function () {

    KTModalAddItemToCart.init();
});

