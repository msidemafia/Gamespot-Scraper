
$(document).on("click", "#scrapeBtn", function () {
    console.log("sup");
    $('#article-list').empty();
    $.get("/scrape", response => {
        console.log(response);
        for (i = 0; i < response.length; i++) {

            var title = $('<h3>').text(response[i].title).attr('id', 'title-' + i);
            var link = $('<a>').attr('href', response[i].link).attr('id', 'link-' + i).attr('target', '_blank').append(title);
            var cardHeader = $('<div>').addClass('card-header').append(link);

            var summary = $('<p>').addClass('card-text').text(response[i].summary).attr('id', 'summary-' + i);
            var saveButton = $('<a>').addClass('btn').addClass('btn-primary').addClass('save-button').attr('id', 'saveBtn-' + i).text('Save Article');
            var cardBody = $('<div>').addClass('card-body').append(summary).append(saveButton);

            var articleCard = $('<div>').addClass('card').append(cardHeader).append(cardBody);
            var listItem = $('<li>').append(articleCard);

            $('#article-list').append(listItem);
        }
    })
});

$(document).on('click', '.save-button', function () {
    let saveId = $(this).attr('id');
    let idNumber = saveId.split('-')[1];
    let objectTitle = $('#title-' + idNumber).text();
    let objectLink = $('#link-' + idNumber).attr('href');
    let objectSummary = $('#summary-' + idNumber).text();

    let articleObject = {
        title: objectTitle,
        link: objectLink,
        summary: objectSummary
    };
    console.log(articleObject);

    $.post("/api/save", articleObject, response => {
        console.log(response);
    });
    alert('Article Saved!');
});

$(document).on('click', '.delete-button', function () {
    warning = message => confirm(message);
    if (warning('Are you sure you want to delete this article?')) {
        let articleId = $(this).attr('data-id');
        let requestObject = {
            id: articleId
        };
        $.post("/api/delete", requestObject, response => {
            console.log(response);     
        });
        location.reload(true);
    }
});

$(document).on('click', '.note-button', function () {
    var commentId = $(this).attr('data-id');
    var commentTextArea = $('<textarea>').addClass('form-control').attr('rows', '3').attr('id', 'comment-' + commentId);
    var commentDiv = $('<div>').addClass('form-group').append(commentTextArea);
    var commentForm = $('<form>').append(commentDiv);
    var commentBtn = $('<a>').addClass('btn').addClass('btn-primary').addClass('comment-button').attr('data-id', commentId).text('Submit Comment');

    $(this).parent().append(commentForm).append(commentBtn);
});

$(document).on('click', '.comment-button', function () {
    var cmtId = $(this).attr('data-id');
    var comment = $('#comment-' + cmtId).val().trim();
    console.log(comment);
    console.log(cmtId);
    var commentObject = {
        body: comment,
        id: cmtId
    };  
    $.post("/api/comment", commentObject, response => {
        console.log(response);
        location.reload(true);
    });
});