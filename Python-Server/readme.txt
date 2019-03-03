Example Curl:
1) Take off:
curl -X POST \
  http://localhost:5000/command \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 59969cc7-49d5-407b-bc02-13a475b95626' \
  -H 'cache-control: no-cache' \
  -d '{
    "id": 1

}'

2) Move:
curl -X POST \
  http://localhost:5000/command \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 52b3a298-7520-4592-b50c-9a499ad1e3ae' \
  -H 'cache-control: no-cache' \
  -d '{
    "id": 2,
    "args": {
        "x": 10,
        "y": 700,
        "z": -34,
        "v": 200
    }
}'

3) Land:
curl -X POST \
  http://localhost:5000/command \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 837c1aa4-caa6-419c-836d-86d1831fb0cd' \
  -H 'cache-control: no-cache' \
  -d '{
    "id": 3

}'

4) Move Camera

curl -X POST \
  http://localhost:5000/command \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 63eb84c1-7fe5-4791-bc28-fdd57218b15f' \
  -H 'cache-control: no-cache' \
  -d '{
    "id": 4,
    "args": {
        "orientation": {
            "w_val": 1,
            "x_val": 0,
            "y_val": 0,
            "z_val": 0
        }
    }
}'

Note: Use only z_value(0 < z_value < 1) for now.