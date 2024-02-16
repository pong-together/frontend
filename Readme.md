# 퐁 투게더

## 커밋 컨벤션

```jsx
feat/#1: message
```

```
merge: 풀리퀘스트 합병에 대한 커밋
feat : 새로운 기능에 대한 커밋
fix : 버그 수정에 대한 커밋
build : 빌드 관련 파일 수정에 대한 커밋
chore : 그 외 자잘한 수정에 대한 커밋
docs : 문서 수정에 대한 커밋
refactor : 코드 리팩토링에 대한 커밋
test : 테스트 코드 수정에 대한 커밋
design : 사용자 UI 디자인의 변경에 대한 커밋
```

## 깃이슈 사용

- 자신이 담당하는 큰 이슈 하나 생성
- 한 이슈를 팔때마다 반드시 브랜치를 생성해서 작업하기
- [커밋컨벤션]/#[이슈넘버] 형식으로 작성하기
```jsx
feat/#1
```

## 코드 컨벤션

- 꼭 세미콜론 붙여서 작성하기

### 변수 네이밍

- 변수명에 밑줄 사용하지 않음
- this 쓸 때는 화살표함수나 바인딩 써서 작성하기
- export되는 파일 내의 모든 상수는 **모두 대문자**로 표기
- 상수는 모두 대문자로 통일
- 변수명은 **lowerCamelCase**로 통일, 시작은 소문자 (ex. `helloWorld`)
- 이름에 복수형을 표기하지 않음

### 파일

- 모든 디렉토리는 소문자
- default export를 파일명과 통일

### 함수 네이밍

- **lowerCamelCase**로 통일
- 예외)함수를 export default로 내보낼 때만 파일명과 다르게 작성

### 객체 네이밍

- **lowerCamelCase**로 통일
- 객체를 export할 때는 **PascalCase**로 표기

```jsx
const AirbnbStyleGuide = {
  es6: {
  },
};

export default AirbnbStyleGuide;
```

### 클래스

- **PascalCase**로 표기
- 클래스 이름은 명사/명사구문 사용
