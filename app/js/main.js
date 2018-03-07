
jQuery( document ).ready(function() {
    
    console.log( "ready!" );

    $('.Bot:first-child .Roll').addClass('Show');
    $('.Bot:first-child .toggleRoll').addClass('active');
    $('.NavEl:first-child ').addClass('active');
    $('.tab-pane:first-child ').addClass('active show');

    $('.toggleRoll').on('click', function(){
        $(this).toggleClass('active');
        $(this).parent().find('.Roll').toggleClass('Show')
    });

});