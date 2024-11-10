from fastapi import FastAPI, HTTPException, Query, Request
from pydantic import BaseModel

from DB_Interface import add_address, get_user_addresses, login_user, register_user

app = FastAPI()

@app.post("/login")
async def login(request: Request):
    user_data = await request.json()
    response = login_user(user_data)
    return response

@app.get("/test")
async def show():
    return{"message": "hi"}

@app.post("/register")
async def register(request: Request):
    try:
        user_data = await request.json()
        print("Received user data:", user_data)  # Debugging
        register_user(user_data)
        return {"message": "User registered successfully"}
    except Exception as e:
        print("Error:", str(e))  # Debugging
        raise HTTPException(status_code=400, detail=f"Bad request: {str(e)}")
    
@app.post("/address")
async def address(request: Request):
    try:
        user_data = await request.json()
        print("Received address data:", user_data)  # Debugging
        add_address(user_data)
        return {"message": "address added successfully"}
    except Exception as e:
        print("Error:", str(e))  # Debugging
        raise HTTPException(status_code=400, detail=f"Bad request: {str(e)}")
    
@app.get("/get-address")
async def read_user_addresses(data: int = Query(...)):
    addresses = get_user_addresses(data)
    if not addresses:
        raise HTTPException(status_code=404, detail="No addresses found for this user.")
    return {"addresses": addresses}