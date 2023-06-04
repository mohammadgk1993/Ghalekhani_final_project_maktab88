$(() => {
    let currentValue = ''

    $('button.trash').on('click', function() {
        const id = $(this).attr('id')
        
        fetch(`http://localhost:3000/comment/${id}`, {
            method:'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            location.reload()
        })
    })

    $('button.edit').on('click', function() {
        currentValue = $(this).parent().parent().parent().children().eq(1).val()
        $(this).parent().parent().parent().children().eq(1).removeAttr('readonly')
        $(this).parent().parent().parent().children().eq(1).css('border','1px solid black')

        $(this).parent().children().eq(1).css('display','inline-block')
        $(this).parent().children().eq(2).css('display','inline-block')
    })

    $('button.accept').on('click', function() {
        const id = $(this).attr('id')
        const comment = $(this).parent().parent().parent().children().eq(1).val().trim()


        if (!!comment) {
            fetch(`http://localhost:3000/comment/${id}`, {
                method:'PATCH',
                body: JSON.stringify({
                    content: comment
                }),
                headers: {
                    'Content-type': 'application/json',
                  },
            })
            .then(res => res.json())
            .then(data => {
                $('#error').css('display','none')
                console.log(data)
                location.reload()
            })
        } else {
            $('#error').css('display','block')
            $('#error').text('comment can not be empty!')
        }
    })

    $('button.cancel').on('click', function() {
        $(this).parent().parent().parent().children().eq(1).val(currentValue)
        $(this).css('display', 'none')
        $('button.accept').css('display', 'none')
        location.reload()
    })
})