document.addEventListener('DOMContentLoaded', function () {
    const checkedAmenities = {};
  
    function updateAmenitiesText() {
      const lst = Object.values(checkedAmenities);
      const amenitiesHeading = document.querySelector('div.amenities > h4');
      if (lst.length > 0) {
        amenitiesHeading.textContent = lst.join(', ');
      } else {
        amenitiesHeading.innerHTML = '&nbsp;';
      }
    }
  
    document.addEventListener('change', function (event) {
      const checkbox = event.target;
      if (checkbox.type === 'checkbox') {
        if (checkbox.checked) {
          checkedAmenities[checkbox.dataset.id] = checkbox.dataset.name;
        } else {
          delete checkedAmenities[checkbox.dataset.id];
        }
        updateAmenitiesText();
      }
    });
  
    const apiUrl = 'http://0.0.0.0:5001/api/v1/status/';
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const apiStatusElement = document.getElementById('api_status');
        if (data.status === 'OK') {
          apiStatusElement.classList.add('available');
        } else {
          apiStatusElement.classList.remove('available');
        }
      })
      .catch(error => console.error('Error fetching API status:', error));
  });
  