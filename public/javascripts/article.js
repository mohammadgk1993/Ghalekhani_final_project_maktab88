$(() => {
    $("#create-comment").on("click", async function() {
        const body = {
            content: $("#content").val(),
            article: $("#article-id").val()
        }

        await $.post("http://localhost:3000/comment/",
        body,
        async (data) => {
            console.log(data)
            $("iframe").attr("src", `http://localhost:3000/comment/all?article=${$("body").attr("id")}`)
            // location.reload()
        })
    })

    $("button.delete-article").on("click", function () {
        const id = $(this).attr('id')

        fetch(`http://localhost:3000/article/${id}`, {
            method:'DELETE'
        })
        .then(res => {
            location.href = 'http://localhost:3000/article/all'
        })
    })

    $('button.pagination').on('click', function() {
        console.log($(this).text())
        document.location.href = 
        `http://localhost:3000/article/all?page=${$(this).text()}`
    })
})