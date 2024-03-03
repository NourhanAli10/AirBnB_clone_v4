window.addEventListener('load', () => {
    // Task 3
    $.ajax('http://0.0.0.0:5001/api/v1/status').done(({ status }) => {
      $('#api_status').toggleClass('available', status === 'OK');
    });
  
    // Task 2
    const amenityIds = {};
    $('.amenities input[type=checkbox]').click(function () {
      const { id, name } = $(this).data();
  
      if (this.checked) {
        amenityIds[id] = name;
      } else {
        delete amenityIds[id];
      }
  
      const amenitiesHeader = $('div.amenities h4');
      amenitiesHeader.text(Object.values(amenityIds).join(', ') || '\u00A0');
    });
  
    const stateIds = {};
    const cityIds = {};
  
    // Task 4
    $('.filters button').click(() => {
      $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        contentType: 'application/json',
        data: JSON.stringify({
          amenities: Object.keys(amenityIds),
          states: Object.keys(stateIds),
          cities: Object.keys(cityIds)
        })
      }).done((data) => {
        const placesContainer = $('section.places');
        placesContainer.empty().append('<h1>Places</h1>');
  
        for (const place of data) {
          const template = `
            <article>
              <div class="title">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">
                  <i class="fa fa-users fa-3x" aria-hidden="true"></i><br />${place.max_guest} Guests
                </div>
                <div class="number_rooms">
                  <i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />${place.number_rooms} Bedrooms
                </div>
                <div class="number_bathrooms">
                  <i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />${place.number_bathrooms} Bathroom
                </div>
              </div>
              <div class="description">${place.description}</div>
              <div class="reviews">
                <h2>Reviews <span class="reviewSpan" data-id="${place.id}">show</span></h2>
                <ul></ul>
              </div>
            </article>`;
  
          placesContainer.append(template);
        }
  
        // Task 7: get reviews for each place (add to the places post request for loop?)
        $('.reviewSpan').click(function (event) {
          const reviewSpan = $(this);
          const reviewsList = reviewSpan.closest('.reviews').find('ul');
  
          $.ajax(`http://0.0.0.0:5001/api/v1/places/${reviewSpan.data('id')}/reviews`).done((reviews) => {
            reviewsList.empty();
            reviews.forEach(review => reviewsList.append(`<li>${review.text}</li>`));
  
            reviewSpan.text(reviews.length > 0 ? 'hide' : 'show');
          });
        });
      });
    });
  
    // Task 6
    const handleLocationCheckbox = (event, locationIds, updateFunction) => {
      const { id, name } = event.target.dataset;
  
      if (event.target.checked) {
        locationIds[id] = name;
      } else {
        delete locationIds[id];
      }
  
      const locationsHeader = $('.locations h4');
      locationsHeader.text(
        Object.values(locationIds).concat(Object.values(cityIds)).join(', ') || '\u00A0'
      );
    };
  
    $('.stateCheckBox').click((event) => {
      handleLocationCheckbox(event, stateIds, updateLocationsHeader);
    });
  
    $('.cityCheckBox').click((event) => {
      handleLocationCheckbox(event, cityIds, updateLocationsHeader);
    });
    
    const updateLocationsHeader = () => {
      const locationsHeader = $('.locations h4');
      locationsHeader.text(
        Object.values(cityIds).concat(Object.values(stateIds)).join(', ') || '\u00A0'
      );
    };
  });
  