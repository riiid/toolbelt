# gen-ssp

## SSP?

Santa Service Protocol의 약자입니다.

`riiid/santa-service-protocol`이라는 모든 개발 스키마가 들어있는 저장소가 있었고, 이 스키마 저장소로부터 생성되는
`@riiid/santa-service-protocol`이라는 npm 패키지를 내부적으로 사용하고 있었습니다.

gen-ssp는 `@riiid/santa-service-protocol`과 같은 역할을 하는 코드를 생성해주는 도구입니다.

## 설치

[toolbelt][toolbelt]를 설치하면 바로 사용할 수 있습니다.

[toolbelt]: ../README.md#Installation

## 사용법

프로젝트 폴더에서 다음과 같이 실행하면 됩니다:

```sh
yarn add grpc grpc-web protobufjs # 처음 한 번만 실행하세요.

pollapo install

# 전체 스키마 코드젠이 필요한 경우
gen-ssp run keycloak urichk rrtv2 fixture pbjs pb-service

# 백오피스 코드젠이 필요한 경우
gen-ssp run keycloak urichk fixture pbjs pb-service

# 라이브러리 코드젠이 필요한 경우
gen-ssp run pbjs

# 제품 코드젠이 필요한 경우
gen-ssp run urichk rrtv2 fixture pbjs pb-service
```
