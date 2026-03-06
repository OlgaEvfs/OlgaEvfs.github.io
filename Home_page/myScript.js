$(document).ready(function () {
  // Скрываем все блоки при загрузке страницы
  $(".section").hide();
  //------------------3.

  // Функция для отображения блока с анимацией
  function showBlock(blockId) {
    $(".section").hide(); // Скрываем все блоки
    $("#" + blockId).fadeIn(2000); // Показываем нужный блок с анимацией
  }
  // При клике на ссылки меню отображаем соответствующий блок и заполняем контент
  $("#start").click(function (event) {
    event.preventDefault();
    showBlock("n1");
    $("#content1").text(content[0].text); // Добавляем контент
    $("html, body").animate({ scrollTop: 0 }, 1000); // Прокручиваем страницу вверх
  });

  $("#but2").click(function (event) {
    event.preventDefault();
    showBlock("n2");
    $("#content2").text(content[1].text); // Добавляем контент
    $("html, body").animate({
      scrollTop: $("#n2").offset().top // Прокручиваем к контейнеру n2
    }, 1000);
  });

  $("#but3").click(function (event) {
    event.preventDefault();
    showBlock("n3");
    $("#content3").html(content[2].text); // Добавляем контент
    $("html, body").animate({
      scrollTop: $("#n3").offset().top // Прокручиваем к контейнеру n2
    }, 1000);
  });

  $("#but4").click(function (event) {
    event.preventDefault(); // Отменяем стандартное поведение кнопки
    
    showBlock("n4"); // Показываем блок с ID n4
    
    // Очищаем контейнер перед добавлением новых картинок
    $("#content4").empty();
  
    // Добавляем изображения в контейнер #content4
    content[3].images.forEach(function (imgSrc) {
      var imgElement = $('<img>').attr('src', imgSrc).attr('alt', 'Image');
      $("#content4").append(imgElement); // Вставляем каждое изображение
    });
  
    // Плавная прокрутка к блоку n4
    $("html, body").animate({
      scrollTop: $("#n4").offset().top
    }, 1000);
  });

  $("#but5").click(function (event) {
    event.preventDefault();
    showBlock("n5");
    $("#content5").text(content[4].text); // Добавляем контент
    $("html, body").animate({
      scrollTop: $("#n5").offset().top // Прокручиваем к контейнеру n2
    }, 1000);
  });

  // Показываем первый блок по умолчанию
  showBlock("n1");
  $("#content1").text(content[0].text); // Добавляем контент для первого блока
});

