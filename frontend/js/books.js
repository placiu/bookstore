$(function () {

    var formBookAdd = $('#bookAdd');
    var formBookEdit = $('#bookEdit');
    var bookList = $('#booksList');
    var bookEditSelect = $('#bookEditSelect');
    var bookEditAuthorSelect = formBookEdit.find('#author_id_edit');

    $.get('../rest/rest.php/book/')
        .done(function (data) {
            var data = data.success;
            if (data && data.length > 0) {
                data.forEach(function (e) {
                    createNewBook(e);
                });
            }
        });

    $.get('../rest/rest.php/author')
        .done(function( data ) {
            var data = data.success;
            if (data && data.length > 0) {
                var authorSelect = formBookAdd.find('#author_id');
                data.forEach(function(a) {
                    var authorOption1 = $('<option>');
                    authorOption1.val(a.id);
                    authorOption1.text(a.name + ' ' + a.surname);
                    authorOption2 = authorOption1.clone();
                    authorOption1.appendTo(authorSelect);
                    authorOption2.appendTo(bookEditAuthorSelect);
                });
            }
        });

    formBookAdd.submit(function (e) {
        e.preventDefault();
        $.post('../rest/rest.php/book/', $(this).serialize())
            .done(function (data) {
                var data = data.success;
                if (data && data.length > 0) {
                    createNewBook(data[0]);
                    showModal('Book added!');
                }
            })
            .fail(function () {
                showModal('Error!');
            });
    });

    bookList.on('click', 'button.btn-book-show-description', function () {
        var button = $(this);
        var divDescription = button.parent().next();
        var id = button.data('id');
        $.get('../rest/rest.php/book/' + id)
            .done(function (data) {
                var data = data.success;
                if (data && data.length > 0) {
                    data.forEach(function () {
                        var description = data[0].description;
                        divDescription.toggle().html(description);
                    });
                }
            });
    });

    bookList.on('click', 'button.btn-book-remove', function () {
        var button = $(this);
        var id = button.data('id');
        $.ajax({
            url: '../rest/rest.php/book/' + id,
            type: 'DELETE',
            dataType: 'json'
        }).done(function () {
            var option = bookEditSelect.find('option[value=' + button.data('id') + ']');
            option.remove();
            button.parents('li').remove();
            showModal('Book deleted!');
        }).fail(function () {
            showModal('Error!');
        });
    });

    bookEditSelect.change(function() {
        var select = $(this);
        var id = select.val();
        if (select.val()) {
            $.get('../rest/rest.php/book/' + id)
                .done(function (data) {
                    var data = data.success;
                    if (data && data.length > 0) {
                        formBookEdit.css('display', 'block');
                        formBookEdit.find('#id').val(data[0].id);
                        formBookEdit.find('#title').val(data[0].title);
                        formBookEdit.find('#description').val(data[0].description);
                        bookEditAuthorSelect.val(data[0].author.id);
                    }
                });
        } else {
            formBookEdit.css('display', 'none');
        }
    });

    formBookEdit.find('button').click(function(e) {
        e.preventDefault();
        var form = $(this).parent();
        var id = form.find('#id').val();
        $.ajax({
            url: '../rest/rest.php/book/' + id,
            type: 'PATCH',
            data: form.serialize(),
            dataType: 'json'
        }).done(function (data) {
            var data = data.success;
            if (data && data.length > 0) {
                formBookEdit.css('display', 'none');
                bookList.find('button[data-id=' + id + '].btn-book-remove').prev().html(data[0].title + ' <br>(' + data[0].author.name + ' ' + data[0].author.surname + ')');
                bookEditSelect.val('');
                bookEditSelect.find('option[value=' + id + ']').text(data[0].title + ' (' + data[0].author.name + ' ' + data[0].author.surname + ')');
                showModal('Book updated!');
            }
        }).fail(function () {
            showModal('Error!');
        });
    });

});

let createNewBook = (book) => {
    let $booksList = $('#booksList');
    let $bookEditSelect = $('#bookEditSelect');
    let $li = $('<li>', {class: 'list-group-item'});
    let $panel = $('<div>', {class: 'panel panel-default'});
    let $heading = $('<div>', {class: 'panel-heading'});
    let $bookTitle = $('<span>', {class: 'bookTitle'});
    let $buttonRemove = $('<button class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i></button>');
    let $buttonShowDescription = $('<button class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i></button>');
    let $bookDescription = $('<div>', {class: 'panel-body book-description'});
    let $bookEditOption = $('<option>', {value: book.id});

    $bookTitle.html(book.title + ' <br>(' + book.author.name + ' ' + book.author.surname + ')');
    $bookDescription.text(book.description);
    $buttonRemove.attr('data-id', book.id);
    $buttonShowDescription.attr('data-id', book.id);
    $bookEditOption.text(book.title + ' (' + book.author.name + ' ' + book.author.surname + ')');

    $heading.append($bookTitle).append($buttonRemove).append($buttonShowDescription);
    $panel.append($heading).append($bookDescription);
    $li.append($panel);
    $booksList.append($li);
    $bookEditSelect.append($bookEditOption);
}