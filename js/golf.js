// 골프 여행 안내문 생성기 - Main JavaScript

// TEE-UP 항목 추가 기능
document.getElementById('addTeeTime')?.addEventListener('click', function() {
    const container = document.getElementById('teeTimeContainer');
    const newItem = document.createElement('div');
    newItem.className = 'tee-time-item bg-white p-4 rounded-lg border-2 border-gray-200 relative';
    
    newItem.innerHTML = `
        <button type="button" class="remove-tee-item absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">
            <i class="fas fa-times-circle"></i>
        </button>
        <div class="grid md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">골프장명</label>
                <input type="text" class="tee-course w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="예: 제주 핀크스">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">날짜</label>
                <input type="date" class="tee-date w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">티업 시간</label>
                <input type="time" class="tee-time w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none">
            </div>
        </div>
        <div class="mt-3">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-image text-green-600 mr-1"></i>골프장 이미지 (선택)
            </label>
            <input type="file" class="tee-image w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none" accept="image/*">
            <div class="tee-image-preview mt-2 hidden">
                <img class="max-w-full h-32 object-contain rounded-lg border-2 border-gray-200">
                <button type="button" class="remove-tee-image mt-1 text-red-500 text-sm hover:text-red-700">
                    <i class="fas fa-times-circle mr-1"></i>이미지 제거
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(newItem);
    
    // 제거 버튼 이벤트
    newItem.querySelector('.remove-tee-item').addEventListener('click', function() {
        newItem.remove();
    });
    
    // 이미지 업로드 이벤트
    const imageInput = newItem.querySelector('.tee-image');
    imageInput.addEventListener('change', function(e) {
        handleImageUpload(e, newItem.querySelector('.tee-image-preview'));
    });
    
    // 이미지 제거 이벤트
    newItem.querySelector('.remove-tee-image')?.addEventListener('click', function() {
        newItem.querySelector('.tee-image-preview').classList.add('hidden');
        imageInput.value = '';
    });
});

// 첫 번째 TEE-UP 항목의 제거 버튼 이벤트 (이미 있는 항목)
document.querySelectorAll('.remove-tee-item').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.tee-time-item').remove();
    });
});

// 일정 추가 기능
document.getElementById('addSchedule')?.addEventListener('click', function() {
    const container = document.getElementById('scheduleContainer');
    const newItem = document.createElement('div');
    newItem.className = 'schedule-item bg-white p-4 rounded-lg border-2 border-gray-200 relative';
    
    newItem.innerHTML = `
        <button type="button" class="remove-schedule-item absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">
            <i class="fas fa-times-circle"></i>
        </button>
        <div class="grid md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">날짜</label>
                <input type="date" class="schedule-date w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                <input type="text" class="schedule-title w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="예: 둘째날 일정">
            </div>
        </div>
        
        <!-- 일정 상세 -->
        <div class="mt-3">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-list text-blue-600 mr-1"></i>일정 상세
            </label>
            <p class="text-xs text-gray-500 mb-1">💡 텍스트를 드래그하여 색상, 굵기 등을 변경할 수 있습니다.</p>
            <div class="schedule-detail-editor" style="background: white; min-height: 120px; border: 2px solid #d1d5db; border-radius: 8px;"></div>
            <input type="hidden" class="schedule-detail">
        </div>
        
        <!-- 식사 메뉴 및 포함 사항 -->
        <div class="mt-3">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-utensils text-blue-600 mr-1"></i>식사 메뉴 및 포함 사항
            </label>
            <p class="text-xs text-gray-500 mb-1">💡 텍스트를 드래그하여 색상, 굵기 등을 변경할 수 있습니다.</p>
            <div class="schedule-meals-editor" style="background: white; min-height: 120px; border: 2px solid #d1d5db; border-radius: 8px;"></div>
            <input type="hidden" class="schedule-meals">
        </div>
        
        <!-- 일정 이미지 -->
        <div class="mt-3">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-image text-blue-600 mr-1"></i>일정 이미지 (선택)
            </label>
            <input type="file" class="schedule-image w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" accept="image/*">
            <div class="schedule-image-preview mt-2 hidden">
                <img class="max-w-full h-32 object-contain rounded-lg border-2 border-gray-200">
                <button type="button" class="remove-schedule-image mt-1 text-red-500 text-sm hover:text-red-700">
                    <i class="fas fa-times-circle mr-1"></i>이미지 제거
                </button>
            </div>
        </div>
        
        <!-- 미리보기 포함/제외 체크박스 -->
        <div class="mt-4 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <input type="checkbox" class="schedule-include-preview w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked>
            <label class="text-sm font-semibold text-gray-700">
                <i class="fas fa-eye text-yellow-600 mr-1"></i>미리보기에 이 일정 포함
            </label>
        </div>
    `;
    
    container.appendChild(newItem);
    
    // Quill 에디터 초기화
    if (typeof initScheduleEditors === 'function') {
        initScheduleEditors(newItem);
    }
    
    // 제거 버튼 이벤트
    newItem.querySelector('.remove-schedule-item').addEventListener('click', function() {
        newItem.remove();
        updateScheduleRemoveButtons();
    });
    
    // 이미지 업로드 이벤트
    const imageInput = newItem.querySelector('.schedule-image');
    imageInput.addEventListener('change', function(e) {
        handleImageUpload(e, newItem.querySelector('.schedule-image-preview'));
    });
    
    // 이미지 제거 이벤트
    newItem.querySelector('.remove-schedule-image')?.addEventListener('click', function() {
        newItem.querySelector('.schedule-image-preview').classList.add('hidden');
        imageInput.value = '';
    });
    
    updateScheduleRemoveButtons();
});

// 일정 제거 버튼 표시/숨김 업데이트
function updateScheduleRemoveButtons() {
    const items = document.querySelectorAll('.schedule-item');
    items.forEach((item, index) => {
        const removeBtn = item.querySelector('.remove-schedule-item');
        if (removeBtn) {
            removeBtn.style.display = items.length > 1 ? 'block' : 'none';
        }
    });
}

// 첫 번째 일정 항목의 제거 버튼 이벤트
document.querySelectorAll('.remove-schedule-item').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.schedule-item').remove();
        updateScheduleRemoveButtons();
    });
});

// 기존 일정 이미지 입력 필드들에 이벤트 추가
document.querySelectorAll('.schedule-image').forEach(input => {
    input.addEventListener('change', function(e) {
        const parent = this.closest('.schedule-item');
        handleImageUpload(e, parent.querySelector('.schedule-image-preview'));
    });
});

// 기존 일정 이미지 제거 버튼들에 이벤트 추가
document.querySelectorAll('.remove-schedule-image').forEach(btn => {
    btn.addEventListener('click', function() {
        const parent = this.closest('.schedule-item');
        const preview = parent.querySelector('.schedule-image-preview');
        const input = parent.querySelector('.schedule-image');
        preview.classList.add('hidden');
        input.value = '';
    });
});

// 이미지 업로드 처리 함수
function handleImageUpload(event, previewContainer) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = previewContainer.querySelector('img');
        img.src = e.target.result;
        previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// 기존 이미지 입력 필드들에 이벤트 추가
document.querySelectorAll('.tee-image').forEach(input => {
    input.addEventListener('change', function(e) {
        const parent = this.closest('.tee-time-item');
        handleImageUpload(e, parent.querySelector('.tee-image-preview'));
    });
});

// 기존 이미지 제거 버튼들에 이벤트 추가
document.querySelectorAll('.remove-tee-image').forEach(btn => {
    btn.addEventListener('click', function() {
        const parent = this.closest('.tee-time-item');
        const preview = parent.querySelector('.tee-image-preview');
        const input = parent.querySelector('.tee-image');
        preview.classList.add('hidden');
        input.value = '';
    });
});

// 타이틀 이미지 업로드
document.getElementById('titleImage')?.addEventListener('change', function(e) {
    handleImageUpload(e, document.getElementById('titleImagePreview'));
});

document.querySelector('#titleImagePreview .remove-image')?.addEventListener('click', function() {
    document.getElementById('titleImagePreview').classList.add('hidden');
    document.getElementById('titleImage').value = '';
});

// 공항 미팅 이미지 업로드
document.getElementById('airportMeetingImage')?.addEventListener('change', function(e) {
    handleImageUpload(e, document.getElementById('airportMeetingImagePreview'));
});

document.querySelector('#airportMeetingImagePreview .remove-image')?.addEventListener('click', function() {
    document.getElementById('airportMeetingImagePreview').classList.add('hidden');
    document.getElementById('airportMeetingImage').value = '';
});

// 현지 미팅 이미지 업로드
document.getElementById('localMeetingImage')?.addEventListener('change', function(e) {
    handleImageUpload(e, document.getElementById('localMeetingImagePreview'));
});

document.querySelector('#localMeetingImagePreview .remove-image')?.addEventListener('click', function() {
    document.getElementById('localMeetingImagePreview').classList.add('hidden');
    document.getElementById('localMeetingImage').value = '';
});

// 항공편 이미지 업로드
document.getElementById('flightImage')?.addEventListener('change', function(e) {
    handleImageUpload(e, document.getElementById('flightImagePreview'));
});

document.querySelector('#flightImagePreview .remove-image')?.addEventListener('click', function() {
    document.getElementById('flightImagePreview').classList.add('hidden');
    document.getElementById('flightImage').value = '';
});

// 숙소 이미지 업로드
document.getElementById('accommodationImage')?.addEventListener('change', function(e) {
    handleImageUpload(e, document.getElementById('accommodationImagePreview'));
});

document.querySelector('#accommodationImagePreview .remove-image')?.addEventListener('click', function() {
    document.getElementById('accommodationImagePreview').classList.add('hidden');
    document.getElementById('accommodationImage').value = '';
});

// 회사 로고 업로드
document.getElementById('companyLogo')?.addEventListener('change', function(e) {
    handleImageUpload(e, document.getElementById('companyLogoPreview'));
});

document.querySelector('#companyLogoPreview .remove-image')?.addEventListener('click', function() {
    document.getElementById('companyLogoPreview').classList.add('hidden');
    document.getElementById('companyLogo').value = '';
});

// 색상 입력 동기화 함수
function syncColorInputs(colorId, hexId) {
    const colorInput = document.getElementById(colorId);
    const hexInput = document.getElementById(hexId);
    
    if (!colorInput || !hexInput) return;
    
    colorInput.addEventListener('input', function() {
        hexInput.value = this.value;
    });
    
    hexInput.addEventListener('input', function() {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            colorInput.value = this.value;
        }
    });
}

// 모든 색상 입력 동기화
syncColorInputs('headerBgColor', 'headerBgColorHex');
syncColorInputs('titleColor', 'titleColorHex');
syncColorInputs('meetingColor', 'meetingColorHex');
syncColorInputs('flightColor', 'flightColorHex');
syncColorInputs('teeupColor', 'teeupColorHex');
syncColorInputs('scheduleColor', 'scheduleColorHex');
syncColorInputs('accommodationColor', 'accommodationColorHex');
syncColorInputs('notesColor', 'notesColorHex');

// 미리보기 & 공유하기 버튼
document.getElementById('golfForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    console.log('폼 제출 시작...');
    
    // 폼 데이터 수집
    const formData = collectFormData();
    console.log('수집된 데이터:', formData);
    
    // 필수 필드 확인
    if (!formData.title) {
        alert('타이틀을 입력해주세요.');
        return;
    }
    
    // localStorage에 저장
    localStorage.setItem('golfTripData', JSON.stringify(formData));
    console.log('localStorage에 저장 완료');
    
    // 미리보기 페이지로 이동
    try {
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(formData));
        console.log('압축된 데이터 길이:', compressed.length);
        
        // URL 길이 체크
        if (compressed.length > 2500) {
            console.log('데이터가 큼 - localStorage 모드');
            // 데이터가 너무 크면 localStorage만 사용
            window.location.href = 'preview.html?mode=local';
        } else {
            console.log('데이터가 작음 - URL 모드');
            // URL에 데이터 포함
            window.location.href = 'preview.html?data=' + compressed;
        }
    } catch (error) {
        console.error('오류 발생:', error);
        alert('오류가 발생했습니다: ' + error.message);
    }
});

// 폼 데이터 수집 함수
function collectFormData() {
    const data = {
        title: document.getElementById('title')?.value || '',
        titleImage: document.querySelector('#titleImagePreview img')?.src || '',
        titleFont: document.getElementById('titleFont')?.value || "'Noto Sans KR', sans-serif",
        titleColor: document.getElementById('titleColor')?.value || '#1f2937',
        headerBgColor: document.getElementById('headerBgColor')?.value || '#ffffff',
        startDate: document.getElementById('startDate')?.value || '',
        endDate: document.getElementById('endDate')?.value || '',
        // 공항 미팅
        airportMeeting: {
            include: document.getElementById('airportMeetingInclude')?.checked ?? true,
            place: document.getElementById('airportMeetingPlace')?.value || '',
            date: document.getElementById('airportMeetingDate')?.value || '',
            time: document.getElementById('airportMeetingTime')?.value || '',
            name: document.getElementById('airportMeetingName')?.value || '',
            phone: document.getElementById('airportMeetingPhone')?.value || '',
            image: document.querySelector('#airportMeetingImagePreview img')?.src || ''
        },
        // 현지 미팅
        localMeeting: {
            include: document.getElementById('localMeetingInclude')?.checked ?? true,
            place: document.getElementById('localMeetingPlace')?.value || '',
            date: document.getElementById('localMeetingDate')?.value || '',
            time: document.getElementById('localMeetingTime')?.value || '',
            guide: document.getElementById('localMeetingGuide')?.value || '',
            phone: document.getElementById('localMeetingPhone')?.value || '',
            image: document.querySelector('#localMeetingImagePreview img')?.src || ''
        },
        departureAirport: document.getElementById('departureAirport')?.value || '',
        arrivalAirport: document.getElementById('arrivalAirport')?.value || '',
        departureFlight: document.getElementById('departureFlight')?.value || '',
        returnFlight: document.getElementById('returnFlight')?.value || '',
        flightImage: document.querySelector('#flightImagePreview img')?.src || '',
        accommodation: document.getElementById('accommodation')?.value || '',
        accommodationAddress: document.getElementById('accommodationAddress')?.value || '',
        accommodationImage: document.querySelector('#accommodationImagePreview img')?.src || '',
        notes: document.getElementById('notes')?.value || '',
        companyName: document.getElementById('companyName')?.value || '',
        companyPhone: document.getElementById('companyPhone')?.value || '',
        companyAddress: document.getElementById('companyAddress')?.value || '',
        managerName: document.getElementById('managerName')?.value || '',
        managerPhone: document.getElementById('managerPhone')?.value || '',
        managerEmail: document.getElementById('managerEmail')?.value || '',
        companyLogo: document.querySelector('#companyLogoPreview img')?.src || '',
        teeTimes: []
    };
    
    // TEE-UP 정보 수집
    document.querySelectorAll('.tee-time-item').forEach(item => {
        const teeData = {
            course: item.querySelector('.tee-course')?.value || '',
            date: item.querySelector('.tee-date')?.value || '',
            time: item.querySelector('.tee-time')?.value || '',
            image: item.querySelector('.tee-image-preview img')?.src || ''
        };
        data.teeTimes.push(teeData);
    });
    
    // 일정 및 식사 정보 수집
    data.schedules = [];
    document.querySelectorAll('.schedule-item').forEach(item => {
        const scheduleData = {
            date: item.querySelector('.schedule-date')?.value || '',
            title: item.querySelector('.schedule-title')?.value || '',
            detail: item.querySelector('.schedule-detail')?.value || '',
            meals: item.querySelector('.schedule-meals')?.value || '',
            image: item.querySelector('.schedule-image-preview img')?.src || '',
            includePreview: item.querySelector('.schedule-include-preview')?.checked ?? true
        };
        // 미리보기에 포함된 항목만 추가
        if (scheduleData.includePreview) {
            data.schedules.push(scheduleData);
        }
    });
    
    // 이미지 수집
    data.titleImage = document.querySelector('#titleImagePreview img')?.src || '';
    data.flightImage = document.querySelector('#flightImagePreview img')?.src || '';
    data.accommodationImage = document.querySelector('#accommodationImagePreview img')?.src || '';
    data.companyLogo = document.querySelector('#companyLogoPreview img')?.src || '';
    
    return data;
}

// 저장하기 버튼
document.getElementById('saveButton')?.addEventListener('click', function() {
    const name = prompt('안내문 이름을 입력하세요:');
    if (!name) return;
    
    const formData = collectFormData();
    
    // 저장된 목록 가져오기
    let savedList = JSON.parse(localStorage.getItem('savedGolfTrips') || '[]');
    
    // 새 항목 추가
    savedList.push({
        name: name,
        data: formData,
        savedAt: new Date().toISOString()
    });
    
    localStorage.setItem('savedGolfTrips', JSON.stringify(savedList));
    alert('저장되었습니다!');
});

// 불러오기 버튼
document.getElementById('loadButton')?.addEventListener('click', function() {
    const savedList = JSON.parse(localStorage.getItem('savedGolfTrips') || '[]');
    
    if (savedList.length === 0) {
        alert('저장된 안내문이 없습니다.');
        return;
    }
    
    let message = '불러올 안내문을 선택하세요:\n\n';
    savedList.forEach((item, index) => {
        const date = new Date(item.savedAt).toLocaleString('ko-KR');
        message += `${index + 1}. ${item.name} (${date})\n`;
    });
    
    const choice = prompt(message + '\n번호를 입력하세요:');
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < savedList.length) {
        loadFormData(savedList[index].data);
        alert('불러왔습니다!');
    }
});

// 폼 데이터 로드 함수
function loadFormData(data) {
    document.getElementById('title').value = data.title || '';
    document.getElementById('startDate').value = data.startDate || '';
    document.getElementById('endDate').value = data.endDate || '';
    
    // 타이틀 디자인 설정
    if (data.titleFont) {
        document.getElementById('titleFont').value = data.titleFont;
    }
    if (data.titleColor) {
        document.getElementById('titleColor').value = data.titleColor;
        document.getElementById('titleColorHex').value = data.titleColor;
    }
    if (data.headerBgColor) {
        document.getElementById('headerBgColor').value = data.headerBgColor;
        document.getElementById('headerBgColorHex').value = data.headerBgColor;
    }
    
    // 타이틀 이미지
    if (data.titleImage) {
        const preview = document.getElementById('titleImagePreview');
        preview.querySelector('img').src = data.titleImage;
        preview.classList.remove('hidden');
    }
    
    // 공항 미팅 (하위 호환성 유지)
    if (data.airportMeeting) {
        document.getElementById('airportMeetingInclude').checked = data.airportMeeting.include ?? true;
        document.getElementById('airportMeetingPlace').value = data.airportMeeting.place || '';
        document.getElementById('airportMeetingDate').value = data.airportMeeting.date || '';
        document.getElementById('airportMeetingTime').value = data.airportMeeting.time || '';
        document.getElementById('airportMeetingName').value = data.airportMeeting.name || '';
        document.getElementById('airportMeetingPhone').value = data.airportMeeting.phone || '';
        if (data.airportMeeting.image) {
            const preview = document.getElementById('airportMeetingImagePreview');
            preview.querySelector('img').src = data.airportMeeting.image;
            preview.classList.remove('hidden');
        }
    } else if (data.meetingPlace) {
        // 이전 버전 데이터 호환
        document.getElementById('airportMeetingPlace').value = data.meetingPlace || '';
        document.getElementById('airportMeetingDate').value = data.meetingDate || '';
        document.getElementById('airportMeetingTime').value = data.meetingTime || '';
    }
    
    // 현지 미팅
    if (data.localMeeting) {
        document.getElementById('localMeetingInclude').checked = data.localMeeting.include ?? true;
        document.getElementById('localMeetingPlace').value = data.localMeeting.place || '';
        document.getElementById('localMeetingDate').value = data.localMeeting.date || '';
        document.getElementById('localMeetingTime').value = data.localMeeting.time || '';
        document.getElementById('localMeetingGuide').value = data.localMeeting.guide || '';
        document.getElementById('localMeetingPhone').value = data.localMeeting.phone || '';
        if (data.localMeeting.image) {
            const preview = document.getElementById('localMeetingImagePreview');
            preview.querySelector('img').src = data.localMeeting.image;
            preview.classList.remove('hidden');
        }
    }
    
    document.getElementById('departureAirport').value = data.departureAirport || '';
    document.getElementById('arrivalAirport').value = data.arrivalAirport || '';
    document.getElementById('departureFlight').value = data.departureFlight || '';
    document.getElementById('returnFlight').value = data.returnFlight || '';
    
    // 항공편 이미지
    if (data.flightImage) {
        const preview = document.getElementById('flightImagePreview');
        preview.querySelector('img').src = data.flightImage;
        preview.classList.remove('hidden');
    }
    
    document.getElementById('accommodation').value = data.accommodation || '';
    document.getElementById('accommodationAddress').value = data.accommodationAddress || '';
    
    // 숙소 이미지
    if (data.accommodationImage) {
        const preview = document.getElementById('accommodationImagePreview');
        preview.querySelector('img').src = data.accommodationImage;
        preview.classList.remove('hidden');
    }
    
    // TEE-UP 정보 로드
    if (data.teeTimes && data.teeTimes.length > 0) {
        const container = document.getElementById('teeTimeContainer');
        container.innerHTML = ''; // 기존 항목 제거
        
        data.teeTimes.forEach((tee, index) => {
            // 첫 번째는 기본 항목, 이후는 추가
            if (index === 0) {
                document.getElementById('addTeeTime').click();
                const items = container.querySelectorAll('.tee-time-item');
                const item = items[items.length - 1];
                item.querySelector('.tee-course').value = tee.course || '';
                item.querySelector('.tee-date').value = tee.date || '';
                item.querySelector('.tee-time').value = tee.time || '';
                if (tee.image) {
                    const preview = item.querySelector('.tee-image-preview');
                    preview.querySelector('img').src = tee.image;
                    preview.classList.remove('hidden');
                }
            } else {
                document.getElementById('addTeeTime').click();
                const items = container.querySelectorAll('.tee-time-item');
                const item = items[items.length - 1];
                item.querySelector('.tee-course').value = tee.course || '';
                item.querySelector('.tee-date').value = tee.date || '';
                item.querySelector('.tee-time').value = tee.time || '';
                if (tee.image) {
                    const preview = item.querySelector('.tee-image-preview');
                    preview.querySelector('img').src = tee.image;
                    preview.classList.remove('hidden');
                }
            }
        });
    }
    
    // 일정 정보 로드
    if (data.schedules && data.schedules.length > 0) {
        const container = document.getElementById('scheduleContainer');
        container.innerHTML = ''; // 기존 항목 제거
        
        data.schedules.forEach((schedule, index) => {
            // 첫 번째는 기본 항목, 이후는 추가
            if (index === 0) {
                document.getElementById('addSchedule').click();
                const items = container.querySelectorAll('.schedule-item');
                const item = items[items.length - 1];
                item.querySelector('.schedule-date').value = schedule.date || '';
                item.querySelector('.schedule-title').value = schedule.title || '';
                
                // Quill 에디터에 HTML 로드
                const detailEditor = item.querySelector('.schedule-detail-editor');
                const mealsEditor = item.querySelector('.schedule-meals-editor');
                
                if (detailEditor && detailEditor._quill && schedule.detail) {
                    detailEditor._quill.root.innerHTML = schedule.detail;
                }
                if (mealsEditor && mealsEditor._quill && schedule.meals) {
                    mealsEditor._quill.root.innerHTML = schedule.meals;
                }
                
                if (schedule.image) {
                    const preview = item.querySelector('.schedule-image-preview');
                    preview.querySelector('img').src = schedule.image;
                    preview.classList.remove('hidden');
                }
                
                item.querySelector('.schedule-include-preview').checked = schedule.includePreview ?? true;
            } else {
                document.getElementById('addSchedule').click();
                const items = container.querySelectorAll('.schedule-item');
                const item = items[items.length - 1];
                item.querySelector('.schedule-date').value = schedule.date || '';
                item.querySelector('.schedule-title').value = schedule.title || '';
                
                // Quill 에디터에 HTML 로드
                const detailEditor = item.querySelector('.schedule-detail-editor');
                const mealsEditor = item.querySelector('.schedule-meals-editor');
                
                if (detailEditor && detailEditor._quill && schedule.detail) {
                    detailEditor._quill.root.innerHTML = schedule.detail;
                }
                if (mealsEditor && mealsEditor._quill && schedule.meals) {
                    mealsEditor._quill.root.innerHTML = schedule.meals;
                }
                
                if (schedule.image) {
                    const preview = item.querySelector('.schedule-image-preview');
                    preview.querySelector('img').src = schedule.image;
                    preview.classList.remove('hidden');
                }
                
                item.querySelector('.schedule-include-preview').checked = schedule.includePreview ?? true;
            }
        });
    }
    
    // 추가 안내사항 (Quill 에디터에 HTML 로드)
    if (data.notes && typeof notesQuill !== 'undefined') {
        notesQuill.root.innerHTML = data.notes;
    }
    
    document.getElementById('companyName').value = data.companyName || '';
    document.getElementById('companyPhone').value = data.companyPhone || '';
    document.getElementById('companyAddress').value = data.companyAddress || '';
    document.getElementById('managerName').value = data.managerName || '';
    document.getElementById('managerPhone').value = data.managerPhone || '';
    document.getElementById('managerEmail').value = data.managerEmail || '';
    
    // 회사 로고
    if (data.companyLogo) {
        const preview = document.getElementById('companyLogoPreview');
        preview.querySelector('img').src = data.companyLogo;
        preview.classList.remove('hidden');
    }
}

// 템플릿 저장 버튼
document.getElementById('saveTemplateButton')?.addEventListener('click', function() {
    const name = prompt('템플릿 이름을 입력하세요:');
    if (!name) return;
    
    const formData = collectFormData();
    const template = { design: formData.design };
    
    let templates = JSON.parse(localStorage.getItem('golfTripTemplates') || '[]');
    templates.push({
        name: name,
        template: template,
        savedAt: new Date().toISOString()
    });
    
    localStorage.setItem('golfTripTemplates', JSON.stringify(templates));
    alert('템플릿이 저장되었습니다!');
});

// 템플릿 불러오기 버튼
document.getElementById('loadTemplateButton')?.addEventListener('click', function() {
    const templates = JSON.parse(localStorage.getItem('golfTripTemplates') || '[]');
    
    if (templates.length === 0) {
        alert('저장된 템플릿이 없습니다.');
        return;
    }
    
    let message = '불러올 템플릿을 선택하세요:\n\n';
    templates.forEach((item, index) => {
        const date = new Date(item.savedAt).toLocaleString('ko-KR');
        message += `${index + 1}. ${item.name} (${date})\n`;
    });
    
    const choice = prompt(message + '\n번호를 입력하세요:');
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < templates.length) {
        const template = templates[index].template;
        if (template.design) {
            Object.keys(template.design).forEach(key => {
                const element = document.getElementById(key);
                if (element) element.value = template.design[key];
            });
        }
        alert('템플릿이 적용되었습니다!');
    }
});

console.log('골프 여행 안내문 생성기 JavaScript 로드 완료');
