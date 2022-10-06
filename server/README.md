# MEMOAPP


--------
### 작업
- 게시판 ( 사진 업로드 등 에디터 )
    - 카테고리

- 통계
- 검색엔진 최적화
- 사이트 등록
- 알림톡, 문자 메세지
- 인스타그램 연동
- 네이버 블로그 연동



npx sequelize model:create --name Product --attributes category1:integer,category2:integer,category3:integer,name:string,maker:string,origin:string,brand:string,model:string,description:string,use:boolean,memo:text,hit:integer,sold_out:boolean,content:text,price:integer,customer_price:integer

npx sequelize model:create --name ProductOption --attributes name:string

npx sequelize model:create --name ProductOptionDetail --attributes name:string name:string,use:boolean,price:integer

npx sequelize model:create --name ProductImage --attributes path:string,name:string,type:string,size:string,original_name:string
