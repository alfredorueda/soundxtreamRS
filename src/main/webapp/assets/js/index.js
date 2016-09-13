/**
 * Created by Xavi on 31/05/2016.
 */


$(document).ready(init);

function init(){
    $('#content').scroll(function(e) {
        if($('#content').scrollTop() > 20){
            $('#topButton').show('slow');
        }
        else{
            $('#topButton').hide('slow');
        }
    });

    $('#topButton').click(function(){
        $('#content').animate({ scrollTop: 0 }, 'fast');
    });

}

