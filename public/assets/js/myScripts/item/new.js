"use strict";
// Class definition
var KTModalProductCategoryAdd = function () {
    var submitButton;
    var cancelButton;
    var closeButton;
    var validator;
    var validator1;
    var form;
    var modal;
    var formData = new FormData()


    // Init form inputs
    var handleForm = function (event) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        let arr = [];

        var addImage = document.getElementById("addImage")
        addImage.addEventListener('click', function (e) {

            if (validator1) {
                validator1.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        
                        e.preventDefault();
                        var color = $('#color option:selected').val()
                        var colorTitle = $('#color option:selected').text()
                        var image = document.getElementById("image")
                        var imageBlock = document.getElementById("imageBlock")

                        // Your existing code unmodified...
                        var iDiv = document.getElementById('kt_ecommerce_edit_order_selected_items');
                        // Now create and append to iDiv

                        const [file] = image.files
                        arr.push({
                            color,
                            image: file
                        })
                        var innerDiv = document.createElement('div');
                        innerDiv.className = 'block-2';
                        innerDiv.innerHTML = `اللون : ${colorTitle} الصورة : <img id="blah" width="50" height="50" style="margin:5px" src="${URL.createObjectURL(file)}" alt="your image"/>`;
                        document.getElementById("color").value = ''
                        document.getElementById("image").value = ''
                        imageBlock.style = ""

                        // The variable iDiv is still good... Just append to it.
                        iDiv.appendChild(innerDiv);
                        

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



        })

        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'title': {
                        validators: {
                            notEmpty: {
                                message: 'اسم المنتج مطلوب'
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
        );
        validator1 = FormValidation.formValidation(
            form,
            {
                fields: {
                    'color': {
                        validators: {
                            notEmpty: {
                                message: 'اسم اللون مطلوب'
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
        );


        /*

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
                        // const payload = {
                        //     title: $("input[name=title]").val(),
                        //     colors: arr,

                        // }
                        formData.append('title', $("input[name=title]").val())
                        
                        arr.forEach(function(item) {
                            formData.append("colorTitle" , item.color);
                            formData.append("image" , item.image);
                        });
                        $.ajax({
                            url: "/item/new", 
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(data) {
                                Swal.fire({
                                    text: "تم إضافة المنتج بنجاح!",
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
                                        window.location = '/items/page/get'
    
                                    }
                                })                   
                                     }
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
                    window.location = `/items/page/get`
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
                    window.location = `/items/page/get`


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

    return {
        // Public functions
        init: function () {
            // Elements
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_add_item'));

            form = document.querySelector('#kt_modal_add_item_form');
            submitButton = form.querySelector('#kt_modal_add_item_submit');
            cancelButton = form.querySelector('#kt_modal_add_item_cancel');
            closeButton = form.querySelector('#kt_modal_add_item_close');



            handleForm();
        }
    };
}();





// On document ready
KTUtil.onDOMContentLoaded(function () {

    KTModalProductCategoryAdd.init();
});

