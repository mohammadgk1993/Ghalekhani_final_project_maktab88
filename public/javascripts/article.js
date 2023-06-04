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
})