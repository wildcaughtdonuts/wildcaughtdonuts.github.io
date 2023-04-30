//adress.js

const searchBtn = document.getElementById('search-btn');
const mapResultDiv = document.getElementById('mapResult');
const mapContainer = document.getElementById('map');

function showMapWithAddress(address) {
  var geocoder = new daum.maps.services.Geocoder();

  geocoder.addressSearch(address, function (result, status) {
    if (status === daum.maps.services.Status.OK) {
      var coords = new daum.maps.LatLng(result[0].y, result[0].x);

      var mapOption = {
        center: coords,
        level: 3,
      };

      var map = new daum.maps.Map(mapContainer, mapOption);

      var marker = new daum.maps.Marker({
        map: map,
        position: coords,
      });
    }
  });
}

searchBtn.addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: function (data) {
      showMapWithAddress(data.address);
      const buildingCode = data.buildingCode;
      const apiKey = "imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D";
      const siggCd = buildingCode.substr(0, 5);
      const bjdCd = buildingCode.substr(5, 5);
      const bunCd = buildingCode.substr(11, 4);
      const jiCd = buildingCode.substr(15, 4);
      const apiUrl = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?sigunguCd=${siggCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&ServiceKey=${apiKey}`;
      const recapUrl = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrRecapTitleInfo?sigunguCd=${siggCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&ServiceKey=${apiKey}`;
      const flrUrl = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrFlrOulnInfo?sigunguCd=${siggCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&ServiceKey=${apiKey}`;
      
      
      
      mapResultDiv.innerHTML = `<p>주소 불러오기에 성공했습니다.<br>아래 버튼을 눌러주세요.</p>`;
      
      document.getElementById('url-input').value = apiUrl;
    }
  }).open();
});


var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
	level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options);