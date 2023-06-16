$(() => {
    let title = ''
    let content = ''

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

    $('#edit-thumbnail').on('click', function() {
        $('#thumbnail-input-file').trigger('click')
    })

    $('#thumbnail-input-file').on('change', function() {
        const fileInput = document.getElementById('thumbnail-input-file')
        // console.log(fileInput.files[0])
        const id = $('body').attr('id')
        const formData = new FormData()
        formData.append('thumbnail', fileInput.files[0])

        fetch(`http://localhost:3000/article/${id}`, {
            method: 'PATCH',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            location.reload()
        })
    })

    $('#add-content-images-btn').on('click', function() {
        $('#add-content-images-files').trigger('click')
    })

    $('#add-content-images-files').on('change', function() {
        const fileInput = document.getElementById('add-content-images-files')
        const id = $('body').attr('id')
        const formData = new FormData()

        for (const file of fileInput.files) {
            formData.append('contentImages', file);
        }

        fetch(`http://localhost:3000/article/${id}`, {
            method: 'PATCH',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            location.reload()
        })
    })

    $('button.image-delete-button').on('click', function() {
        const id = $('body').attr('id')
        const deleteSrc = $(this).parent().children().eq(0).attr('src')
        const imageSourcesArray = []
        for (let i = 0 ; i < $('.images').length ; i++) {
            imageSourcesArray.push($('.images').eq(i).attr('src'))
        }

        const filteredSources = imageSourcesArray.filter(item => item != deleteSrc)

        const form = new FormData()
        form.append("contentImages", JSON.stringify(filteredSources))

        fetch(`http://localhost:3000/article/${id}`, {
            method: 'PATCH',
            body: form
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            location.reload()
        })
    })

    $('#edit-title-button').on('click', function() {
        title = $('#article-title').val()
        $('#edit-title-yes').css('display','inline-block')
        $('#edit-title-no').css('display','inline-block')
        $('#article-title').removeAttr('readonly')
    })

    $('#edit-title-no').on('click', function() {
        $('#edit-title-yes').css('display','none')
        $(this).css('display', 'none')
        $('#article-title').val(title)
        location.reload()
    })

    $('#edit-title-yes').on('click', function() {
        const id = $('body').attr('id')
        const form = new FormData()
        form.append('title', $('#article-title').val())
        title = $('#article-title').val()

        if (!!title) {
            fetch(`http://localhost:3000/article/${id}`, {
            method: 'PATCH',
            body: form
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                location.reload()
            })
        } else {
            alert('title can not be empty!!!')
        }
    })

    $('#edit-content-button').on('click', function() {
        content = $('#article-content').val()
        $('#edit-content-yes').css('display','inline-block')
        $('#edit-content-no').css('display','inline-block')
        $('#article-content').removeAttr('readonly')
    })

    $('#edit-content-no').on('click', function() {
        $('#edit-content-yes').css('display','none')
        $(this).css('display', 'none')
        $('#article-content').val(content)
        location.reload()
    })

    $('#edit-content-yes').on('click', function() {
        const id = $('body').attr('id')
        const form = new FormData()
        form.append('content', $('#article-content').val())
        content = $('#article-content').val()

        if (!!content) {
            fetch(`http://localhost:3000/article/${id}`, {
                method: 'PATCH',
                body: form
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                location.reload()
            })
        } else {
            alert('title can not be empty!!!')
        }
    })
})