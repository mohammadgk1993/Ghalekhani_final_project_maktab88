$(() => {
    $("#update-user").on("submit",function (e) { 
        e.preventDefault();

        const updatedUser = {
        }

        if (!!$("#update-user-firstName").val()) updatedUser.firstName = $("#update-user-firstName").val()
        if (!!$("#update-user-lastName").val()) updatedUser.lastName = $("#update-user-lastName").val()
        if (!!$("#update-user-password").val()) updatedUser.password = $("#update-user-password").val()
        if (!!$("#update-user-phoneNumber").val()) updatedUser.phoneNumber = $("#update-user-phoneNumber").val()
        if (!!$("#update-user-gender").val()) updatedUser.gender = $("#update-user-gender").val()
        
        fetch(`/user/`,
        {method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUser)
        })
        .then(res => res.json())
    });

    $("#delete-user").on("submit",function (e) { 
        e.preventDefault();
        
        fetch(`/user/`,
        {method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(res => {
          console.log(res)
          document.location.pathname = "/user/login"
        })
    });

    $("#edit-photo-icon").on("click", () => {
        $("#fileToUpload").trigger("click")
    })

    $("#fileToUpload").on("change",() => {
        $("#myForm").trigger("submit")
    })

    $("#show-modal-btn").on("click", () => {
        $("#myModal").css("display","block")
    })
    
    $(".close").eq(0).on("click", () => {
        $("#myModal").css("display","none")
    })

    $("#show-user-delete").on("click", () => {
        $("#myModal-delete").css("display","block")
    })

    $(".close-2").eq(0).on("click", () => {
        $("#myModal-delete").css("display","none")
    })

    $(".close-2").eq(1).on("click", () => {
        $("#myModal-delete").css("display","none")
    })

    $("#show-user-info").on("click", () => {
        $("#myModal-info").css("display","block")
    })

    $(".close-3").eq(0).on("click", () => {
        $("#myModal-info").css("display","none")
    })
})