import { atom } from "recoil";

// 로컬 스토리지에 저장할 키 이름
const LOCAL_STORAGE_KEY = "userLocal";

// 로컬 스토리지 헬퍼 함수
const saveToStorage = (key, value) => {
	const serializedValue = JSON.stringify(value);
	localStorage.setItem(key, serializedValue);
};

const loadFromStorage = (key, defaultValue) => {
	const savedValue = localStorage.getItem(key);
	return savedValue ? JSON.parse(savedValue) : defaultValue;
};

// userState 정의
export const userState = atom({
	key: "userState",
	// 초기값: 로컬 스토리지에서 로드하거나 기본값 설정
	default: loadFromStorage(LOCAL_STORAGE_KEY, {
		isLoggedIn: false,
		user: null,
	}),
	// 로컬 스토리지와 상태 동기화
	effects_UNSTABLE: [
		({ onSet }) => {
			onSet((newValue) => {
				// 상태가 업데이트될 때 로컬 스토리지에 저장
				saveToStorage(LOCAL_STORAGE_KEY, newValue);
			});
		},
	],
});
