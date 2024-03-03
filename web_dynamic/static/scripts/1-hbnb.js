$(document).ready(function () {
    let id_list = {}; 
    $('input').on('change', function() {
        let name = $(this).data('name');
        let id = $(this).data('id');
        if ($(this).prop('checked')) {         
            id_list[id] = name;   
        }
        else {
            delete id_list[id];

        }
        let amenitiesText = Object.values(id_list).join(', ');
        $(".amenities h4").text(amenitiesText);
    });  
});
