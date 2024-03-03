$(document).ready(() => {
    const checkedAmenities = {};
    const checkedStates = {};
    const checkedCities = {};
    const checkedLocations = {};
  
    const updateAmenities = () => {
      const amenitiesHeader = $('div.amenities > h4');
      const lst = Object.values(checkedAmenities);
      lst.length > 0 ? amenitiesHeader.text(lst.join(', ')) : amenitiesHeader.html('&nbsp;');
    };
  
    const updateLocations = () => {
      const locationsHeader = $('div.locations > h4');
      const lst = Object.values(checkedLocations);
      lst.length > 0 ? locationsHeader.text(lst.join(', ')) : locationsHeader.html('&nbsp;');
    };
  
    const handleCheckboxChange = (event, category, categoryObj, headerUpdateFunction) => {
      const { id, name } = event.target.dataset;
  
      if (event.target.checked) {
        categoryObj[id] = name;
      } else {
        delete categoryObj[id];
      }
  
      headerUpdateFunction();
    };
  
    $(document).on('change', ".amenities > .popover > li > input[type='checkbox']", (event) => {
      handleCheckboxChange(event, 'amenities', checkedAmenities, updateAmenities);
    });
  
    $(document).on('change', ".locations > .popover > li > input[type='checkbox']", (event) => {
      handleCheckboxChange(event, 'states', checkedStates, updateLocations);
    });
  
    $(document).on('change', ".locations > .popover > li > ul > li > input[type='checkbox']", (event) => {
      handleCheckboxChange(event, 'cities', checkedCities, updateLocations);
    });
  
    $.get('http://0.0.0.0:5001/api/v1/status/', ({ status }, textStatus) => {
      const apiStatus = $('#api_status');
      apiStatus.toggleClass('available', textStatus === 'success' && status === 'OK');
    });
  
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
        data: JSON.stringify({
          'amenities': Object.keys(checkedAmenities),
          'states': Object.keys(checkedStates),
          'cities': Object.keys(checkedCities),
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: handleSearchResults,
      });
    });
  });
  