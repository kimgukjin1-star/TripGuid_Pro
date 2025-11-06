console.log('미리보기 페이지 로드 시작...');
        
        // URL에서 데이터 가져오기
        function getDataFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');
            const compressedData = urlParams.get('data');
            
            console.log('모드:', mode);
            console.log('URL 데이터:', compressedData ? '있음' : '없음');
            
            let data = null;
            
            if (mode === 'local' || !compressedData) {
                // localStorage에서 가져오기
                const storedData = localStorage.getItem('golfTripData');
                console.log('localStorage 데이터:', storedData ? '있음' : '없음');
                if (storedData) {
                    data = JSON.parse(storedData);
                }
            } else {
                // URL에서 압축 해제
                try {
                    const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
                    data = JSON.parse(decompressed);
                    console.log('URL 데이터 압축 해제 성공');
                } catch (error) {
                    console.error('URL 데이터 압축 해제 실패:', error);
                }
            }
            
            return data;
        }
        
        // 데이터 렌더링
        function renderData(data) {
            if (!data) {
                document.getElementById('contentArea').innerHTML = `
                    <div class="section-box pink">
                        <h2 class="text-xl font-bold text-red-600 mb-2">
                            <i class="fas fa-exclamation-triangle mr-2"></i>데이터를 불러올 수 없습니다
                        </h2>
                        <p class="text-gray-700">안내문 작성 페이지에서 다시 시도해주세요.</p>
                        <button onclick="goBack()" class="btn btn-primary mt-4">
                            <i class="fas fa-arrow-left mr-2"></i>작성 페이지로 돌아가기
                        </button>
                    </div>
                `;
                return;
            }
            
            console.log('렌더링할 데이터:', data);
            
            // 타이틀 디자인 적용
            const titleElement = document.getElementById('title');
            titleElement.textContent = data.title || '골프 여행 안내문';
            
            // 타이틀 폰트 적용
            if (data.titleFont) {
                titleElement.style.fontFamily = data.titleFont;
            }
            
            // 타이틀 색상 적용
            if (data.titleColor) {
                titleElement.style.color = data.titleColor;
            }
            
            // 헤더 배경색 적용
            const headerSection = document.querySelector('.header-section');
            if (data.headerBgColor) {
                headerSection.style.background = data.headerBgColor;
            }
            
            // 기간
            if (data.startDate && data.endDate) {
                document.getElementById('period').textContent = 
                    `${formatDate(data.startDate)} ~ ${formatDate(data.endDate)}`;
            }
            
            // 타이틀 배경 이미지
            if (data.titleImage) {
                const bgDiv = document.createElement('div');
                bgDiv.className = 'header-background';
                bgDiv.style.backgroundImage = `url(${data.titleImage})`;
                headerSection.insertBefore(bgDiv, headerSection.firstChild);
            }
            
            let html = '';
            
            // 공항 미팅
            if (data.airportMeeting && data.airportMeeting.include && 
                (data.airportMeeting.place || data.airportMeeting.name)) {
                html += renderAirportMeeting(data.airportMeeting);
            }
            
            // 현지 미팅
            if (data.localMeeting && data.localMeeting.include && 
                (data.localMeeting.place || data.localMeeting.guide)) {
                html += renderLocalMeeting(data.localMeeting);
            }
            
            // 항공편
            if (data.departureAirport || data.arrivalAirport) {
                html += renderFlight(data);
            }
            
            // 골프장 & TEE-UP
            if (data.teeTimes && data.teeTimes.length > 0) {
                html += renderTeeTimes(data.teeTimes);
            }
            
            // 일정 및 식사
            if (data.schedules && data.schedules.length > 0) {
                html += renderSchedules(data.schedules);
            }
            
            // 숙소
            if (data.accommodation) {
                html += renderAccommodation(data);
            }
            
            // 추가 안내사항
            if (data.notes) {
                html += renderNotes(data.notes);
            }
            
            // 회사 정보
            if (data.companyName) {
                html += renderCompany(data);
            }
            
            document.getElementById('contentArea').innerHTML = html;
        }
        
        // 날짜 포맷
        function formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'short'
            });
        }
        
        // 공항 미팅 렌더링
        function renderAirportMeeting(meeting) {
            return `
                <div class="section-box purple">
                    <h2 class="text-2xl font-bold text-purple-700 mb-4">
                        <i class="fas fa-plane-arrival mr-2"></i>공항 미팅
                    </h2>
                    ${meeting.place ? `<div class="info-row"><span class="info-label">장소</span><span class="info-value">${meeting.place}</span></div>` : ''}
                    ${meeting.date ? `<div class="info-row"><span class="info-label">날짜</span><span class="info-value">${formatDate(meeting.date)}</span></div>` : ''}
                    ${meeting.time ? `<div class="info-row"><span class="info-label">시간</span><span class="info-value">${meeting.time}</span></div>` : ''}
                    ${meeting.name ? `<div class="info-row"><span class="info-label">담당자</span><span class="info-value">${meeting.name}</span></div>` : ''}
                    ${meeting.phone ? `<div class="info-row"><span class="info-label">전화번호</span><span class="info-value">${meeting.phone}</span></div>` : ''}
                    ${meeting.image ? `<img src="${meeting.image}" class="preview-image" alt="공항 미팅">` : ''}
                </div>
            `;
        }
        
        // 현지 미팅 렌더링
        function renderLocalMeeting(meeting) {
            return `
                <div class="section-box purple">
                    <h2 class="text-2xl font-bold text-purple-700 mb-4">
                        <i class="fas fa-map-marker-alt mr-2"></i>현지 미팅
                    </h2>
                    ${meeting.place ? `<div class="info-row"><span class="info-label">장소</span><span class="info-value">${meeting.place}</span></div>` : ''}
                    ${meeting.date ? `<div class="info-row"><span class="info-label">날짜</span><span class="info-value">${formatDate(meeting.date)}</span></div>` : ''}
                    ${meeting.time ? `<div class="info-row"><span class="info-label">시간</span><span class="info-value">${meeting.time}</span></div>` : ''}
                    ${meeting.guide ? `<div class="info-row"><span class="info-label">가이드</span><span class="info-value">${meeting.guide}</span></div>` : ''}
                    ${meeting.phone ? `<div class="info-row"><span class="info-label">전화번호</span><span class="info-value">${meeting.phone}</span></div>` : ''}
                    ${meeting.image ? `<img src="${meeting.image}" class="preview-image" alt="현지 미팅">` : ''}
                </div>
            `;
        }
        
        // 항공편 렌더링
        function renderFlight(data) {
            return `
                <div class="section-box blue">
                    <h2 class="text-2xl font-bold text-blue-700 mb-4">
                        <i class="fas fa-plane mr-2"></i>항공편 정보
                    </h2>
                    ${data.departureAirport ? `<div class="info-row"><span class="info-label">출발 공항</span><span class="info-value">${data.departureAirport}</span></div>` : ''}
                    ${data.departureFlight ? `<div class="info-row"><span class="info-label">출발편</span><span class="info-value">${data.departureFlight}</span></div>` : ''}
                    ${data.arrivalAirport ? `<div class="info-row"><span class="info-label">도착 공항</span><span class="info-value">${data.arrivalAirport}</span></div>` : ''}
                    ${data.returnFlight ? `<div class="info-row"><span class="info-label">귀국편</span><span class="info-value">${data.returnFlight}</span></div>` : ''}
                    ${data.flightImage ? `<img src="${data.flightImage}" class="preview-image" alt="항공편">` : ''}
                </div>
            `;
        }
        
        // 골프장 & TEE-UP 렌더링
        function renderTeeTimes(teeTimes) {
            let html = `
                <div class="section-box green">
                    <h2 class="text-2xl font-bold text-green-700 mb-4">
                        <i class="fas fa-golf-ball mr-2"></i>골프장 & TEE-UP
                    </h2>
            `;
            
            teeTimes.forEach((tee, index) => {
                if (tee.course) {
                    html += `
                        <div class="mb-4 p-4 bg-white rounded-lg ${index > 0 ? 'mt-4' : ''}">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">${tee.course}</h3>
                            ${tee.date ? `<div class="info-row"><span class="info-label">날짜</span><span class="info-value">${formatDate(tee.date)}</span></div>` : ''}
                            ${tee.time ? `<div class="info-row"><span class="info-label">티업 시간</span><span class="info-value">${tee.time}</span></div>` : ''}
                            ${tee.image ? `<img src="${tee.image}" class="preview-image" alt="${tee.course}">` : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
            return html;
        }
        
        // 일정 및 식사 렌더링
        function renderSchedules(schedules) {
            let html = `
                <div class="section-box sky">
                    <h2 class="text-2xl font-bold text-sky-700 mb-4">
                        <i class="fas fa-calendar-check mr-2"></i>일정 및 식사
                    </h2>
            `;
            
            schedules.forEach((schedule, index) => {
                if (schedule.title || schedule.detail) {
                    html += `
                        <div class="mb-4 p-4 bg-white rounded-lg ${index > 0 ? 'mt-4' : ''}">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">
                                ${schedule.title || `Day ${index + 1}`}
                            </h3>
                            ${schedule.date ? `<div class="info-row"><span class="info-label">날짜</span><span class="info-value">${formatDate(schedule.date)}</span></div>` : ''}
                            ${schedule.detail ? `<div class="mt-3 p-3 bg-gray-50 rounded ql-editor-content">${schedule.detail}</div>` : ''}
                            ${schedule.meals ? `<div class="mt-3 p-3 bg-yellow-50 rounded ql-editor-content"><strong>식사 및 포함사항:</strong><br>${schedule.meals}</div>` : ''}
                            ${schedule.image ? `<img src="${schedule.image}" class="preview-image" alt="${schedule.title}">` : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
            return html;
        }
        
        // 숙소 렌더링
        function renderAccommodation(data) {
            return `
                <div class="section-box orange">
                    <h2 class="text-2xl font-bold text-orange-700 mb-4">
                        <i class="fas fa-hotel mr-2"></i>숙소 정보
                    </h2>
                    ${data.accommodation ? `<div class="info-row"><span class="info-label">숙소명</span><span class="info-value">${data.accommodation}</span></div>` : ''}
                    ${data.accommodationAddress ? `<div class="info-row"><span class="info-label">주소</span><span class="info-value">${data.accommodationAddress}</span></div>` : ''}
                    ${data.accommodationImage ? `<img src="${data.accommodationImage}" class="preview-image" alt="숙소">` : ''}
                </div>
            `;
        }
        
        // 추가 안내사항 렌더링
        function renderNotes(notes) {
            return `
                <div class="section-box pink">
                    <h2 class="text-2xl font-bold text-pink-700 mb-4">
                        <i class="fas fa-info-circle mr-2"></i>추가 안내사항
                    </h2>
                    <div class="text-gray-700 ql-editor-content">${notes}</div>
                </div>
            `;
        }
        
        // 회사 정보 렌더링
        function renderCompany(data) {
            return `
                <div class="section-box purple">
                    <h2 class="text-2xl font-bold text-purple-700 mb-4">
                        <i class="fas fa-building mr-2"></i>문의
                    </h2>
                    ${data.companyName ? `<div class="info-row"><span class="info-label">회사명</span><span class="info-value">${data.companyName}</span></div>` : ''}
                    ${data.companyPhone ? `<div class="info-row"><span class="info-label">대표 전화번호</span><span class="info-value">${data.companyPhone}</span></div>` : ''}
                    ${data.companyAddress ? `<div class="info-row"><span class="info-label">회사 주소</span><span class="info-value">${data.companyAddress}</span></div>` : ''}
                    ${data.managerName || data.managerPhone || data.managerEmail ? `
                        <div class="mt-4 p-3 bg-purple-50 rounded-lg">
                            <h3 class="text-lg font-bold text-purple-700 mb-2">
                                <i class="fas fa-user-tie mr-1"></i>담당자 정보
                            </h3>
                            ${data.managerName ? `<div class="info-row"><span class="info-label">담당자명</span><span class="info-value">${data.managerName}</span></div>` : ''}
                            ${data.managerPhone ? `<div class="info-row"><span class="info-label">담당자 전화번호</span><span class="info-value">${data.managerPhone}</span></div>` : ''}
                            ${data.managerEmail ? `<div class="info-row"><span class="info-label">담당자 이메일</span><span class="info-value">${data.managerEmail}</span></div>` : ''}
                        </div>
                    ` : ''}
                    ${data.companyLogo ? `<img src="${data.companyLogo}" class="preview-image" alt="회사 로고" style="max-height: 100px;">` : ''}
                </div>
            `;
        }
        
        // 뒤로 가기
        function goBack() {
            window.history.back();
        }
        
        // 링크 복사
        function copyLink() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('링크가 복사되었습니다!');
            }).catch(err => {
                console.error('링크 복사 실패:', err);
                alert('링크 복사에 실패했습니다.');
            });
        }
        
        // 고해상도 이미지 저장
        async function saveAsImage() {
            const buttons = document.querySelector('.share-buttons');
            buttons.style.display = 'none';
            
            try {
                const element = document.getElementById('previewContent');
                const canvas = await html2canvas(element, {
                    scale: 3, // 3배 해상도 (고해상도)
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: element.offsetWidth,
                    height: element.offsetHeight
                });
                
                // 캔버스를 이미지로 변환
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const title = document.getElementById('title').textContent || '골프여행안내문';
                    link.download = `${title}_${new Date().getTime()}.png`;
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                    
                    alert('고해상도 이미지가 저장되었습니다!');
                }, 'image/png', 1.0);
            } catch (error) {
                console.error('이미지 저장 실패:', error);
                alert('이미지 저장에 실패했습니다.');
            } finally {
                buttons.style.display = 'flex';
            }
        }
        
        // 페이지 로드 시 실행
        window.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded 이벤트 발생');
            const data = getDataFromURL();
            renderData(data);
        });