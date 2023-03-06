// 다음 우편번호 검색 API에서 주소 검색을 완료한 후 실행되는 함수
function handleAddress(data) {
	// 검색 결과에서 도로명 주소와 건물명 추출
	var roadAddress = data.roadAddress;
	var buildingName = data.buildingName;
	
	// 추출한 주소 정보를 입력 폼에 적용
	document.getElementById("roadAddress").value = roadAddress;
	document.getElementById("buildingName").value = buildingName;
}

// 국토교통부 건축물 대장 API에서 결과를 받아 처리하는 함수
function handleBuilding(data) {
	// 결과에서 필요한 정보 추출
	var items = data.response.body.items.item;
	var result = "";
	
	// 추출한 정보를 문자열로 변환하여 출력
	if (items) {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			result += "건물명: " + item.bldgNm + "<br>";
			result += "대지위치: " + item.platPlc + "<br>";
			result += "주용도: " + item.mainPurpsNm + "<br>";
			result += "면적: " + item.archArea + "<br><br>";
		}
	} else {
		result = "검색 결과가 없습니다.";
	}
	
	// 결과를 출력
	document.getElementById("result").innerHTML = result;
}

// 다음 우편번호 검색 API 호출 함수
function searchAddress() {
	// 다음 우편번호 검색 API를 호출하고 검색 결과를 처리하는 함수 지정
	new daum.Postcode({
		oncomplete: function(data) {
			handleAddress(data);
		}
	}).open();
}

// 국토교통부 건축물 대장 API 호출 함수
function searchBuilding() {
	// 입력 폼에서 도로명 주소와 건물명 추출
	var roadAddress = document.getElementById("roadAddress").value;
	var buildingName = document.getElementById("buildingName").value;
	
	// 국토교통부 건축물 대장 API를 호출하기 위한 URL 생성
	var apiUrl = "http://apis.data.go.kr/openapi/service/rest/PortalOpenApiService/getPortalOpenApiList";
	var queryParams = "?" + encodeURIComponent("ServiceKey") + "=5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D";
	queryParams += "&" + encodeURIComponent("bldgNm") + "=" + encodeURIComponent(buildingName);
	queryParams += "&" + encodeURIComponent("platPlc") + "=" + encodeURIComponent(roadAddress);
	queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent(10);
	
	// API 호출
	var xhr = new XMLHttpRequest();
	xhr.open("GET", apiUrl + queryParams);
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			// 결과 처리 함수 호출
			handleBuilding(JSON.parse(this.responseText));
		}
	};
	xhr.send();
}
