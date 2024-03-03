$(document).ready(() => {
    const checkedAmenities = {};
  
    const updateAmenities = () => {
      const amenitiesHeader = $('div.amenities > h4');
      const lst = Object.values(checkedAmenities);
      lst.length > 0 ? amenitiesHeader.text(lst.join(', ')) : amenitiesHeader.html('&nbsp;');
    };
  
    $(document).on('change', "input[type='checkbox']", function () {
      const { id, name } = $(this).data();
      this.checked ? checkedAmenities[id] = name : delete checkedAmenities[id];
      updateAmenities();
    });
  
    const handleApiStatus = (data, textStatus) => {
      const apiStatus = $('#api_status');
      apiStatus.toggleClass('available', textStatus === 'success' && data.status === 'OK');
    };
  
    $.get('http://0.0.0.0:5001/api/v1/status/', handleApiStatus);
  
    const renderPlace = (place) => {
      const { name, price_by_night, max_guest, number_rooms, number_bathrooms, description } = place;
      const placesContainer = $('.places');
      placesContainer.append(`
        <article>
          <h2>${name}</h2>
          <div class="price_by_night"><p>$${price_by_night}</p></div>
          <div class="information">
            <div class="max_guest"><div class="guest_image"></div><p>${max_guest}</p></div>
            <div class="number_rooms"><div class="bed_image"></div><p>${number_rooms}</p></div>
            <div class="number_bathrooms"><div class="bath_image"></div><p>${number_bathrooms}</p></div>
          </div>
          <div class="description"><p>${description}</p></div>
        </article>
      `);
    };
  
    const handleSearchResults = (data) => {
      const placesContainer = $('.places');
      placesContainer.find('article').remove();
      data.forEach(renderPlace);
    };
  
    $('.filters > button').click(() => {
      $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search',
        data: JSON.stringify({ amenities: Object.keys(checkedAmenities) }),
        dataType: 'json',
        contentType: 'application/json',
        success: handleSearchResults,
      });
    });
  });
  