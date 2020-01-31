function Members() {
    var MemberCount = 1;
    var pattern =   "<li>" +
                        "<div class=\"reg-team-item\">" +
                            "<div class=\"reg-team-member\">" +
                                "<p>Участник <span class=\"team-member-number\"></span></p>" +
                                "<a href=\"#\" onclick=\"members.Remove(this); return false;\">Удалить</a>" +
                            "</div>" +
                            "<div class=\"reg-team-member-info\">" +
                                "<input type=\"text\" name=\"player[name][]\" placeholder=\"ФИО\" title=\"ФИО\" required>" +
                                "<input type=\"email\" name=\"player[email][]\" placeholder=\"Электронная почта\" title=\"Электронная почта\" required>" +
                            "</div>" +
                        "</div>" +
                    "</li>";
    
    var Recount = function() {
        $("#member-list li .team-member-number").each(function(n, elem) {
            $(elem).text(n + 2);
        })
    }
    
    this.Add = function() {
        if (MemberCount >= 6) {
            $("#btn-add-member").hide();
            return false;
        }
        MemberCount += 1;
        $("#member-list").append(pattern);
        $("#member-list li").last().hide().fadeIn(400);
        Recount();
        if (MemberCount == 6) {
            $("#btn-add-member").hide();
        }
    }
    
    this.Remove = function(elem) {
        MemberCount -= 1;
        $("#btn-add-member").show();
        $(elem).parent().parent().parent().remove();
        Recount();
    }
}

var members = new Members();

function ToggleAgreementCheckbox(elem) {
    var checked = $(elem).attr("checked") == "checked";
    if (checked) {
        $("#btn-reg").removeAttr("disabled");
    } else {
        $("#btn-reg").attr("disabled", "disabled");
    }
}

function SendForm(elem) {
    var formData = new FormData(elem);
    // ...
}

function SelectImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        if (["image/gif", "image/png", "image/x-png", "image/jpg", "image/jpeg"].indexOf(input.files[0].type) == -1) {
            alert("Выберите изображение.");
            RemoveImage();
        } else if (input.files[0].size > 5 * 1024 * 1024) {
            alert("Выберите изображение размером не более 5Мб.");
            RemoveImage();
        } else {
            reader.onload = function (e) {
                $('#img-state-uploaded').show().attr("style", "background-image: url('" + e.target.result + "')");
                $("#img-state-empty").hide();
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
}

function RemoveImage() {
    $('#img-state-uploaded').attr("style", "").hide();
    $("#img-state-empty input").prop('value', null);
    $("#img-state-empty").show();
}

function OnSuccess() {
    $(".page-title").text("Регистрация успешно завершена");
    $("#reg-form").text("Вам и всем участникам команды будет отправлено email-оповещение.");
}