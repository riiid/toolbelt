# keycloak tools

## riiid-extract-keycloak-groups

protobuf 스키마에 들어있는 rpc -> keycloak group 매핑을 추출합니다.

Extract the rpc -> keycloak group mapping from the protobuf schema.

### 설치 Installation

[toolbelt][toolbelt]를 설치하면 바로 사용할 수 있습니다.

Install the [toolbelt][toolbelt] and you're ready to go.

[toolbelt]: ../README.md#Installation

#### 직접 설치 Manual installation

```sh
git clone git@github.com:riiid/toolbelt.git
deno install -n riiid-extract-keycloak-groups -A --unstable toolbelt/keycloak/extract-group-mapping-from-proto-services.ts
```

### 사용 Usage

이런 내용이 들어있는 `.proto` 스키마 파일이 있을 때

When there is a `.proto` schema file that contains these contents

```proto
syntax = "proto3";
package toeic.backoffice;
import "riiid/interface-common-model/common.proto";

service BackofficeCouponService {
  rpc ListCoupons(ListCouponsRequest) returns (ListCouponsResponse) {
    option (inside.keycloak_group) = "toeic/backoffice/coupon";
  }
  rpc GetCoupon(GetCouponRequest) returns (GetCouponResponse) {
    option (inside.keycloak_group) = "toeic/backoffice/coupon";
  }
}
```

다음과 같은 결과를 뽑아볼 수 있습니다.

You can extract below results.

`riiid-extract-keycloak-groups <proto-files-path>`

```json
{
  "toeic.backoffice.BackofficeCouponService/ListCoupons": [
    "toeic/backoffice/coupon"
  ],
  "toeic.backoffice.BackofficeCouponService/GetCoupon": [
    "toeic/backoffice/coupon"
  ]
}
```

`riiid-extract-keycloak-groups <proto-files-path> --invert`

```json
{
  "toeic/backoffice/coupon": [
    "toeic.backoffice.BackofficeCouponService/ListCoupons",
    "toeic.backoffice.BackofficeCouponService/GetCoupon"
  ]
}
```

`riiid-extract-keycloak-groups <proto-files-path> --invert --yaml`

```yaml
toeic/backoffice/coupon:
  - toeic.backoffice.BackofficeCouponService/ListCoupons
  - toeic.backoffice.BackofficeCouponService/GetCoupon
```

### 응용 Application

[jq][jq]를 사용해서 특정 keycloak group을 가지는 rpc 목록만 추출할 수도 있습니다.

You can use [jq][jq] to extract only the list of rpc with a specific keycloak
group.

[jq]: https://stedolan.github.io/jq/

`riiid-extract-keycloak-groups <proto-files-path> --invert | jq '."toeic/backoffice/coupon"'`

```json
[
  "toeic.backoffice.BackofficeCouponService/ListCoupons",
  "toeic.backoffice.BackofficeCouponService/GetCoupon"
]
```
