let extractedData = null;

        // 드래그 앤 드롭
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // 파일 처리
        function handleFile(file) {
            if (!file.name.match(/\.(xlsx|xls)$/i)) {
                alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
                return;
            }

            // 단계 2 활성화
            document.getElementById('step2').classList.add('active');

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    console.log('워크북 로드 성공');
                    console.log('시트 목록:', workbook.SheetNames);
                    
                    // 첫 번째 시트 읽기
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
                        header: 1,
                        defval: '',
                        blankrows: false,
                        raw: false  // 날짜를 문자열로 변환
                    });
                    
                    console.log('시트 데이터 읽기 성공, 행 수:', jsonData.length);
                    console.log('첫 5행:', jsonData.slice(0, 5));
                    
                    if (jsonData.length === 0) {
                        alert('엑셀 파일이 비어있습니다. 데이터를 입력해주세요.');
                        return;
                    }
                    
                    // 데이터 추출
                    extractedData = parseExcelData(jsonData);
                    
                    // 단계 3 활성화
                    document.getElementById('step3').classList.add('active');
                    
                    // 미리보기 표시
                    showPreview(extractedData);
                } catch (error) {
                    console.error('엑셀 파싱 오류:', error);
                    alert('엑셀 파일을 읽는 중 오류가 발생했습니다.\n\n오류: ' + error.message + '\n\n파일이 손상되었거나 지원하지 않는 형식일 수 있습니다.');
                    document.getElementById('step2').classList.remove('active');
                }
            };
            
            reader.onerror = function(error) {
                console.error('파일 읽기 오류:', error);
                alert('파일을 읽을 수 없습니다. 다시 시도해주세요.');
                document.getElementById('step2').classList.remove('active');
            };
            
            reader.readAsArrayBuffer(file);
        }

        // 엑셀 데이터 파싱 (정확한 템플릿 형식용)
        function parseExcelData(rows) {
            console.log('===== 엑셀 파싱 시작 =====');
            console.log('총 행 수:', rows.length);
            console.log('원본 데이터:', rows);
            
            const data = {
                title: '',
                startDate: '',
                endDate: '',
                airportMeeting: {
                    include: true,
                    place: '',
                    date: '',
                    time: '',
                    name: '',
                    phone: '',
                    image: ''
                },
                localMeeting: {
                    include: true,
                    place: '',
                    date: '',
                    time: '',
                    guide: '',
                    phone: '',
                    image: ''
                },
                departureAirport: '',
                arrivalAirport: '',
                departureFlight: '',
                returnFlight: '',
                accommodation: '',
                accommodationAddress: '',
                notes: '',
                companyName: '',
                companyPhone: '',
                companyAddress: '',
                managerName: '',
                managerPhone: '',
                managerEmail: '',
                teeTimes: [],
                schedules: []
            };
            
            // 템플릿 형식 매핑 (항목명 → 데이터 필드)
            const keyMapping = {
                '여행제목': 'title',
                '출발일': 'startDate',
                '도착일': 'endDate',
                '공항미팅_장소': 'airportMeeting.place',
                '공항미팅_날짜': 'airportMeeting.date',
                '공항미팅_시간': 'airportMeeting.time',
                '공항미팅_담당자': 'airportMeeting.name',
                '공항미팅_전화': 'airportMeeting.phone',
                '현지미팅_장소': 'localMeeting.place',
                '현지미팅_날짜': 'localMeeting.date',
                '현지미팅_시간': 'localMeeting.time',
                '현지미팅_가이드': 'localMeeting.guide',
                '현지미팅_전화': 'localMeeting.phone',
                '출발공항': 'departureAirport',
                '도착공항': 'arrivalAirport',
                '출발편': 'departureFlight',
                '귀국편': 'returnFlight',
                '숙소명': 'accommodation',
                '숙소주소': 'accommodationAddress',
                '회사명': 'companyName',
                '회사전화': 'companyPhone',
                '회사주소': 'companyAddress',
                '담당자명': 'managerName',
                '담당자전화': 'managerPhone',
                '담당자이메일': 'managerEmail'
            };

            // 템플릿 형식으로 파싱 (항목 | 값 구조)
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length < 2) continue;
                
                const key = String(row[0] || '').trim();
                const value = String(row[1] || '').trim();
                
                // 빈 행이나 구분선 건너뛰기
                if (!key || !value || key.startsWith('===')) continue;
                
                console.log(`처리 중: [${key}] = [${value}]`);
                
                // 정확한 키 매칭
                if (keyMapping[key]) {
                    const fieldPath = keyMapping[key];
                    const keys = fieldPath.split('.');
                    
                    if (keys.length === 1) {
                        // 단순 필드
                        if (key === '출발일' || key === '도착일') {
                            data[keys[0]] = convertToDateFormat(value);
                            console.log(`✅ ${key}: ${data[keys[0]]}`);
                        } else {
                            data[keys[0]] = value;
                            console.log(`✅ ${key}: ${value}`);
                        }
                    } else if (keys.length === 2) {
                        // 중첩 객체 필드
                        if (key.includes('날짜')) {
                            data[keys[0]][keys[1]] = convertToDateFormat(value);
                            console.log(`✅ ${key}: ${data[keys[0]][keys[1]]}`);
                        } else {
                            data[keys[0]][keys[1]] = value;
                            console.log(`✅ ${key}: ${value}`);
                        }
                    }
                } else {
                    // 유연한 키워드 매칭 (템플릿 형식이 아닌 경우 대비)
                    const keyLower = key.toLowerCase();
                    
                    if (keyLower.includes('여행') && keyLower.includes('제목') || keyLower === '제목') {
                        data.title = value;
                        console.log(`✅ 여행제목 (유연 매칭): ${value}`);
                    } else if (keyLower.includes('출발') && keyLower.includes('일')) {
                        data.startDate = convertToDateFormat(value);
                        console.log(`✅ 출발일 (유연 매칭): ${data.startDate}`);
                    } else if (keyLower.includes('도착') && keyLower.includes('일') || keyLower.includes('종료')) {
                        data.endDate = convertToDateFormat(value);
                        console.log(`✅ 도착일 (유연 매칭): ${data.endDate}`);
                    } else if (keyLower.includes('출발') && keyLower.includes('공항')) {
                        data.departureAirport = value;
                        console.log(`✅ 출발공항 (유연 매칭): ${value}`);
                    } else if (keyLower.includes('도착') && keyLower.includes('공항')) {
                        data.arrivalAirport = value;
                        console.log(`✅ 도착공항 (유연 매칭): ${value}`);
                    } else if (keyLower.includes('숙소') && !keyLower.includes('주소')) {
                        data.accommodation = value;
                        console.log(`✅ 숙소 (유연 매칭): ${value}`);
                    } else if (keyLower.includes('회사') && keyLower.includes('명')) {
                        data.companyName = value;
                        console.log(`✅ 회사명 (유연 매칭): ${value}`);
                    } else if (keyLower.includes('담당자') && (keyLower.includes('명') || keyLower.includes('이름'))) {
                        data.managerName = value;
                        console.log(`✅ 담당자명 (유연 매칭): ${value}`);
                    } else if (keyLower.includes('담당자') && keyLower.includes('전화')) {
                        data.managerPhone = value;
                        console.log(`✅ 담당자전화 (유연 매칭): ${value}`);
                    } else if (keyLower.includes('이메일')) {
                        data.managerEmail = value;
                        console.log(`✅ 이메일 (유연 매칭): ${value}`);
                    }
                }
            }

            // 골프장 데이터 추출 (골프장1_이름, 골프장2_이름 등)
            const golfCourseData = {};
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length < 2) continue;
                
                const key = String(row[0] || '').trim();
                const value = String(row[1] || '').trim();
                
                // 골프장 데이터 패턴 매칭 (골프장1_이름, 골프장2_날짜 등)
                const golfMatch = key.match(/^골프장(\d+)_(.+)$/);
                if (golfMatch) {
                    const courseNum = golfMatch[1];
                    const field = golfMatch[2];
                    
                    if (!golfCourseData[courseNum]) {
                        golfCourseData[courseNum] = {};
                    }
                    
                    golfCourseData[courseNum][field] = value;
                    console.log(`✅ 골프장${courseNum}_${field}: ${value}`);
                }
            }
            
            // 골프장 데이터를 teeTimes 배열로 변환
            Object.keys(golfCourseData).sort().forEach(num => {
                const course = golfCourseData[num];
                if (course.이름 || course.날짜) {
                    data.teeTimes.push({
                        courseName: course.이름 || '',
                        date: course.날짜 ? convertToDateFormat(course.날짜) : '',
                        time: course.시간 || '',
                        holes: course.홀수 || '',
                        greenFee: course.그린피 || '',
                        caddyFee: course.캐디피 || '',
                        cartFee: course.카트비 || '',
                        image: '',
                        includePreview: true
                    });
                    console.log(`✅ 골프장 ${num} 추가됨`);
                }
            });
            
            // 일정 데이터 추출 (일정1_날짜, 일정2_제목 등)
            const scheduleData = {};
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length < 2) continue;
                
                const key = String(row[0] || '').trim();
                const value = String(row[1] || '').trim();
                
                // 일정 데이터 패턴 매칭 (일정1_날짜, 일정2_제목 등)
                const scheduleMatch = key.match(/^일정(\d+)_(.+)$/);
                if (scheduleMatch) {
                    const scheduleNum = scheduleMatch[1];
                    const field = scheduleMatch[2];
                    
                    if (!scheduleData[scheduleNum]) {
                        scheduleData[scheduleNum] = {};
                    }
                    
                    scheduleData[scheduleNum][field] = value;
                    console.log(`✅ 일정${scheduleNum}_${field}: ${value}`);
                }
            }
            
            // 일정 데이터를 schedules 배열로 변환
            Object.keys(scheduleData).sort().forEach(num => {
                const schedule = scheduleData[num];
                if (schedule.날짜 || schedule.제목) {
                    data.schedules.push({
                        date: schedule.날짜 || '',
                        title: schedule.제목 || '',
                        detail: schedule.상세 || '',
                        meals: schedule.식사 || '',
                        image: '',
                        includePreview: true
                    });
                    console.log(`✅ 일정 ${num} 추가됨`);
                }
            });

            console.log('최종 추출 데이터:', data);
            console.log('골프장 개수:', data.teeTimes.length);
            console.log('일정 개수:', data.schedules.length);
            return data;
        }

        // 날짜 형식 변환
        function convertToDateFormat(dateStr) {
            if (!dateStr) return '';
            
            const str = String(dateStr).trim();
            
            // 엑셀 날짜 (숫자) 처리
            if (!isNaN(str) && str.length < 10) {
                const excelDate = parseFloat(str);
                if (excelDate > 40000 && excelDate < 60000) { // 2009-2064년 범위
                    const date = new Date((excelDate - 25569) * 86400 * 1000);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            }
            
            // YYYY-MM-DD, YYYY.MM.DD, YYYY/MM/DD 형식
            const match1 = str.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
            if (match1) {
                const year = match1[1];
                const month = match1[2].padStart(2, '0');
                const day = match1[3].padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            
            // YYYYMMDD 형식
            const match2 = str.match(/^(\d{4})(\d{2})(\d{2})$/);
            if (match2) {
                return `${match2[1]}-${match2[2]}-${match2[3]}`;
            }
            
            // MM/DD/YYYY 형식
            const match3 = str.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
            if (match3) {
                const month = match3[1].padStart(2, '0');
                const day = match3[2].padStart(2, '0');
                const year = match3[3];
                return `${year}-${month}-${day}`;
            }
            
            return '';
        }

        // 미리보기 표시
        function showPreview(data) {
            const preview = document.getElementById('previewContent');
            let html = '<div class="space-y-3">';
            let hasData = false;

            // 주요 정보만 표시
            if (data.title) {
                html += `<div class="p-2 bg-purple-50 rounded"><strong class="text-purple-700">✈️ 여행 제목:</strong> ${data.title}</div>`;
                hasData = true;
            }
            if (data.startDate) {
                html += `<div><strong>📅 출발일:</strong> ${data.startDate}</div>`;
                hasData = true;
            }
            if (data.endDate) {
                html += `<div><strong>📅 도착일:</strong> ${data.endDate}</div>`;
                hasData = true;
            }
            if (data.departureAirport) {
                html += `<div><strong>🛫 출발 공항:</strong> ${data.departureAirport}</div>`;
                hasData = true;
            }
            if (data.arrivalAirport) {
                html += `<div><strong>🛬 도착 공항:</strong> ${data.arrivalAirport}</div>`;
                hasData = true;
            }
            if (data.departureFlight) {
                html += `<div><strong>✈️ 출발편:</strong> ${data.departureFlight}</div>`;
                hasData = true;
            }
            if (data.accommodation) {
                html += `<div><strong>🏨 숙소:</strong> ${data.accommodation}</div>`;
                hasData = true;
            }
            if (data.companyName) {
                html += `<div class="mt-3 pt-3 border-t"><strong class="text-blue-700">🏢 회사명:</strong> ${data.companyName}</div>`;
                hasData = true;
            }
            if (data.managerName) {
                html += `<div><strong>👤 담당자:</strong> ${data.managerName}</div>`;
                hasData = true;
            }
            if (data.managerPhone) {
                html += `<div><strong>📞 담당자 전화:</strong> ${data.managerPhone}</div>`;
                hasData = true;
            }
            if (data.managerEmail) {
                html += `<div><strong>📧 담당자 이메일:</strong> ${data.managerEmail}</div>`;
                hasData = true;
            }
            
            // 골프장 정보
            if (data.teeTimes && data.teeTimes.length > 0) {
                html += `<div class="mt-4 pt-4 border-t"><strong class="text-green-700">⛳ 골프장 정보 (${data.teeTimes.length}개):</strong></div>`;
                data.teeTimes.forEach((tee, index) => {
                    html += `
                        <div class="ml-4 mt-2 p-3 bg-green-50 rounded">
                            <div class="font-semibold text-green-800">${index + 1}. ${tee.courseName}</div>
                            ${tee.date ? `<div class="text-sm">📅 ${tee.date} ${tee.time}</div>` : ''}
                            ${tee.holes ? `<div class="text-sm">🏌️ ${tee.holes}</div>` : ''}
                            ${tee.greenFee ? `<div class="text-sm">💰 그린피: ${tee.greenFee}</div>` : ''}
                        </div>
                    `;
                });
                hasData = true;
            }
            
            // 일정 정보
            if (data.schedules && data.schedules.length > 0) {
                html += `<div class="mt-4 pt-4 border-t"><strong class="text-indigo-700">📅 일정 정보 (${data.schedules.length}개):</strong></div>`;
                data.schedules.forEach((schedule, index) => {
                    html += `
                        <div class="ml-4 mt-2 p-3 bg-indigo-50 rounded">
                            <div class="font-semibold text-indigo-800">${schedule.date}</div>
                            ${schedule.title ? `<div class="text-sm font-medium">${schedule.title}</div>` : ''}
                            ${schedule.detail ? `<div class="text-sm text-gray-600 mt-1">${schedule.detail.substring(0, 60)}${schedule.detail.length > 60 ? '...' : ''}</div>` : ''}
                        </div>
                    `;
                });
                hasData = true;
            }

            html += '</div>';

            if (!hasData) {
                html = `
                    <div class="text-center text-gray-600 py-8">
                        <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                        <p class="text-lg font-bold mb-2">추출된 데이터가 없습니다</p>
                        <p class="text-sm">엑셀 파일 형식을 확인해주세요.</p>
                        <div class="mt-4 p-4 bg-yellow-50 rounded-lg text-left">
                            <p class="font-bold mb-2">💡 Tip:</p>
                            <ul class="text-sm space-y-1 list-disc list-inside">
                                <li>첫 번째 시트에 데이터가 있는지 확인</li>
                                <li>키워드 사용: "여행명", "출발일", "도착일", "회사명" 등</li>
                                <li>날짜 형식: YYYY-MM-DD 또는 YYYY.MM.DD</li>
                            </ul>
                        </div>
                    </div>
                `;
            }

            preview.innerHTML = html;

            // 섹션 전환
            document.getElementById('uploadSection').classList.add('hidden');
            document.getElementById('previewSection').classList.remove('hidden');
        }

        // 데이터 적용
        document.getElementById('applyButton')?.addEventListener('click', () => {
            if (!extractedData) {
                alert('추출된 데이터가 없습니다.');
                return;
            }

            // localStorage에 저장
            localStorage.setItem('excelImportData', JSON.stringify(extractedData));

            // 골프 안내문 페이지로 이동
            alert('데이터를 입력 폼에 적용합니다.');
            window.location.href = '../golf/golf-advanced.html?import=excel';
        });