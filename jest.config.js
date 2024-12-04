module.exports = {
    // node_modules에서 axios를 변환하도록 설정
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/" // axios는 ES 모듈을 사용하므로 처리해야 함
    ],
    // 필요한 경우 추가적인 Jest 설정을 추가할 수 있습니다.
    testEnvironment: 'jsdom', // React 환경에서 테스트 실행을 위한 설정
  };
  