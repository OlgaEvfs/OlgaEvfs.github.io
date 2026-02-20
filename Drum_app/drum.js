function playSound(keyCode) {
    const key = $(`.key[data-key="${keyCode}"]`);
    const audio = $(`audio[data-key="${keyCode}"]`)[0];

    if (!key.length) return;

    key.addClass('playing');
    
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

function stopSound(keyCode) {
    const key = $(`.key[data-key="${keyCode}"]`);
    key.removeClass('playing');
}

$(function() {
    $(window).on('keydown', function(event) {
        playSound(event.which);
    });

    $(window).on('keyup', function(event) {
        stopSound(event.which);
    });

    // Добавляем поддержку мыши и тачскринов
    $('.key').on('mousedown touchstart', function(e) {
        e.preventDefault(); // Предотвращаем лишние действия браузера (зум, выделение)
        const keyCode = $(this).data('key');
        playSound(keyCode);
    });

    $('.key').on('mouseup mouseleave touchend', function() {
        const keyCode = $(this).data('key');
        stopSound(keyCode);
    });
});