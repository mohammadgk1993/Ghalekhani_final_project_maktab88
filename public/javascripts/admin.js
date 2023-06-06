$(() => {
    $('button.pagination').on('click', function() {
        console.log($(this).text())
        document.location.href = 
        `http://localhost:3000/view/admin?page=${$(this).text()}`
    })

    $("button.delete").on("click", function() {
        $("#myModal-delete").css("display","flex")
    })

    $(".close-delete").on("click", function() {
        $("#myModal-delete").css("display","none")
    })

    $('button.delete').on('click', function() {
        const id = $(this).parent().parent().attr('id')
        $("button.yes").attr("id", id)
        $("#myModal-delete").css("display","flex")
    })

    $('button.yes').on("click", function() {
        const id = $(this).attr("id")
        fetch(`http://localhost:3000/user/${id}`, {
        method: 'DELETE'
        })
        .then(res => {
            $("#myModal-delete").css("display","none")
            location.reload()
            res.json()
        })
    })

    $('#no').on("click", function() {
        $("#myModal-delete").css("display","none")
    })
})