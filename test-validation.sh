#!/bin/bash

# Test script for Input Validation

API_URL="http://localhost:4000"

echo "=== Testing Input Validation ==="
echo ""

# 1. Test Register - Missing Email
echo "1. Register - Missing Email (should fail)"
curl -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{"password":"123456","passwordConfirm":"123456"}' 
echo ""
echo ""

# 2. Test Register - Invalid Email Format
echo "2. Register - Invalid Email Format (should fail)"
curl -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123456","passwordConfirm":"123456"}' 
echo ""
echo ""

# 3. Test Register - Password too short
echo "3. Register - Password too short (should fail)"
curl -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123","passwordConfirm":"123"}' 
echo ""
echo ""

# 4. Test Register - Passwords don't match
echo "4. Register - Passwords don't match (should fail)"
curl -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","passwordConfirm":"654321"}' 
echo ""
echo ""

# 5. Test Register - Valid
echo "5. Register - Valid (should succeed)"
RESPONSE=$(curl -s -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456","passwordConfirm":"123456"}')
echo $RESPONSE
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""
echo ""

# 6. Test Login - Invalid Email
echo "6. Login - Invalid Email (should fail)"
curl -X POST $API_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"123456"}' 
echo ""
echo ""

# 7. Test Create Book - Missing Title
echo "7. Create Book - Missing Title (should fail)"
curl -X POST $API_URL/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"authorId":1}' 
echo ""
echo ""

# 8. Test Create Book - Invalid Author ID
echo "8. Create Book - Invalid Author ID (should fail)"
curl -X POST $API_URL/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Book","authorId":"not-a-number"}' 
echo ""
echo ""

# 9. Test Create Author - Missing Name
echo "9. Create Author - Missing Name (should fail)"
curl -X POST $API_URL/authors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"bio":"Some bio"}' 
echo ""
echo ""

# 10. Test Create Author - Valid
echo "10. Create Author - Valid (should succeed)"
AUTHOR_RESPONSE=$(curl -s -X POST $API_URL/authors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"J.R.R. Tolkien","bio":"British philologist and author"}')
echo $AUTHOR_RESPONSE
AUTHOR_ID=$(echo $AUTHOR_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Author ID: $AUTHOR_ID"
echo ""
echo ""

echo "=== Validation Tests Complete ==="
