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
        .then(res => {
            res.json()
            $("#myModal").css("display","none")
            console.log(updatedUser)
            location.reload()
        })
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

    // $(".close-article").on("click", function() {
    //     $("#myModal-article").css("display","none")
    // })

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

    $("#update-article").on("click", function() {
        const updatedArticle = {}
        
        if (!!$("#update-article-thumbnail").val()) updatedArticle.thumbnail = $("#update-article-thumbnail").val()
        if (!!$("#update-article-title").val()) updatedArticle.title = $("#update-article-title").val()
        if (!!$("#update-article-description").val()) updatedArticle.description = $("#update-article-description").val()
        if (!!$("#update-article-content-image").val()) updatedArticle.contentImages = $("#update-article-content-image").val()
        if (!!$("#update-article-content").val()) updatedArticle.content = $("#update-article-content").val()

        fetch(`/article/${$(".container").children().eq(0).attr("id")}`,
        {method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedArticle)
        })
        .then(res => res.json)
        .then(data => {
            console.log(data)
            document.location = `/article/${$(".container").children().eq(0).attr("id")}`
        })
    })

    $("#show-delete-article").on("click", function() {
        console.log($(".container").children().eq(0).attr("id"))
        fetch(`/article/${$(".container").children().eq(0).attr("id")}`,
        {method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(res => {
            res.json()
            document.location.pathname = "/article/all"
        })
    })

    $("#admin-panel").on("click", function() {
        $("iframe").attr("src", "http://localhost:3000/view/admin")
    })
})