$(document).ready(() => {
    const checkedAmenities = {};
  
    const updateAmenities = () => {
      const lst = Object.values(checkedAmenities);
      const amenitiesHeader = $('div.amenities > h4');
      lst.length > 0 ? amenitiesHeader.text(lst.join(', ')) : amenitiesHeader.html('&nbsp;');
    };
  
    $(document).on('change', "input[type='checkbox']", function () {
      const { id, name } = $(this).data();
      this.checked ? checkedAmenities[id] = name : delete checkedAmenities[id];
      updateAmenities();
    });
  
    $.get('http://0.0.0.0:5001/api/v1/status/', ({ status }, textStatus) => {
      $('#api_status').toggleClass('available', textStatus === 'success' && status === 'OK');
    });
  
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: '{}',
      dataType: 'json',
      contentType: 'application/json',
      success: (data) => {
        const placesContainer = $('.places');
        data.forEach(place => {
          const { name, price_by_night, max_guest, number_rooms, number_bathrooms, description } = place;
          placesContainer.append(`
            <article>
              <h2>${name}</h2>
              <div class="price_by_night">
                <p>$${price_by_night}</p>
              </div>
              <div class="information">
                <div class="max_guest">
                  <div class="guest_image"></div>
                  <p>${max_guest}</p>
                </div>
                <div class="number_rooms">
                  <div class="bed_image"></div>
                  <p>${number_rooms}</p>
                </div>
                <div class="number_bathrooms">
                  <div class="bath_image"></div>
                  <p>${number_bathrooms}</p>
                </div>
              </div>
              <div class="description">
                <p>${description}</p>
              </div>
            </article>
          `);
        });
      },
    });
  });
  