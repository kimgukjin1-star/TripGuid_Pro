// JavaScript for travel-advanced.html

document.addEventListener('DOMContentLoaded', () => {
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
    
    document.getElementById('saveButton')?.addEventListener('click', showSaveModal);
    document.getElementById('loadButton')?.addEventListener('click', showLoadModal);
    document.getElementById('saveTemplateButton')?.addEventListener('click', showSaveTemplateModal);
    document.getElementById('loadTemplateButton')?.addEventListener('click', showLoadTemplateModal);

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
    const removeButtons = document.querySelectorAll(buttonSelector);
    
    // Hide all remove buttons initially
    removeButtons.forEach(btn => btn.style.display = 'none');

    // Show remove buttons only if there is more than one item
    if (items.length > 1) {
        items.forEach(item => {
            const removeBtn = item.querySelector(buttonSelector);
            if(removeBtn) removeBtn.style.display = 'block';
        });
    }
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
        ['teeupFont', 'teeupColor'],
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
        const previewUrl = `preview.html?data=${compressed}`;
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
    try {
        const response = await fetch('/api/trips');
        if (!response.ok) throw new Error('서버에서 목록을 불러오지 못했습니다.');
        const trips = await response.json();
        
        const listContainer = document.getElementById('savedList');
        listContainer.innerHTML = '';
        
        const travelTrips = trips.filter(trip => trip.data.type === 'travel');

        if (travelTrips.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-500">저장된 여행 안내문이 없습니다.</p>';
        } else {
            travelTrips.forEach(trip => {
                const item = document.createElement('div');
                item.className = 'p-3 border rounded-lg flex justify-between items-center';
                item.innerHTML = `
                    <div>
                        <p class="font-bold">${trip.name}</p>
                        <p class="text-sm text-gray-500">저장일: ${new Date(trip.savedAt).toLocaleString()}</p>
                    </div>
                `;
                const loadBtn = document.createElement('button');
                loadBtn.textContent = '불러오기';
                loadBtn.className = 'bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600';
                loadBtn.onclick = () => {
                    loadTravelFormData(trip.data);
                    hideModal('loadModal');
                    alert(`'${trip.name}' 안내문을 불러왔습니다.`);
                };
                item.appendChild(loadBtn);
                listContainer.appendChild(item);
            });
        }
        showModal('loadModal');
    } catch (error) {
        console.error('Error loading trips:', error);
        alert(error.message);
    }
}

async function showLoadTemplateModal() {
    try {
        const response = await fetch('/api/templates');
        if (!response.ok) throw new Error('서버에서 템플릿 목록을 불러오지 못했습니다.');
        const templates = await response.json();

        const listContainer = document.getElementById('templateList');
        listContainer.innerHTML = '';

        if (templates.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-500">저장된 템플릿이 없습니다.</p>';
        } else {
            templates.forEach(template => {
                const item = document.createElement('div');
                item.className = 'p-3 border rounded-lg flex justify-between items-center';
                item.innerHTML = `
                    <div>
                        <p class="font-bold">${template.name}</p>
                        <p class="text-sm text-gray-500">저장일: ${new Date(template.savedAt).toLocaleString()}</p>
                    </div>
                `;
                const loadBtn = document.createElement('button');
                loadBtn.textContent = '적용하기';
                loadBtn.className = 'bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600';
                loadBtn.onclick = () => {
                    loadDesignTemplate(template.data.design);
                    hideModal('templateLoadModal');
                    alert(`'${template.name}' 템플릿을 적용했습니다.`);
                };
                item.appendChild(loadBtn);
                listContainer.appendChild(item);
            });
        }
        showModal('templateLoadModal');
    } catch (error) {
        console.error('Error loading templates:', error);
        alert(error.message);
    }
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
        data: { design: formData.design, type: 'travel' },
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

function loadTravelFormData(data) {
    if (data.design) {
        loadDesignTemplate(data.design);
    }
    if (data.content) {
        const content = data.content;
        const setValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value || '';
        };
        const setSrc = (selector, src) => {
            const el = document.querySelector(selector);
            if (el && src) {
                el.src = src;
                const previewContainer = el.closest('div[id$="Preview"], .schedule-image-preview');
                if (previewContainer) previewContainer.classList.remove('hidden');
            }
        };

        // Populate all simple fields
        setValue('title', content.title);
        setSrc('#titleImagePreview img', content.titleImage);
        setValue('startDate', content.startDate);
        setValue('endDate', content.endDate);
        setValue('meetingPlace', content.meetingPlace);
        setValue('meetingDate', content.meetingDate);
        setValue('meetingTime', content.meetingTime);
        setSrc('#meetingImagePreview img', content.meetingImage);
        setValue('departureAirport', content.departureAirport);
        setValue('arrivalAirport', content.arrivalAirport);
        setValue('departureTime', content.departureTime);
        setValue('arrivalTime', content.arrivalTime);
        setValue('departureFlight', content.departureFlight);
        setValue('departureFlightDuration', content.departureFlightDuration);
        setValue('returnDepartureAirport', content.returnDepartureAirport);
        setValue('returnArrivalAirport', content.returnArrivalAirport);
        setValue('returnDepartureTime', content.returnDepartureTime);
        setValue('returnArrivalTime', content.returnArrivalTime);
        setValue('returnFlight', content.returnFlight);
        setValue('returnFlightDuration', content.returnFlightDuration);
        setSrc('#flightImagePreview img', content.flightImage);
        setValue('additionalInfo', content.additionalInfo);
        setValue('companyName', content.companyName);
        setValue('companyPhone', content.companyPhone);
        setValue('companyAddress', content.companyAddress);
        setValue('managerName', content.managerName);
        setValue('managerPhone', content.managerPhone);
        setValue('managerEmail', content.managerEmail);
        setSrc('#companyLogoPreview img', content.companyLogo);

        // Load schedules
        const scheduleContainer = document.getElementById('scheduleContainer');
        const template = document.querySelector('.schedule-item')?.cloneNode(true);
        
        scheduleContainer.innerHTML = ''; // Clear existing

        if (content.schedules && content.schedules.length > 0) {
            content.schedules.forEach(scheduleData => {
                if (!template) return;
                const newItem = template.cloneNode(true);
                
                newItem.querySelector('.schedule-day').value = scheduleData.day || '';
                newItem.querySelector('.schedule-date').value = scheduleData.date || '';
                newItem.querySelector('.schedule-title').value = scheduleData.title || '';
                newItem.querySelector('.schedule-detail').value = scheduleData.detail || '';
                newItem.querySelector('.schedule-hotel').value = scheduleData.hotel || '';
                newItem.querySelector('.schedule-meal').value = scheduleData.meal || '';
                
                if (scheduleData.image) {
                    const preview = newItem.querySelector('.schedule-image-preview');
                    preview.querySelector('img').src = scheduleData.image;
                    preview.classList.remove('hidden');
                } else {
                    const preview = newItem.querySelector('.schedule-image-preview');
                    preview.classList.add('hidden');
                    preview.querySelector('img').src = '';
                }
                scheduleContainer.appendChild(newItem);
            });
        } else if (template) {
            // Add one empty item if none are loaded
            const blankItem = template.cloneNode(true);
            blankItem.querySelectorAll('input, textarea').forEach(input => input.value = '');
            blankItem.querySelectorAll('.schedule-image-preview').forEach(p => p.classList.add('hidden'));
            scheduleContainer.appendChild(blankItem);
        }
        updateRemoveButtons('.schedule-item', '.remove-schedule-item');
    }
}

function loadDesignTemplate(design) {
    if (!design) return;
    for (const [key, value] of Object.entries(design)) {
        const element = document.getElementById(key);
        if (element) {
            element.value = value;
            if (element.type === 'color') {
                const hexEl = document.getElementById(key + 'Hex');
                if (hexEl) hexEl.value = value;
            }
        }
    }
}