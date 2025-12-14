#!/bin/bash
BASE_URL="http://localhost:4000/api"

echo "1. Registering User..."
REGISTER_RES=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser_'$(date +%s)'", "password": "password123"}')
echo $REGISTER_RES

TOKEN=$(echo $REGISTER_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Login/Register failed."
  exit 1
fi

echo "2. Creating Post..."
POST_RES=$(curl -s -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Test Post", "content": "This is a test post from verification script."}')
echo $POST_RES

POST_ID=$(echo $POST_RES | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)
echo "Post ID: $POST_ID"

echo "3. Voting on Post..."
curl -s -X POST $BASE_URL/posts/$POST_ID/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type": "upvote"}'
echo ""

echo "4. Listing Posts..."
curl -s $BASE_URL/posts
echo ""
