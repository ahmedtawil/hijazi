"use strict";
// Class definition
var KTModalAddItemToCart = function () {
    var submitButton;
    var cancelButton;
    var closeButton;
    var validator;
    var form;
    var modal;
    let cartData
    let item
    let itemID
    let itemFromDb
    let modal_item_title
    let modal_color_img
    let custom_size = false
    let height_size = 0
    let height_unit = 'yard'
    let width_size = 0
    let width_unit = 'yard'

    let currentTotals
    $(document).ready(async function () {
        await getPaymentMethodData()

    });

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
                            _id: item._id,
                            title: item.title,
                            color: $('#color option:selected').val(),
                            img: $('#modal_color_img').attr('src'),
                            size: $('#size option:selected').val() || null,
                            qty: $("input[name=qty]").val(),
                        }
                        if (payload.size == 'custom') {
                            payload.height_size = height_size
                            payload.height_unit = height_unit

                            payload.width_size = width_size
                            payload.width_unit = width_unit

                        }

                        $.post(`/cart/item/index/edit/${itemID}`, payload).then(recipientID => {
                            submitButton.removeAttribute('data-kt-indicator');

                            Swal.fire({
                                text: "تم تعديل المنتج بنجاح!",
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
                                    form.reset()
                                    location.reload();


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

    const getCartItemByIndex = async (index) => {
        const res = await fetch(`/cart/item/index/get/${index}`)
        return await res.json()
    }
    const getItemById = async (id) => {
        const res = await fetch(`/item/get/${id}`)
        return await res.json()
    }



    const getColorById = (id) => {
        return itemFromDb.colors.filter(si => si.color._id == id)[0]
    }


    $('.edit').on('click', async function (e) {
        e.preventDefault()
        form.reset()


        itemID = $(this).attr('itemid')
        item = await getCartItemByIndex(itemID)
        itemFromDb = await getItemById(item._id)

        $('#color').empty()
        itemFromDb.colors.forEach(color => {
            $('#color').append($('<option/>', {
                value: color.color._id,
                text: color.color.name
            }));
        })
        const is_custom_size = (isNaN(item.size) || item.size == null) ? true : false

        $('#modal_item_title').text(item.title)
        $('#color').val(item.color._id).change()
        $('#qty').val(item.qty)
        if (is_custom_size) {
            $("#size").prop('value', 'custom').change();
            $("#height_unit").prop('value', item.height.unit).change();
            $("#width_unit").prop('value', item.width.unit).change();

            $('#height_size').val(item.height.size)
            $('#width_size').val(item.width.size)

        } else {
            $("#size").prop('value', item.size).change();
            $("#height_unit").prop('selectedIndex', 0).change();
            $("#width_unit").prop('selectedIndex', 0).change();
            $('#height_size').val(0)
            $('#width_size').val(0)
        }
        $('#modal_color_img').attr('src', item.img)
        await triggerPriceCalc()

        $('#kt_modal_edit_item_from_cart').modal('toggle');

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

    const triggerPriceCalc = async () => {
        let price = 0
        const defaultSize = $('#size option:selected').val()
        const qty = $('#qty').val()
        if (defaultSize != 'custom') {
            price = await calcPrice([{ unit: 'yard', size: defaultSize }])
        } else {
            height_size = $('#height_size').val()
            height_unit = $('#height_unit option:selected').val()

            width_size = $('#width_size').val()
            width_unit = $('#width_unit option:selected').val()
            price = await calcPrice([{ unit: height_unit, size: height_size }, { unit: width_unit, size: width_size }])
        }
        $('#price').html(`${price} * ${qty} = ${(price * qty).toFixed(2)}`)
    }

    $('.calcPrice').on('change keyup', async function (e) {
        await triggerPriceCalc()
    })

    const getCartTotals = async () => {
        const res = await fetch('/cart/totals/data/get')
        return await res.json()
    }
    $('#payment_method').on('change', async function (e) {
        const payment_method = $(this).val()
        const batch_amount_block = $('#batch_amount_block')
        console.log($('#batch_amount').val());
        if (payment_method == 'batch') {
            const batch_amount = $('#batch_amount').val()
            cartData.paidAmount = parseFloat(batch_amount)
            cartData.paymentMethod = 'batch'
            batch_amount_block.removeClass('d-none')
        } else {
            cartData.paidAmount = cartData.finalAmount
            cartData.paymentMethod = 'cash'
            batch_amount_block.addClass('d-none')
        }
        //console.log(`$('#payment_method').on('change', async function (e) {`);
        updateTotals()
    })

    $('#batch_amount').on('change keyup', function (e) {
        const val = $(this).val()
        console.log(val);
        cartData.paidAmount = parseFloat(val)
        //console.log(`$('#batch_amount').on('change keyup', function (e) {`);
        updateTotals()
    })

    const updateTotals = async () => {
        const { totalAmount = 0, discount = 0, paidAmount = 0, paymentMethod = null } = cartData
        const finalAmount = (totalAmount - discount).toFixed(2)
        const moneyBack = (paidAmount - (totalAmount - discount)).toFixed(2)
        $('#totalAmount').html(`${totalAmount.toFixed(2)} شيكل`)
        $('#discount').html(`${discount.toFixed(2)} شيكل`)
        $('#finalAmount').html(`${finalAmount} شيكل`)
        $('#paidAmount').html(`${paidAmount.toFixed(2)} شيكل`)
        $('#moneyBack').html(`${moneyBack} شيكل`)
        cartData = await updateCart(cartData)
    }

    const updateCart = async ({ totalAmount, discount, paidAmount, paymentMethod }) => {
        const res = await fetch('/cart/totals/data/update', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ totalAmount, discount, paidAmount, paymentMethod })
        })
        return await res.json()
    }

    const getPaymentMethodData = async () => {
        cartData = await getCartTotals()
        console.log(cartData);
        const batch_amount_block = $('#batch_amount_block')
        const payment_method = $('#payment_method')

        if (!cartData.paymentMethod) {
            batch_amount_block.addClass('d-none')
            cartData.paidAmount = 0
        }
        if (cartData.paymentMethod == 'batch') {
            $('#batch_amount').val(cartData.paidAmount)
            payment_method.val('batch').change()
            batch_amount_block.removeClass('d-none')
        } else {
            payment_method.val('cash').change()
            batch_amount_block.addClass('d-none')
        }


    }


    return {
        // Public functions
        init: function () {
            // Elements
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_edit_item_from_cart'));

            form = document.querySelector('#kt_modal_edit_item_from_cart_form');
            submitButton = form.querySelector('#kt_modal_edit_item_from_cart_submit');
            cancelButton = form.querySelector('#kt_modal_edit_item_from_cart_cancel');
            closeButton = form.querySelector('#kt_modal_edit_item_from_cart_close');
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

