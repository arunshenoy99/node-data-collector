$('#profilepic').hover(function () {
    $(this).css('cursor', 'pointer')
})

$('#profilepic').click(function () {
    $('#fileModal').modal('show')
    $('#fileModal').modal({ keyboard: true })
})

$('#closefileModal').click(function () {
    $('#fileModal').modal('hide')
    $('#fileModal').modal({ keyboard: false })
})