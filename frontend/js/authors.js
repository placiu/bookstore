$(function () {

    var formAuthorAdd = $('#authorAdd');
    var formAuthorEdit = $('#authorEdit');
    var authorsList = $('#authorsList');
    var authorEditSelect = $('#authorEditSelect');

    $.get('../rest/rest.php/author/')
        .done(function (data) {
            var data = data.success;
            if (data && data.length > 0) {
                data.forEach(function (e) {
                    createNewAuthor(e);
                });
            }
        });

    formAuthorAdd.submit(function(e) {
        e.preventDefault();
        $.post('../rest/rest.php/author/', $(this).serialize())
            .done(function (data) {
                var data = data.success;
                if (data && data.length > 0) {
                    console.log(data);
                    createNewAuthor(data[0]);
                    showModal('Author added!');
                }
            })
            .fail(function () {
                showModal('Error!');
            });
    });

    authorsList.on('click', 'button.btn-author-remove', function () {
        var button = $(this);
        var id = button.data('id');
        $.ajax({
            url: '../rest/rest.php/author/' + id,
            type: 'DELETE',
            dataType: 'json'
        }).done(function () {
            var option = authorEditSelect.find('option[value=' + button.data('id') + ']');
            option.remove();
            button.parents('li').remove();
            showModal('Author deleted!');
        }).fail(function () {
            showModal('Error!');
        });
    });

    authorEditSelect.change(function() {
        var select = $(this);
        var id = select.val();
        if (select.val()) {
            $.get('../rest/rest.php/author/' + id)
                .done(function (data) {
                    var data = data.success;
                    if (data && data.length > 0) {
                        formAuthorEdit.css('display', 'block');
                        formAuthorEdit.find('#id').val(data[0].id);
                        formAuthorEdit.find('#name').val(data[0].name);
                        formAuthorEdit.find('#surname').val(data[0].surname);
                    }
                });
        } else {
            formAuthorEdit.css('display', 'none');
        }
    });

    formAuthorEdit.find('button').click(function(e) {
        e.preventDefault();
        var form = $(this).parent();
        var id = form.find('#id').val();
        $.ajax({
            url: '../rest/rest.php/author/' + id,
            type: 'PATCH',
            data: form.serialize(),
            dataType: 'json'
        }).done(function (data) {
            var data = data.success;
            if (data && data.length > 0) {
                formAuthorEdit.css('display', 'none');
                authorsList.find('button[data-id=' + id + '].btn-author-remove').prev().text(data[0].name + ' ' + data[0].surname);
                authorEditSelect.val('');
                authorEditSelect.find('option[value=' + id + ']').text(data[0].name + ' ' + data[0].surname);
                showModal('Author updated!');
            }
        }).fail(function () {
            showModal('Error!');
        });
    });

});

let createNewAuthor = (author) => {
    let $authorList = $('#authorsList');
    let $authorEditSelect = $('#authorEditSelect');
    let $authorEditOption = $('<option>', {value: author.id});
    $authorEditOption.text(author.name + ' ' + author.surname);
    $authorEditSelect.append($authorEditOption);

    let $li = $('<li>', {class: 'list-group-item'});
    let $panel = $('<div>', {class: 'panel panel-default'});
    let $heading = $('<div>', {class: 'panel-heading'});
    let $authorTitle = $('<span>', {class: 'authorTitle'});
    let $buttonRemove = $('<button class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button>');

    $authorTitle.text(author.name + ' ' + author.surname);
    $buttonRemove.attr('data-id', author.id);

    $heading.append($authorTitle).append($buttonRemove);
    $panel.append($heading);
    $li.append($panel);
    $authorList.append($li);
}