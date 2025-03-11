## APIs

Okay, So mein ethe jo bhi routes ha woh likh raha ha just for our reference.

### 1. `/api/auth/`:
a. `/api/auth/register`: `POST`
```json
{
    "name": "Pulkit Garg",
    "email": "pulkitgargbnl@gmail.com",
    "password": "password"
}
```
![Register](./server/images/register.png)

b. `/api/auth/login`: `POST`
```json
{
    "email": "pulkitgargbnl@gmail.com",
    "password": "password"
}
```
![Login](./server/images/login.png)

c. `/api/auth/me`: `GET`
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkZjhlMTM4NzA2ZmFiN2RhMGNmYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxNjc2NDk1LCJleHAiOjE3NDQyNjg0OTV9.QC7XnYOD8bnwVv95Uh2aQ_yZ26ZR_SZ2hFuGuwLq5vY
```
![me](./server/images/me.png)

d. `/api/auth/logout`: `GET`
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2ZkZjhlMTM4NzA2ZmFiN2RhMGNmYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxNjc2NDk1LCJleHAiOjE3NDQyNjg0OTV9.QC7XnYOD8bnwVv95Uh2aQ_yZ26ZR_SZ2hFuGuwLq5vY
```
![logout](./server/images/logout.png)

### 2. `/api/lodges`:
a. `/api/lodges/`: `POST`
```json
{
  "name": "Mountain View Retreat",
  "description": "A luxurious retreat nestled in the mountains, offering breathtaking views and world-class amenities for a relaxing vacation.",
  "location": "Manali, Himachal Pradesh, India",
  "address": "123 Himalayan Street, Near Old Manali Bridge, Manali, HP 175131",
  "price": 12000,
  "capacity": 8,
  "rooms": 4,
  "bathrooms": 3,
  "amenities": [
    "Wi-Fi",
    "Swimming Pool",
    "Hot Tub",
    "Fully Equipped Kitchen",
    "Fireplace",
    "24/7 Security",
    "Free Parking",
    "Air Conditioning",
    "Mountain View"
  ],
  "type": "Villa",
  "images": [
    "https://example.com/images/lodge1.jpg",
    "https://example.com/images/lodge2.jpg",
    "https://example.com/images/lodge3.jpg"
  ],
  "rating": 4.8,
  "featured": true
}
```
![create lodge](./server/images/create-lodge.png)

b. `/api/lodges/:lodgeId`: `GET`

Example:
```
/api/lodges/67cfe1a4138706fab7da0d00
```
![get lodge](./server/images/single-lodge.png)

c. `/api/lodges/featured`: `GET`
![Featured](./server/images/featured.png)

d. `/api/lodges/:lodgeId`: `PUT`
Example:
```
/api/lodges/67cfe1a4138706fab7da0d00
```
![Put lodge](./server/images/update-lodge.png)

e. `/api/lodges/:lodgeId`: `DELETE`
Example:
```
/api/lodges/67cfe1a4138706fab7da0d00
```
![Put lodge](./server/images/delete-lodge.png)