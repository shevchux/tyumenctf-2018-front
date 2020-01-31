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

(function() {
    var timer1 = new Timer();
    timer1.OnTimerEnd = function(msec) {
        $("#timer1-field-back").html("000000&nbsp;0000000");
        $("#timer1-field")
            .html("ACCESS&nbsp;GRANTED")
            .addClass("digital-timer-digit-green");
        $("#txt").text("Скорее заходи в игру, соревнование уже началось!");
        
        $("#timer2").show();
        var timer2 = new Timer();
        timer2.OnTimerEnd = function(msec) {
            $("#timer1-field")
                .html("CONTEST&nbsp;IS&nbsp;OVER")
                .addClass("digital-timer-digit-yellow")
                .removeClass("digital-timer-digit-green");
            $("#timer1-field-back").html("0000000&nbsp;I0&nbsp;0000");
            $("#timer2").hide();
            $("#btn").text("Результаты соревнования").addClass("main-text-button-result").attr("href", "#").hide();
            $("#txt").text("Соревнование завершено.");
        }
        timer2.OnTimerTick = function(msec) {
            var date = new Date(null)
            date.setMilliseconds(msec);
            var seconds = date.getUTCSeconds();
            var minutes = date.getUTCMinutes();
            var hours = date.getUTCHours();

            var str = 
                (hours > 9 ? "" : "0") + hours + ":" + 
                (minutes > 9 ? "" : "0") + minutes + ":" + 
                (seconds > 9 ? "" : "0") + seconds;
            $("#timer2-field").html(str); 
        }
        var ContestDuration = 28800000;
		$("#btn").text("Перейти в игру").removeClass("main-text-button-end").addClass("main-text-button-green").attr("href", "game");
        timer2.Run(ContestDuration + msec, 300);
    }
    timer1.OnTimerTick = function(msec) {
        if (msec < 205200000) {
            $("#btn").text("Регистрация завершена").addClass("main-text-button-end");
            $("#txt").text("Ждем зарегистрированные команды здесь в обозначенное время.");
        }
        var date = new Date(null)
        date.setMilliseconds(msec);
        var seconds = date.getUTCSeconds();
        var minutes = date.getUTCMinutes();
        var hours = date.getUTCHours();
        var days = (date / 864e5) >> 0;
        
        var str = 
            (days > 9 ? "" : "0") + days + "&nbsp;day" + (days == 1 ? "_" : "s") + "&nbsp;" + 
            (hours > 9 ? "" : "0") + hours + ":" + 
            (minutes > 9 ? "" : "0") + minutes + ":" + 
            (seconds > 9 ? "" : "0") + seconds;
        $("#timer1-field").html(str);
    }
    
    var StartUTC = 1522562400000;
    var NowUTC = +$("#NowUTC").val() * 1000;
    $("#btn").css("opacity", "1");
    timer1.Run(StartUTC - NowUTC, 300);
    
    setInterval(function(){
        var opacityPercentage = Math.floor(40 + Math.random() * 61);
        $("#flag-state2").animate({"opacity": opacityPercentage / 100}, 300);        
    }, 200);
})();