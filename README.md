# [PNU의 민족 - DB 텀 프로젝트를 NodeJS로 웹으로 구현하기](https://kc29be941feb6a.user-app.krampoline.com/)

<p align='center'>
<img width="309" alt="스크린샷 2024-02-17 오후 3 28 37" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/0f48f479-391e-4788-bec3-9358cd5c9003">

</p>

<p align='center'>
    <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">
    <img src="https://img.shields.io/badge/nodedotjs-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
    <img src="https://img.shields.io/badge/nodemon-8F0000?style=for-the-badge&logo=nodemon&logoColor=white">
    <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
    <img src="https://img.shields.io/badge/html5-E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white">
</p>

<br/>


# 목차
1. [프로젝트 소개](#프로젝트-소개)
2. [주요 기능](#주요-기능)
3. [ERD Diagram](#ERD-Diagram)
4. [API 명세서](#api-명세서)
5. [유저 시나리오](#유저-시나리오)

<br/>
<br/>


# 프로젝트 소개
데이터 베이스 텀프로젝트에서 만든 CLI 프로그램을 웹으로 구현해 본 프로젝트입니다!<br/>
웹응용프로그래밍이라는 수업에서 JavaScript와 NodeJS를 배우고 있어서, 이 기술들을 사용하여 웹으로 만들어 보았습니다.  


<br/>
<br/>


# 주요 기능

이 웹 애플리케이션은 사용자, 배달원, 그리고 식당 운영자 간의 상호작용을 용이하게 하는 다양한 기능들을 제공합니다.

## 사용자
- **회원가입 및 로그인**
- **음식점 검색 및 주문**: 사용자는 원하는 조건에 맞는 음식점을 검색하고, 메뉴를 선택하여 주문할 수 있습니다.
- **배달 상태 확인**: 주문한 음식의 배달 상태를 실시간으로 확인할 수 있으며, 배달 완료까지의 전 과정을 추적할 수 있습니다.
- **리뷰 작성**: 주문한 음식에 대한 만족도를 리뷰로 남길 수 있으며, 별점을 통해 평가할 수 있습니다.

## 배달원
- **배달 요청 수락/거절**: 배달원은 배달 요청을 받고 이를 수락하거나 거절할 수 있습니다. 이를 통해 배달 과정을 관리할 수 있습니다.
- **배달 상태 업데이트**: 배달 과정에서의 상태(배달 중, 배달 완료 등)를 업데이트할 수 있으며, 이는 식당과 사용자에게 실시간으로 반영됩니다.

## 식당 운영자
- **음식점 및 메뉴 관리**: 식당 정보를 등록하고 메뉴를 추가, 수정, 삭제할 수 있습니다. 
- **주문 관리**: 들어온 주문을 관리하고, 주문 상태(조리 중, 조리 완료 등)를 업데이트할 수 있습니다. 이 정보는 배달원과 사용자에게 전달됩니다.
- **리뷰 확인**: 사용자가 작성한 리뷰를 확인할 수 있으며, 이를 통해 서비스 개선에 활용할 수 있습니다.

## 추가 기능
- **유저 역할 설정**: 시스템 내에서의 사용자 역할(고객, 배달원, 식당 운영자)을 설정할 수 있으며, 이에 따라 이용 가능한 기능이 달라집니다.
- **세션 관리**: 사용자의 로그인 상태를 유지하며, 세션을 통해 안전한 사용자 인증을 보장합니다.

이 프로젝트는 NodeJS와 Express를 사용하여 구현되었으며, 실시간 데이터 처리와 사용자 경험 향상에 중점을 두고 개발되었습니다!


</br>
</br>


# ERD Diagram
![PNU의 민족](https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/84458ae2-c96a-4c92-922a-f1abbb72ee10)

<br/>
<br/>

# API 명세서

## 인증 API
- **회원가입**
  - `POST /user/join`
- **로그인**
  - `POST /user/login`
- **로그아웃**
  - `GET /user/logout`

## 배달 API
- **배달 요청**
  - `POST /delivery`
- **배달 리스트 조회** (세션의 배달 기사 ID로 조회)
  - `GET /delivery`
- **배달 수락**
  - `POST /delivery/accept`
- **배달 완료**
  - `POST /delivery/finish`
- **배달 요청 목록 조회**
  - `GET /delivery/request`
- **주문 이력 조회**
  - `GET /delivery/history`

## 주문
- **주문 생성**
  - `POST /orders`
- **주문 조회**
  - `GET /orders`
- **완료된 주문 이력 조회**
  - `GET /orders/finish`
- **각 주문에 대한 배달 상태 조회**
  - `GET /orders/:orderId/delivery`

## 식당
- **음식점 등록**
  - `POST /restaurants`
- **음식점 정보 조회** (쿼리 문자열로 조회)
  - `GET /restaurants/search`
- **음식점 정보 조회** (세션의 소유주 ID로 조회)
  - `GET /restaurants`
- **음식점 업데이트**
  - `PUT /restaurants/:restaurantId`
- **메뉴 등록**
  - `POST /restaurants/:restaurantId/menus`
- **메뉴 조회**
  - `GET /restaurants/:restaurantId/menus`
- **메뉴 수정**
  - `PUT /restaurants/menus/:menuId`
- **메뉴 삭제**
  - `DELETE /restaurants/menus/:menuId`
- **주문 이력과 조회**
  - `GET /restaurants/:restaurantId/orders`
- **주문 이력 조회** (배달 매칭 됨)
  - `GET /restaurants/:restaurantId/orders/matched`
- **주문 완료 처리**
  - `PUT /restaurants/:orderId/finish`

## 리뷰
- **리뷰 작성**
  - `POST /reviews`
- **리뷰 확인** (식당 주인별)
  - `GET /reviews/restaurant/:restaurantId`

## 유저
- **유저 역할 설정**
  - `POST /user/role`
- **유저 이름 조회**
  - `GET /user/name`
- **배달원 추가 정보 입력**
  - `PATCH /user/deliveryPerson`
- **유저 삭제**
  - `DELETE /user`

</br>
</br>

# 유저 시나리오
사용자, 배달원, 식당 운영자가 서비스에 참여하게 되는데, 사용자의 주문부터 배달 완료 그리고 리뷰 작성까지 순차적으로 시나리오를 서술해보겠습니다.</br>
</br>
우선 첫 화면은 로그인 화면입니다.</br>
</br>
<img width="1291" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_7 36 16" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/0ecbe33d-5e76-479f-ab13-3bd68c996395">
</br>
</br>
서비스 사용을 위해 회원가입을 합니다.</br>
</br>
<img width="1285" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_7 37 04" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/73aea2e7-1757-4e2e-9a92-62b35030c0d4">
</br>
</br>
역할에는 고객, 배달원, 식당 운영자가 있고, 역할에 따른 기능이 다르게 제공됩니다.</br>
즉, 역할에 따라 로그인을 했을 때 보여지는 페이지가 달라지게 됩니다.</br>
</br>
만약, 식당 운영자가 로그인을 했을 경우, 다음과 같은 메인 화면이 등장합니다.</br>
<img width="1294" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 43 38" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/1e36eeda-30f1-4f9e-828c-e84b944a2507">
</br>
</br>
'음식점 정보 등록'은 운영하는 식당을 배달 서비스에 등록하기 위한 기능입니다.</br>
'음식점 정보 업데이트'는 식당의 주소, 이름등이 변경되었을 때 업데이트 하기 위한 기능입니다.</br>
'메뉴 관리'는 메뉴를 등록, 수정, 삭제할 수 있는 기능입니다.</br>
'조리 완료 처리'는 배달원이 매칭되고, 조리를 해서 완료했을 때, 이를 반영하기 위한 기능입니다. 조리를 완료하면, 배달원이 배달을 진행할 수 있습니다.</br>
'주문 요청/내역 조회'에서는 이때까지 식당에 들어온 주문의 내역들을 확인할 수 있습니다.</br>
'리뷰 확인'은 고객이 남긴 리뷰를 확인할 수 있습니다.</br>
</br>
식당 운영자가 가장 먼저 해야 할 음식점 등록입니다. 여기서 서비스 지역은 배달 서비스를 제공할 지역을 의미합니다.</br>
서비스 지역을 설정하면, 해당 구역에서 배달을 수행하는 배달원들과 매칭이 됩니다.</br>
</br>
<img width="1283" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 42 46" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/7e5964da-4e16-4eed-b103-77c5b58981c2">
</br>
</br>
등록 후 아래와 같이 음식점 정보는 수정이 가능합니다.</br>
</br>
<img width="1294" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 40 59" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/648e4d7f-8069-447b-9215-bc37ef9f57f9">
</br>
</br>
음식점을 등록하고 메뉴를 등록합니다.</br>
</br>
<img width="1293" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 39 51" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/232b4280-9ea1-471a-81ac-c062c9355452">
</br>
</br>
메뉴 또한 수정과 삭제가 가능합니다. DB와 연동되어 등록한 메뉴가 나오도록 구현했습니다.</br>
</br>
<img width="1285" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 40 23" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/9c7536c0-2f76-4f43-9405-3ac696fd2938">
</br>
</br>
</br>
</br>
<img width="742" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 14 54" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/0bf528d0-34c6-461f-a971-3744d5f86fa3">
</br>
</br>
수정 완료를 누르면 위와 같이 DB에 반영됩니다.</br>
</br>
이제 고객의 화면으로 이동해보겠습니다.</br>
</br>
<img width="1293" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 43 56" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/131925d2-c003-4bf9-b98f-e4561e725a04">
</br>
</br>
고객은 지역, 음식 종류, 음식점 이름을 입력해서 음식점을 검색할 수 있습니다.</br>
모든 정보를 입력하지 않아도, 입력한 정보를 바탕으로 검색할 수 있도록 구현하였습니다.</br>
</br>
<img width="1292" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 44 17" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/7dc55c4e-747d-456a-bed3-0ef492c6e87d">
</br>
</br>
음식점을 고르고 메뉴 확인 버튼을 누르면 메뉴를 확인할 수 있습니다.</br>
여기서는 메뉴와 가격이 보이고, 주문 버튼을 누르면 주문이 완료됩니다.</br>
배달 가능한 배달원이 없다거나, 식당 운영자가 메뉴를 하나도 등록하지 않았을 때의 예외 처리를 했습니다.</br>
</br>
<img width="1297" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 44 43" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/2477d8b9-03a3-4ba0-b426-bc80de98f5ac">
</br>
</br>
주문을 마치면, 주문이 생성되고 배달도 생성됩니다.</br>
주문은 식당과 배달원에게 가게 되는데, 배달원의 경우 배달을 진행하고 있지 않고, 해당 서비스 지역에 있는 배달원 중 랜덤으로 매칭하게 됩니다. 여기서 배달원이 요청을 거절할 수도 있습니다. 요청을 거절하게 되면 재주문을 해야합니다.</br>
</br>
<img width="1407" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 46 09" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/a817ec8d-9d75-4139-b4c7-827270ac0db0">
</br>
</br>
배달을 진행할 배달원의 화면으로 이동해보겠습니다.</br>
</br>
<img width="1466" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 51 32" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/4e7c6ff8-bba8-400a-9f39-90af41e5eec7">
</br>
</br>
배달 요청 확인 및 수락 기능은 배달 요청이 들어온 것을 확인할 수 있고, 수락하거나 수락하지 않을 수 있습니다. 수락하게 되면, 식당 운영자도 '주문 이력 조회' 기능을 이를 확인할 수 있고, 조리를 시작하게 됩니다.</br>
</br>
<img width="1467" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 51 52" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/0897797e-5709-4d5c-ab35-ed861753271a">
</br>
</br>
다음은 식당 운영자의 기능 중 '조리 완료 처리' 입니다. 즉, 배달이 가능한 상태가 됩니다. 조리 완료 처리가 되면, 배달원이 음식을 배달하게 됩니다.</br>
(화면에는 주문 완료 처리라고 나오는데, 조리 완료 처리로 수정되었습니다)</br>
</br>
<img width="1466" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_5 53 10" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/7f5c69b2-76bb-4daf-a243-dd0b8c580bd7">
</br>
</br>
다음은 배달원의 기능 중 '배달 완료 처리'입니다. 식당 운영자가 조리를 마치고 배달을 수행해서 완료하면, 배달 완료 처리를 하게 됩니다. 배달 완료 처리가 된것은 식당 운영자가 조회 가능하도록 구현하였습니다.</br>
</br>
<img width="1470" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 05 33" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/ca046c19-6b7f-47d1-ab78-bd1c0c947a77">
</br>
</br>
완료한 배달은 '배달 이력' 기능을 통해 이력을 확인할 수 있습니다. 시간, 배달 주소, 가게 이름, 메뉴까지 조회할 수 있도록 구현하였습니다.</br>
</br>
<img width="1470" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 06 10" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/7b5b5d1b-1b47-4b4a-a2da-5f5db1bdc4c3">
</br>
</br>
배달 매칭부터 조리, 배달, 배달완료까지 오면서 사용자는 '배달 상태 확인'을 통해 중간중간 배달 현황을 확인할 수 있습니다.</br>
</br>
<img width="1470" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 06 37" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/52f6dd29-49af-474c-98ec-71814d2120ed">
</br>
</br>
식당 주인도 마찬가지로 '주문 이력 조회' 기능을 통해 주문 상태를 실시간으로 계속 확인할 수 있고, 이때까지 들어온 주문의 이력들을 모두 확인할 수 있습니다.</br>
</br>
<img width="1470" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 08 01" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/e4979b69-3c3d-4d13-8fbe-f512cda814fd">
</br>
</br>
배달이 완료 되고 사용자는 주문한 음식에 대해 '리뷰 작성하기'를 통해 리뷰를 작성할 수 있습니다.</br>
</br>
<img width="1470" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 12 01" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/16e1cf75-6e87-45a3-aa51-3e65edfe1004">
</br>
</br>
리뷰는 별점과 내용을 입력할 수 있고, 식당 운영자도 확인할 수 있도록 구현하였습니다.</br>
</br>
<img width="1470" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 11 48" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/72d770bb-5081-497f-9a04-079de2edf9a2">
</br>
</br>
다음은 식당 운영자가 이용할 수 있는 '리뷰 조회' 기능입니다. 이를 통해 식당에 대한 리뷰들을 확인할 수 있습니다.</br>
</br>
<img width="1469" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 10 58" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/4a6f1ec3-3c5a-42eb-9943-837e6aa0c864">
</br>
</br>
<img width="781" alt="%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-12-04_%EC%98%A4%ED%9B%84_6 13 36" src="https://github.com/hoyaii/TermProject-DeliveryService-NodeJS/assets/131665728/364be1aa-8345-49f1-8bcb-f46528c3a657">
