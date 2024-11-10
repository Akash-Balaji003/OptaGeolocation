from datetime import datetime, timedelta
from typing import Dict, List
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from passlib.context import CryptContext
import pymysql
from pymysql.cursors import DictCursor


# Secret key and algorithm for encoding/decoding JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing and verification setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper functions for hashing and verifying password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str):
    return pwd_context.hash(password)

# Database connection function
def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Akash003!",
        database="opta",
        cursorclass=DictCursor
    )

# Function to create a JWT token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Login function with JWT-based authentication
def login_user(user_data: dict):
    connection = get_db_connection()
    cursor = connection.cursor()  # Fetch results as dictionary

    try:
        # Check if user exists and retrieve profiles
        query = """
            SELECT user_id, password, user_name, phone_number
            FROM Users
            WHERE phone_number = %s
        """
        cursor.execute(query, (user_data['phone_number'],))
        db_user_profiles = cursor.fetchall()

        if not db_user_profiles:
            print("User not found")
            raise HTTPException(status_code=401, detail="Invalid credentials")

        is_password_correct = verify_password(user_data['password'], db_user_profiles[0]['password'])
        print("Password correct:", is_password_correct)

        if not is_password_correct:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Extract user info from the first result
        db_user = db_user_profiles[0]

        # Create JWT token
        token_data = {"sub": db_user['user_id']}
        access_token = create_access_token(data=token_data)

        # Return user details along with profile_ids and access token
        return {
            "user_id": db_user['user_id'],
            "Name": db_user['user_name'],
            "Mobile Number": db_user['phone_number'],
            "access_token": access_token,
            "token_type": "bearer",
        }
    
    except pymysql.connect.Error as err:
        raise HTTPException(status_code=500, detail=f"Error: {err}")
    
    finally:
        cursor.close()
        connection.close()

# Registeration function
def register_user(user_data: dict):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Hash the password before storing it
    hashed_password = hash_password(user_data['password'])

    try:
        # Insert into Users table
        query_users = """INSERT INTO Users (password, user_name, phone_number) 
                         VALUES (%s, %s, %s)"""
        cursor.execute(query_users, (hashed_password, user_data['user_name'], user_data['phone_number']))
        
        connection.commit()
    
    except pymysql.connect.Error as err:
        connection.rollback()
        print("Database error:", err)  # Debugging
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    
    finally:
        cursor.close()
        connection.close()

# Adding address for the users
def add_address(address_data: dict):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert into Addresses table
        query_address = """INSERT INTO addresses (user_id, address, tag) 
                           VALUES (%s, %s, %s)"""
        cursor.execute(query_address, (address_data['user_id'], address_data['address'], address_data['tag']))
        
        connection.commit()
    
    except pymysql.connect.Error as err:
        connection.rollback()
        print("Database error:", err)  # Debugging
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    
    finally:
        cursor.close()
        connection.close()

# Function to get list of all addressess for a user
def get_user_addresses(user_id: int) -> List[Dict]:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="Akash003!",
        database="opta",
        cursorclass=DictCursor
    )
    try:
        with conn.cursor() as cursor:
            query = "SELECT address, tag FROM addresses WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            addresses = cursor.fetchall()
        return addresses
    finally:
        conn.close()
