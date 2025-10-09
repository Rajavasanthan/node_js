## This is the API for Fetching all the User list

curl --location 'http://localhost:8000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email" : "admin@gmail.com",
    "password" : "Admin@123"
}'
