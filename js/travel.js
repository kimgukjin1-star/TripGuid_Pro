// JavaScript for travel-advanced.html

document.addEventListener('DOMContentLoaded', () => {
    // 폼 ID를 travelForm으로 변경
    const form = document.getElementById('golfForm');
    if(form) form.id = 'travelForm';

    initializeDynamicFeatures();
    initializeColorSync();
});

function initializeDynamicFeatures() {
    document.getElementById('addSchedule')?.addEventListener('click', addScheduleItem);
    document.body.addEventListener('change', handleImageUploadDelegation);
    document.body.addEventListener('click', handleImageRemoveDelegation);
    updateRemoveButtons('.schedule-item', '.remove-schedule-item');
    document.getElementById('travelForm')?.addEventListener('submit', handleFormSubmit);
    
    // 서버 연동 기능 (저장/불러오기)
    document.getElementById('saveButton')?.addEventListener('click', showSaveModal);
    document.getElementById('loadButton')?.addEventListener('click', showLoadModal);
    document.getElementById('saveTemplateButton')?.addEventListener('click', showSaveTemplateModal);
    document.getElementById('loadTemplateButton')?.addEventListener('click', showLoadTemplateModal);

    // 모달 이벤트
    document.getElementById('confirmSave')?.addEventListener('click', handleSaveTrip);
    document.getElementById('cancelSave')?.addEventListener('click', () => hideModal('saveModal'));
    document.getElementById('closeLoad')?.addEventListener('click', () => hideModal('loadModal'));
    
    document.getElementById('confirmTemplateSave')?.addEventListener('click', handleSaveTemplate);
    document.getElementById('closeTemplateSave')?.addEventListener('click', () => hideModal('templateSaveModal'));
    document.getElementById('closeTemplateLoad')?.addEventListener('click', () => hideModal('templateLoadModal'));
}

function addScheduleItem() {
    const container = document.getElementById('scheduleContainer');
    const template = document.querySelector('.schedule-item');
    if (!template) return;
    const newItem = template.cloneNode(true);

    newItem.querySelectorAll('input, textarea').forEach(input => input.value = '');
    const preview = newItem.querySelector('.schedule-image-preview');
    if (preview) {
        preview.classList.add('hidden');
        preview.querySelector('img').src = '';
    }
    container.appendChild(newItem);
    updateRemoveButtons('.schedule-item', '.remove-schedule-item');
}

function updateRemoveButtons(itemSelector, buttonSelector) {
    const items = document.querySelectorAll(itemSelector);
    items.forEach(item => {
        const removeBtn = item.querySelector(buttonSelector);
        if (removeBtn) {
            removeBtn.style.display = items.length > 1 ? 'block' : 'none';
        }
    });
}

function handleImageUploadDelegation(event) {
    const target = event.target;
    if (target.type === 'file' && target.accept.startsWith('image/')) {
        const previewContainer = target.closest('.mt-3, .mb-4').querySelector('div[id$="Preview"], .schedule-image-preview');
        if (previewContainer) {
            handleImageUpload(event, previewContainer);
        }
    }
}

function handleImageRemoveDelegation(event) {
    const removeButton = event.target.closest('.remove-image, .remove-schedule-image');
    if (removeButton) {
        const container = removeButton.parentElement;
        const input = container.closest('.mt-3, .mb-4').querySelector('input[type="file"]');
        container.classList.add('hidden');
        container.querySelector('img').src = '';
        if (input) input.value = '';
    }
}

function handleImageUpload(event, previewContainer) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewContainer.querySelector('img').src = e.target.result;
        previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function initializeColorSync() {
    const colorPairs = [
        ['titleColor', 'titleColorHex'], ['periodColor', 'periodColorHex'],
        ['meetingColor', 'meetingColorHex'], ['flightColor', 'flightColorHex'],
        ['teeupFont', 'teeupColor'], // Note: teeupFont is likely a typo in original, should be scheduleFont
        ['additionalColor', 'additionalColorHex'], ['companyColor', 'companyColorHex']
    ];
    colorPairs.forEach(([colorId, hexId]) => syncColorInputs(colorId, hexId));
}

function syncColorInputs(colorId, hexId) {
    const colorInput = document.getElementById(colorId);
    const hexInput = document.getElementById(hexId);
    if (!colorInput || !hexInput) return;
    colorInput.addEventListener('input', () => hexInput.value = colorInput.value);
    hexInput.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) colorInput.value = hexInput.value;
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = collectTravelFormData();
    if (!formData.content.title) {
        alert('타이틀을 입력해주세요.');
        return;
    }
    try {
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(formData));
        const previewUrl = `../golf/preview.html?data=${compressed}`;
        window.open(previewUrl, '_blank');
    } catch (error) {
        console.error('미리보기 생성 오류:', error);
        alert('미리보기를 생성하는 중 오류가 발생했습니다.');
    }
}

function collectTravelFormData() {
    const getValue = (id) => document.getElementById(id)?.value || '';
    const getSrc = (selector) => document.querySelector(selector)?.src || '';

    return {
        type: 'travel',
        design: {
            titleFont: getValue('titleFont'),
            titleColor: getValue('titleColor'),
            periodFont: getValue('periodFont'),
            periodFontSize: getValue('periodFontSize'),
            periodColor: getValue('periodColor'),
            // ... other design fields
        },
        content: {
            title: getValue('title'),
            titleImage: getSrc('#titleImagePreview img'),
            startDate: getValue('startDate'),
            endDate: getValue('endDate'),
            meetingPlace: getValue('meetingPlace'),
            meetingDate: getValue('meetingDate'),
            meetingTime: getValue('meetingTime'),
            meetingImage: getSrc('#meetingImagePreview img'),
            departureAirport: getValue('departureAirport'),
            arrivalAirport: getValue('arrivalAirport'),
            departureTime: getValue('departureTime'),
            arrivalTime: getValue('arrivalTime'),
            departureFlight: getValue('departureFlight'),
            departureFlightDuration: getValue('departureFlightDuration'),
            returnDepartureAirport: getValue('returnDepartureAirport'),
            returnArrivalAirport: getValue('returnArrivalAirport'),
            returnDepartureTime: getValue('returnDepartureTime'),
            returnArrivalTime: getValue('returnArrivalTime'),
            returnFlight: getValue('returnFlight'),
            returnFlightDuration: getValue('returnFlightDuration'),
            flightImage: getSrc('#flightImagePreview img'),
            additionalInfo: getValue('additionalInfo'),
            companyName: getValue('companyName'),
            companyPhone: getValue('companyPhone'),
            companyAddress: getValue('companyAddress'),
            managerName: getValue('managerName'),
            managerPhone: getValue('managerPhone'),
            managerEmail: getValue('managerEmail'),
            companyLogo: getSrc('#companyLogoPreview img'),
            schedules: Array.from(document.querySelectorAll('.schedule-item')).map(item => ({
                day: item.querySelector('.schedule-day')?.value || '',
                date: item.querySelector('.schedule-date')?.value || '',
                title: item.querySelector('.schedule-title')?.value || '',
                detail: item.querySelector('.schedule-detail')?.value || '',
                hotel: item.querySelector('.schedule-hotel')?.value || '',
                meal: item.querySelector('.schedule-meal')?.value || '',
                image: item.querySelector('.schedule-image-preview img')?.src || ''
            }))
        }
    };
}

// --- 서버 연동 (Save/Load) ---
function showModal(modalId) { document.getElementById(modalId)?.classList.remove('hidden'); document.getElementById(modalId)?.classList.add('flex'); }
function hideModal(modalId) { document.getElementById(modalId)?.classList.add('hidden'); document.getElementById(modalId)?.classList.remove('flex'); }

function showSaveModal() {
    document.getElementById('saveName').value = '';
    showModal('saveModal');
}

function showSaveTemplateModal() {
    document.getElementById('templateName').value = '';
    showModal('templateSaveModal');
}

async function showLoadModal() {
    // This function would be similar to the one in golf.js but for travel data
    alert('여행 안내문 불러오기 기능은 이 파일에서 별도 구현이 필요합니다.');
}

async function showLoadTemplateModal() {
    alert('여행 템플릿 불러오기 기능은 이 파일에서 별도 구현이 필요합니다.');
}

async function handleSaveTrip() {
    const name = document.getElementById('saveName').value;
    if (!name) return alert('저장할 이름을 입력하세요.');
    
    const payload = {
        name: name,
        data: collectTravelFormData(),
        savedAt: new Date().toISOString()
    };

    try {
        const response = await fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('저장에 실패했습니다.');
        alert('성공적으로 저장되었습니다.');
        hideModal('saveModal');
    } catch (error) {
        alert(error.message);
    }
}

async function handleSaveTemplate() {
     const name = document.getElementById('templateName').value;
    if (!name) return alert('템플릿 이름을 입력하세요.');

    const formData = collectTravelFormData();
    const payload = {
        name: name,
        data: { design: formData.design },
        savedAt: new Date().toISOString()
    };

    try {
        const response = await fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('템플릿 저장에 실패했습니다.');
        alert('템플릿이 성공적으로 저장되었습니다.');
        hideModal('templateSaveModal');
    } catch (error) {
        alert(error.message);
    }
}
