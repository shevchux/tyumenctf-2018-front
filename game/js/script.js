var CurrentTableRowObject = null;

function InitModal(elementId, randcolor) {
    var modal = document.getElementById(elementId);
    var obj = this;
    $(modal).find(".close").click(function(){
        obj.hide();
    });
    
    function GetRandShadowRGB() {
        var c1 = 0, c2 = 255, c3 = Math.random()*256|0;
        if (Math.random() > 0.5) {
            c1=c2+(c2=c1)-c1;
        }
        if (Math.random() > 0.5) {
            c3=c2+(c2=c3)-c3;
        }
        return "rgba(" + c1 + ", " + c2 + ", " + c3 + ", 0.4)";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            obj.hide();
        }
    }
    
    this.hide = function() {
        $(modal).hide();
        $(document.body).css("overflow", "visible");
    }
    
    this.show = function() {
        $(modal).show();
        if (randcolor) {
            $(modal).find('.modal-window').css("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.5), 0 0 200px 0 " + GetRandShadowRGB());
        }
        $(document.body).css("overflow", "hidden");
    }
    
    return this;
}

function GetCategory(category) {
    var url = 'rating.html?cathegory=' + category;
    $("#rating-table-content").load(url);
}

function OpenTaskWindowTab(tabNumber, tab) {
    $("#li-tabs").find(".selected").removeClass("selected");
    $(tab).addClass("selected");
    $(".wtask").hide();
    switch (tabNumber) {
        case 1:
            $("#task-body").show();
            break;
        case 2:
            $("#hints-body").show();
            break;
        case 3:
            var url = 'tasksolvedteams.html?taskid=' + $("#task-id").val();
            $("#solved-body").load(url, function(){
                $("#span-solved-count").text($("#solvedteamscount").val());
                $("#solved-body").show();
            })
            break;
        case 4:
            $("#writeup-body").show();
            break;
    }
}

function TaskOpen(taskid, catn, obj) {
    CurrentTableRowObject = obj;
    var url = 'task.html?taskid=' + taskid;
    $("#task-item-content").load(url, function(){
        $("#task-item-head").text($("#task-short-name").val());
        var hintsCount = $("#input-hints-count").val();
        $("#li-tabs").find(".selected").removeClass("selected");
        $("#li-task-tab a").addClass("selected");
        if (hintsCount == 0) {
            $("#li-hints-tab").hide();
        } else {
            $("#li-hints-tab").show();
        }
        var writeupAvailable = $("#input-writeup-available").val();
        if (writeupAvailable == 0) {
            $("#li-writeup-tab").hide();
        } else {
            $("#li-writeup-tab").show();
        }
        $("#span-hints-count").text(hintsCount);
        $("#span-solved-count").text($("#task-solvedteamscount").val());
        $("#task-item-window")
            .removeClass()
            .addClass("modal-window")
            .addClass("modal-window-color" + catn);
        if ($("#task-solved").val() == "1") {
            $("#task-item-window").addClass("modal-window-solved");
        }
        taskItemModal.show();
    });
}
var h = 0;
function SendFlag(form) {
    var url = 'sendflag.json';
    var data = {
        taskid: $("#task-id").val(),
        flag: $("#task-flag").val()
    }
    var _h = h;
    h++;
    var _CurrentTableRowObject = CurrentTableRowObject;
    $(form).find("button").attr("disabled", "disabled");
    $.get(url, data, null, 'json')
    .done(function(data) {
        if (data.correct) {
            $(form).remove();
            $("#task-solved-message").show();
            notifyAlert("<strong>" + $("#task-short-name").val() + "</strong>: Задание решено.", 1);
            setTimeout(function(){
                $(_CurrentTableRowObject).addClass("tasklist-item-solved");
                if (_h == h) {
                    $("#task-item-window").addClass("modal-window-solved");
                }
                var ul = $(CurrentTableRowObject).parent().parent();
                var cnt_all = ul.children().length;
                var cnt_solved = ul.find(".tasklist-item-solved").length;
                if (cnt_all == cnt_solved) {
                    ul.parent().find(".taskcategory-name").addClass("taskcategory-solved");
                }
            }, 1500);
        } else {
            var incorrectFlagTexts = [
                "Вы ввели неверный флаг",
                "Этот флаг не подходит",
                "Неудача, нужен другой флаг",
                "Неа, не подходит"
            ];
            notifyAlert("<strong>" + $("#task-short-name").val() + "</strong>: " + incorrectFlagTexts[Math.random()*incorrectFlagTexts.length|0]+ ".", -1);
        }
    })
    .always(function(){
        setTimeout(function() {
            $(form).find("button").removeAttr("disabled");
        }, 1000);
    })
}

function TeamSolves(teamid, obj) {
    var url = 'teamtasks.html?teamid=' + teamid;
    $("#rating-team-tasks-content").load(url, function(){
        var teamname = $(obj).parent().parent().find(".rating-team-name").text();
        $("#rating-team-tasks-head").text(teamname);
        teamTaskModal.show();
    });
}

function Auth(obj) {
   $.ajax({
       type: "POST",
       url: "/index",
       data: $(obj).serialize(),
       dataType: "json",
       success: function(data) {
           if (data.status) {
               window.location.reload();
           } else {
               alert(data.message);
           }
       }
   })
}

function BuyHint(hintid, price, obj) {
    if (confirm("Вы точно хотите приобрести эту подсказку? Вы потеряете " + price + " баллов.")) {
        var url = 'buyhint.json';
        var task = $("#task-item-head").text();
        $.get(url, {hintid: hintid}, null, 'json')
        .done(function(data){
            if (data.success) {
                $(obj).hide();
                $(obj).parent().parent().find(".hint-body").text(data.text).show();
                notifyAlert("<b>" + task + "</b>: Подсказка приобретена", 0);
            } else {
                notifyAlert("<b>" + task + "</b>: " + data.errorMessage, -1);
            }
        })
    }
}

function notifyAlert(Text, Type, Time) {
    var block = $('<div class="notify-item"><div class="notify-close">&times;</div><div class="notify-message">' + Text + '</div><div class="clearfix"></div></div>');
    switch (Type) {
        case 1:
            $(block).css("background", "rgba(0, 147, 29, 0.9)");
            break;
        case -1:
            $(block).css("background", "rgba(189, 0, 0, 0.9)");
            break;
        default:
            $(block).css("background", "rgba(0, 145, 189, 0.9)");
    };
    $("#notify-container").append(block);
    $(block).css("width", $(block).width() + "px");
    
    $(block).hide().fadeIn(200);
    $(block).find('.notify-close').click(function(){
        setTimeout(function(){
            $(block).find('.notify-close').remove();
            $(block).find('.clearfix').remove();
        }, 100);
        $(block)
            .animate({'margin-left': '-200%', 'opacity': 0}, 200)
            .animate({'heigth': 0, 'font-size': 0, 'line-height': 0, 'margin-bottom': 0, 'padding': 0}, 100)
            .delay(300)
            .queue(function(){
                $(this).remove();
            });
    });
    setTimeout(function(){
        $(block).find('.notify-close').trigger('click');
    }, Time || 5000);
}

function Timer() {
    this.OnTimerEnd = null;
    this.OnTimerTick = null;

    this.Run = function(MSecondsLeft, Delta) {
        var OnTimerEnd = this.OnTimerEnd || function() {};
        var OnTimerTick = this.OnTimerTick || function() {}; 
        Delta = Delta || 1000;

        var TimeStampStart = new Date();
        (function foo() {
            var _MSecondsLeft = MSecondsLeft + (TimeStampStart - new Date());
            OnTimerTick(_MSecondsLeft);
            if (_MSecondsLeft > Delta) {
                setTimeout(function() {
                    foo();
                }, Delta);
            } else {
                OnTimerEnd(_MSecondsLeft);
            }
        })();
    }
}

var NowUTC = $("#NowUTC").val();
var timer = new Timer();
timer.OnTimerTick = function(msec) {
    var date = new Date(null)
    date.setMilliseconds(msec);
    var seconds = date.getUTCSeconds();
    var minutes = date.getUTCMinutes();
    var hours = date.getUTCHours();
    var days = (date / 864e5) >> 0;

    var str = 
        (hours > 9 ? "" : "0") + hours + ":" + 
        (minutes > 9 ? "" : "0") + minutes + ":" + 
        (seconds > 9 ? "" : "0") + seconds;
    $("#timer-field").html(str);
}

timer.OnTimerEnd = function() {
    $("#timer-field").html("CONTEST&nbsp;1S&nbsp;OVER");
    $("#timer-field-back").html("0000000&nbsp;00&nbsp;0000");
    notifyAlert("<b>ПОСЕТИТЕЛЯМ GUTHUB @SHEVCHUX</b><br/><br/>Это статическая версия (без бекенда и серверного взаимодействия) сайта соревнований по информционной безопасности <b>TyumenCTF 2018</b>. Использованы демонстрационные данные.", 0, 100000);
}

var EndUTC = 1522591200000;
var NowUTC = +$("#NowUTC").val() * 1000;
if (!isNaN(NowUTC)) {
    timer.Run(EndUTC - NowUTC, 300);
}

