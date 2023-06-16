$(() => {
    $("#update-user").on("submit",function (e) { 
        e.preventDefault();

        const updatedUser = {
        }

        if (!!$("#update-user-firstName").val()) {
            if (!/^[a-zA-Z ,']+$/i.test($("#update-user-firstName").val())) {
                alert('invalid value for firstname')
                return
            }

            updatedUser.firstName = $("#update-user-firstName").val()
        }

        if (!!$("#update-user-lastName").val()) {
            if (!/^[a-zA-Z ,']+$/i.test($("#update-user-lastName").val())) {
                alert('invalid value for lastName')
                return
            } 

            updatedUser.lastName = $("#update-user-lastName").val()
        }

        if (!!$("#update-user-password").val()) {
            if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test($("#update-user-password").val())) {
                alert('invalid value for password, password must have at least 1 character and 1 number')
                return
            }

            updatedUser.password = $("#update-user-password").val()
        }

        if (!!$("#update-user-phoneNumber").val()) {
            if (!/^(\+98)9\d{9}$/.test($("#update-user-phoneNumber").val())) {
                alert('invalid value for phone Number!!! correct phone number format: +98 9-- --- -- --')
                return
            }

            updatedUser.phoneNumber = $("#update-user-phoneNumber").val()
        }

        if (!!$("#update-user-gender").val()) updatedUser.gender = $("#update-user-gender").val()
        
        fetch(`/user/`,
        {method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUser)
        })
        .then(res => {
            res.json()
            $("#myModal").css("display","none")
            console.log(updatedUser)
            location.reload()
        })
    });

    $("#delete-user").on("submit",function (e) { 
        e.preventDefault();
        const id = $('body').attr('id')

        fetch(`/user/${id}`,
        {method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(res => {
          console.log(res)
          document.location.pathname = "/view/login"
        })
    });

    $("#edit-photo-icon").on("click", () => {
        $("#fileToUpload").trigger("click")
    })

    $("#fileToUpload").on("change",() => {
        $("#myForm").trigger("submit")
    })

    $("#show-user-setting").on("click", function() {
        $("#myModal-setting").css("display","flex")
    })

    $(".close-setting").on("click", function() {
        $("#myModal-setting").css("display","none")
    })

    $("#show-user-info").on("click", function() {
        $("#myModal-info").css("display","flex")
    })

    $(".close-info").on("click", function() {
        $("#myModal-info").css("display","none")
    })

    $("#show-user-update").on("click", function() {
        $("#myModal-update").css("display","flex")
    })

    $(".close-update").on("click", function() {
        $("#myModal-update").css("display","none")
    })

    $("#show-user-delete").on("click", function() {
        $("#myModal-delete").css("display","flex")
    })

    $(".close-delete").on("click", function() {
        $("#myModal-delete").css("display","none")
    })

    $("#create-article").on("click", function() {
        $("iframe").attr("src", `http://localhost:3000/view/create-article`)
    })

    $("#my-articles-btn").on("click", function() {
        $("iframe").attr("src", `http://localhost:3000/article/all?user=${$("body").attr("id")}`)
        $(this).css("background-color","#2F80ED")
        $(this).css("color","white")
        $("#explore-btn").css("background-color","#dedede")
        $("#explore-btn").css("color","#2F80ED")
    })

    $("#explore-btn").on("click", function() {
        $("iframe").attr("src", `http://localhost:3000/article/all`)
        $(this).css("background-color","#2F80ED")
        $(this).css("color","white")
        $("#my-articles-btn").css("background-color","#dedede")
        $("#my-articles-btn").css("color","#2F80ED")
    })

    $("#admin-panel").on("click", function() {
        $("iframe").attr("src", "http://localhost:3000/view/admin")
    })

    $("#create-article-form").on("submit", function() {
        if ($("#title").val().trim() == '') $("#create-article-form-error").val('title must not be empty')
        if ($("#content").val().trim() == '') $("#create-article-form-error").val('content must not be empty')
        if (!$("#thumbnail").val()) $("create-article-form-error").val('choose one file for thumbnail')
        if (!$("#contentImages").val()) $("create-article-form-error").val('At least choose one file for content images')

        return
    })
})