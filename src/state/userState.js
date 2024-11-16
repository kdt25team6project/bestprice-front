import { atom, DefaultValue } from "recoil";

// 로컬 스토리지에 저장할 키 이름
const LOCAL_STORAGE_KEY = "userLocal";

// 로컬 스토리지에 저장 및 로딩 헬퍼 함수
const saveToStorage = (key, value) => {
	if (value instanceof DefaultValue) {
		localStorage.removeItem(key);
	} else {
		const serializedValue = JSON.stringify(value);
		localStorage.setItem(key, serializedValue);
	}
};

const loadFromStorage = (key) => {
	const savedValue = localStorage.getItem(key);
	return savedValue ? JSON.parse(savedValue) : null;
};

// userState 정의
export const userState = atom({
	key: "userState",
	default: loadFromStorage(LOCAL_STORAGE_KEY), // 초기값 로딩
	effects_UNSTABLE: [
		({ onSet }) => {
			onSet((newValue) => {
				// 상태가 업데이트될 때의 콜백 함수
				if (newValue instanceof DefaultValue) {
					// DefaultValue 인스턴스인 경우 저장소에서 해당 항목 제거
					localStorage.removeItem(LOCAL_STORAGE_KEY);
				} else {
					// 그렇지 않은 경우, 새로운 값 저장
					saveToStorage(LOCAL_STORAGE_KEY, newValue);
				}
			});
		},
	],
});
